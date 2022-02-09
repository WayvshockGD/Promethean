import Client from "../Client";
import Collection from "./Collection";

class CacheCollection<V> extends Collection<string, V> {
    public client: Client;

    public constructor(client: Client) {
        super();


        this.client = client;
    }

    public resolve(id: string) {
        let data = this.get(id);

        if (!data) {
            return { id };
        }

        return data;
    }
}

export = CacheCollection;