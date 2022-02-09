import { APIUser } from "discord-api-types";

export = class ClientUser {
    private data: APIUser;

    public constructor(data: APIUser) {
        this.data = data;
    }

    get username() {
        return this.data.username;
    }

    get id() {
        return this.data.id;
    }
}