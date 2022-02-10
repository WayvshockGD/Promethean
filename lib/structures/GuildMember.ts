import { APIGuildMember, GatewayGuildMemberUpdateDispatchData } from "discord-api-types/v9";
import Client from "../Client";
import Base from "./Base";

export = class GuildMember extends Base {
    private data: APIGuildMember;

    public id: string | null;

    public name: string | null;

    public constructor(data: APIGuildMember, client: Client) {
        super(client);

        this.data = data;

        this.id = data.user?.id ?? null;

        this.name = data.user?.username ?? null;
    }

    public _update(data: GatewayGuildMemberUpdateDispatchData) {
        this.name = data.user.username;
    }
}