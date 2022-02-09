import { APIUser } from "discord-api-types";
import Client from "../Client";
import Base from "./Base";

export = class User extends Base {
    private data: APIUser;

    public constructor(data: APIUser, client: Client) {
        super(client);

        this.data = data;
    }

    public get id() {
        return this.data.id;
    }
}