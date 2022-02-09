import { APIGatewayBotInfo } from "discord-api-types";
import Client from "../Client";
import Collection from "../util/Collection";
import { Shard } from "./Shard";

export = class ShardClient extends Collection<number, Shard> {
    public client: Client;

    public constructor(client: Client) {
        super();

        this.client = client;
    }

    public init(data: APIGatewayBotInfo, id: number) {
        let shard = this.get(id);

        if (!shard) {
            this.set(id, new Shard({ data, id, client: this.client }).run());
        }
    }
}