import { APIGuild } from "discord-api-types";
import ChannelCache from "../caches/ChannelCache";
import MemberCache from "../caches/MemberCache";
import Client from "../Client";

export = class Guild {
    private data: APIGuild;

    public channels: ChannelCache;

    public members: MemberCache;

    public constructor(data: APIGuild, client: Client) {
        this.data = data;

        this.channels = new ChannelCache(client);

        this.members = new MemberCache(client);
    }

    public get name() {
        return this.data.name;
    }
}