import { APIGuild } from "discord-api-types";
import ChannelCache from "../caches/ChannelCache";
import Client from "../Client";

export = class Guild {
    private data: APIGuild;

    public channels: ChannelCache;

    public constructor(data: APIGuild, client: Client) {
        this.data = data;

        this.channels = new ChannelCache(client);
    }

    public get name() {
        return this.data.name;
    }
}