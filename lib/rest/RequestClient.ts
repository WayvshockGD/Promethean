import { Method } from "got/dist/source";
import Client from "../Client";
import Bucket from "../util/Bucket";
import { RequestHandler } from "./RequestHandler";
import { RatelimitDataTypes } from "./Types";

export = class RequestClient {
    public client: Client;
    private ratelimitMap: RatelimitDataTypes;

    public constructor(client: Client) {

        this.client = client;

        this.ratelimitMap = {};
    }

    public request<T, A = undefined>(route: string, method: Method, auth: boolean) {
        let bucket = new Bucket(route, this.ratelimitMap);
        let map = this.ratelimitMap[route];

        let data = new RequestHandler<A, T>({ 
            route, 
            method,
            ratelimits: this.ratelimitMap,
            auth: {
                required: auth,
                token: this.client.token
            }
        });
        
        bucket.handle(map.remaining);

        data.on("ratelimit", () => this.client.emit("ratelimit"));
        return data;
    }
}

