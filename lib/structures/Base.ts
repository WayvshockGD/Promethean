import Client from "../Client"

export = class Base {
    public client: Client;

    public constructor(client: Client) {
        this.client = client;
    }
}