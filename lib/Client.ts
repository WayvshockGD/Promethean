import type { 
    APIGatewayBotInfo
} from "discord-api-types";
import { Routes } from "discord-api-types/v9";
import ChannelCache from "./caches/ChannelCache";
import { GuildCache } from "./caches/GuildCache";
import PrometheanClientError from "./errors/PrometheanClientError";
import PrometheanError from "./errors/PrometheanError";
import { EventClient } from "./EventClient";

import RequestClient from "./rest/RequestClient";
import ShardClient from "./shards/ShardClient";
import ClientUser from "./structures/ClientUser";
import { ClientOptions } from "./Types";

class Client extends EventClient {
    public token: string;
    public options: ClientOptions;

    public user?: ClientUser;

    public channels: ChannelCache;

    public guilds: GuildCache;

    public constructor(token: string) {
        super(true);

        this.token = token;

        this.options = { intents: [] };

        this.user = undefined;

        this.channels = new ChannelCache(this);

        this.guilds = new GuildCache(this);
    }

    get rest() {
        return new RequestClient(this);
    }

    get shards() {
        return new ShardClient(this);
    }

    public setOptions(options: ClientOptions) {
        this.options = Object.assign<ClientOptions, ClientOptions>({ 
            intents: [],
            shards: {
                type: "auto",
                size: undefined
            },
            debug: false
        }, options);
        return this;
    }

    private checkToken() {
        if (!this.token) {
            throw new PrometheanClientError(`client#token is undefined or null`);
        }
        if (this.token === " ") {
            throw new PrometheanClientError("client#token cannot be a empty string")
        }
        if (!/[A-z0-9?.]/g.test(this.token)) {
            throw new PrometheanClientError("client#token must match the regex /[A-z0-9?.]/");
        }
        if (typeof this.token !== "string") {
            throw new PrometheanClientError(`client#token isn't a string, recieved: ${typeof this.token}`);
        }
    }

    public async connect() {
        this.checkToken();
        let data = await this.rest.request<APIGatewayBotInfo>(Routes.gatewayBot(), "GET", true).make();

        if (this.options.shards && this.options.shards.type === "auto") {
            if (!data) {
                throw new PrometheanError("Autoshard failed from no data from discord");
            };
            this.options.shards.size = data.shards;
        } else if (this.options.shards) {
            if (this.options.shards.size === undefined) {
                throw new PrometheanError("options#settings#shards#size is undefined");
            }
            if (this.options.shards.size === 0) {
                throw new PrometheanError("options#settings#shards#size is 0");
            }
        }

        for (let id = 0; id < this.options.shards?.size!; id++) {
            this.shards.init(data, id);
        }
    }
}

export = Client;