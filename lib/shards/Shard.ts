import {
    APIGatewayBotInfo,
    GatewayDispatchEvents,
    GatewayDispatchPayload,
    GatewayHeartbeat,
    GatewayIdentify,
    GatewayOpcodes,
    GatewayPresenceUpdateData,
    GatewayReceivePayload,
    GatewayResume,
} from "discord-api-types/v9";

import WebSocket from "ws";
import Client from "../Client";
import * as ClientIntents from "../client/ClientIntents";
import { PresenceIndicators, PresenceOptions } from "../handlers/ClientPresenceHandler";
import { makeToken } from "../rest/RequestHandler";
import { Channel } from "../structures/Channel";
import ClientUser from "../structures/ClientUser";
import Guild from "../structures/Guild";
import Message from "../structures/Message";
import { PartialGuildMember } from "../structures/Types";
import { API_VERSION } from "../util/Constants";

export class Shard {
    public options: ShardOptions;
    public got_heartbeat: boolean;
    public seq: number | null;
    public session_id: string | null;
    public state: "closed" | "connecting" | "connected";
    public client: Client;
    public latency: number;
    public heartBeatTime: NodeJS.Timeout | undefined;

    public ws: WebSocket;

    public constructor(options: ShardOptions) {
        this.options = options;
        this.got_heartbeat = false;
        this.seq = null;
        this.session_id = null;
        this.state = "closed";
        this.client = options.client;
        this.latency = 0;
        this.heartBeatTime = undefined;

        this.ws = new WebSocket(options.data.url + '/' + `?v=${API_VERSION}` + "&encoding=json");
    }

    public get id() {
        return this.options.id;
    }

    public get data() {
        return this.options.data;
    }

    public start() {
        this.ws.on("message", (data) => this.onMessage(JSON.parse(data.toString())));
        this.ws.on("open", () => this.onOpen());
        this.ws.on("error", (err) => this.onError(err));
        this.ws.on("close", (code, reason) => this.onClose(code, reason.toString("utf-8")));
    }

    public onOpen() {
        this.state = "connecting";
        this.client.emit("shard_status_change", "connecting", this.id);
    }

    public initStatus(options: GatewayPresenceUpdateData) {
        this.send({ op: GatewayOpcodes.PresenceUpdate, d: options });
    }

    public onError(err: Error) {
        this.client.emit("error", err);
    }

    public onClose(code: number, reason: string) {
        if (this.client.options.debug) {
            console.log(`${code} - ${reason}`);
        }
    }

    public onMessage(packet: GatewayReceivePayload) {
        switch (packet.op) {
            case GatewayOpcodes.Hello:
                if (!this.session_id) {
                    this.identify();
                    this.heartbeat(false, packet.d.heartbeat_interval);
                } else {
                    this.resume();
                }
                break;
            case GatewayOpcodes.Dispatch:
                this.onPacket(packet);
                break;
        }
    }

    public onPacket(packet: GatewayDispatchPayload) {
        switch (packet.t) {
            case GatewayDispatchEvents.Ready:
                this.seq = packet.s;
                this.session_id = packet.d.session_id;
                this.state = "connected";
                this.client.emit("shard_status_change", "connected", this.id);
                this.client.user = new ClientUser(packet.d.user);
                this.client.emit("ready");
                break;
            case GatewayDispatchEvents.MessageCreate:
                let message = new Message(packet.d, this.client);
                this.client.emit("message_create", message);
                break;
            case GatewayDispatchEvents.GuildCreate:
                if (!packet.d.unavailable) {
                    let guild = new Guild(packet.d, this.client);

                    if (packet.d.channels && packet.d.channels.length) {
                        for (let channel of packet.d.channels) {
                            let data = new Channel(channel, this.client);
                            guild.channels.set(channel.id, data.get());
                            this.client.channels.set(channel.id, data.get());
                        }
                    }

                    this.client.emit("guild_create", guild);
                }
                break;
            case GatewayDispatchEvents.ChannelCreate:
                let channel = new Channel(packet.d, this.client);
                this.client.channels.set(packet.d.id, channel.get());
                break;
            case GatewayDispatchEvents.GuildMemberUpdate:
                let guild = this.client.guilds.get(packet.d.guild_id);

                if (!guild) {
                    if (this.client.options.debug) {
                        console.log(`Unknown guild! ${packet.d.guild_id}`);
                    }
                    return;
                }

                let member = guild.members.get(packet.d.user.id);

                if (!member) {
                    if (this.client.options.debug) {
                        console.log(`Unknown member! ${packet.d.user.id}`);
                    }
                    return;
                }

                let oldMember: PartialGuildMember = {
                    premiumSince: member.premiumSince,
                };

                member = member._update(packet.d);

                if (!oldMember.premiumSince && member.premiumSince) {
                    this.client.emit("guild_member_boost", member);
                }

                if (oldMember.premiumSince && !member.premiumSince) {
                    this.client.emit("guild_member_unboost", member);
                }

                this.client.emit("member_update", oldMember, member);
        }
    }

    public resume() {
        if (this.client.options.debug) {
            console.log(`Resuming on gateway shard ${this.id}`);
        }
        let data: GatewayResume = {
            op: GatewayOpcodes.Resume,
            d: {
                token: makeToken(this.client.token),
                seq: this.seq!,
                session_id: this.session_id!
            }
        };

        this.send(data);
    }

    // TODO: use this when the chance is there
    public crush() {
        this.ws.close(1000, "Promethean connection close");
        if (this.heartBeatTime) {
            clearInterval(this.heartBeatTime);
        }
        this.run();
    }

    public identify() {
        let data: GatewayIdentify = {
            op: 2,
            d: {
                token: makeToken(this.client.token),
                intents: ClientIntents.resolve(this.client.options.intents),
                properties: {
                    $browser: "Promethean",
                    $device: "Promethean",
                    $os: process.platform,
                },
                large_threshold: 250,
            }
        };

        if (this.client.shards.size > 1) {
            data.d.shard = [this.id, this.client.shards.size];
        }

        this.send(data);
    }

    public heartbeat(once: boolean, time?: number) {
        if (once && !time) {
            this.send<GatewayHeartbeat>({
                op: 1,
                d: this.seq
            });
        } else {
            if (!this.got_heartbeat) {
                this.got_heartbeat = true;
                this.heartBeatTime = setInterval(() => this.send<GatewayHeartbeat>({
                    op: 1,
                    d: this.seq
                }), time);
            }
        }
    }

    public send<T>(payload: T) {
        return this.ws.send(JSON.stringify(payload));
    }

    public run() {
        this.start();
        return this;
    }
}

export interface ShardOptions {
    data: APIGatewayBotInfo;
    id: number;
    client: Client;
}