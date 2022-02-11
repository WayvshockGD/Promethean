import { APIGuildMember, GatewayGuildMemberUpdateDispatchData } from "discord-api-types/v9";
import Client from "../Client";
import Base from "./Base";
import { AsNull, asNullAndUndefined } from "./Types";
import User from "./User";

export = class GuildMember extends Base {
    private data: APIGuildMember;

    public id: string | null;
    public name: string | null;
    public premiumSince: AsNull<string>;
    public user: AsNull<User>;
    public avatar: asNullAndUndefined<string>;

    public constructor(data: APIGuildMember, client: Client) {
        super(client);

        this.data = data;

        this.id = data.user?.id ?? null;

        this.name = data.user?.username ?? null;

        this.premiumSince = data.premium_since ?? null;

        this.avatar = data.avatar ?? null;

        if (data.user) {
            this.user = new User(data.user, client);
        } else {
            this.user = null;
        }
    }

    public _update(data: GatewayGuildMemberUpdateDispatchData) {
        this.name = data.nick ?? data.user.username;
        this.avatar = data.avatar;
        this.premiumSince = data.premium_since ?? null;
        return this;
    }
}