import { Method } from "got/dist/source";
import Client from "../Client";
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
        return new RequestHandler<A, T>({ 
            route, 
            method,
            ratelimits: this.ratelimitMap,
            auth: {
                required: auth,
                token: this.client.token
            }
        });
    }
}

