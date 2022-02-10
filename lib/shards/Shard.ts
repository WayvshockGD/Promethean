import { 
    APIGatewayBotInfo,
    GatewayDispatchEvents,
    GatewayDispatchPayload,
    GatewayHeartbeat,
    GatewayIdentify,
    GatewayOpcodes, 
    GatewayReceivePayload 
} from "discord-api-types/v9";

import WebSocket from "ws";
import Client from "../Client";
import * as ClientIntents from "../client/ClientIntents";
import { makeToken } from "../rest/RequestHandler";
import { Channel } from "../structures/Channel";
import ClientUser from "../structures/ClientUser";
import Guild from "../structures/Guild";
import Message from "../structures/Message";

export class Shard {
    public options: ShardOptions;
    public got_heartbeat: boolean;
    public seq: number | null;
    public session_id: string | null;
    public state: "closed" | "connecting" | "connected";
    public ws: WebSocket;

    public constructor(options: ShardOptions) {
        this.options = options;
        this.got_heartbeat = false;
        this.seq = null;
        this.session_id = null;
        this.state = "closed";

        this.ws = new WebSocket(options.data.url + '/');
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
    }

    public onOpen() {
        this.state = "connecting";
    }

    public onError(err: Error) {
        console.log(`${err.message} on Websocket`);
    }

    public onMessage(packet: GatewayReceivePayload) {
        switch (packet.op) {
            case GatewayOpcodes.Hello:
                this.heartbeat(packet.d.heartbeat_interval);
                this.identify();
                break;
            case GatewayOpcodes.Dispatch:
                this.onPacket(packet);
        }
    }

    public onPacket(packet: GatewayDispatchPayload) {
        switch (packet.t) {
            case GatewayDispatchEvents.Ready:
                this.seq = packet.s;
                this.session_id = packet.d.session_id;
                this.state = "connected";
                this.options.client.user = new ClientUser(packet.d.user);
                this.options.client.emit("ready");
                break;
            case GatewayDispatchEvents.MessageCreate:
                let message = new Message(packet.d, this.options.client);
                this.options.client.emit("message_create", message);
                break;
            case GatewayDispatchEvents.GuildCreate:
                if (!packet.d.unavailable) {
                    let guild = new Guild(packet.d, this.options.client);
                    
                    if (packet.d.channels && packet.d.channels.length) {
                        for (let channel of packet.d.channels) {
                            let data = new Channel(channel, this.options.client);
                            guild.channels.set(channel.id, data.get());
                            this.options.client.channels.set(channel.id, data.get());
                        }
                    }

                    this.options.client.emit("guild_create", guild);
                }
                break;
            case GatewayDispatchEvents.ChannelCreate:
                let channel = new Channel(packet.d, this.options.client);
                this.options.client.channels.set(packet.d.id, channel.get());
                break;
            case GatewayDispatchEvents.GuildMemberUpdate:
                let guild = this.options.client.guilds.get(packet.d.guild_id);
        }
    }

    public identify() {
        let data: GatewayIdentify = {
            op: 2,
            d: {
                token: makeToken(this.options.client.token),
                intents: ClientIntents.resolve(this.options.client.options.intents),
                properties: {
                    $browser: "Promethean",
                    $device: "Promethean",
                    $os: process.platform,
                },
                large_threshold: 250
            }
        };

        if (this.options.client.shards.size > 1) {
            data.d.shard = [this.id, this.options.client.shards.size];
        }

        this.send(data);
    }

    public heartbeat(time: number) {
        if (!this.got_heartbeat) {
            this.got_heartbeat = true;
            setTimeout(() => this.send<GatewayHeartbeat>({
                op: 11,
                d: this.seq
            }), time);
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