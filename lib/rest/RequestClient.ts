import { Method } from "got/dist/source";
import Client from "../Client";
import { RequestHandler } from "./RequestHandler";

export = class RequestClient {
    public client: Client;

    public constructor(client: Client) {

        this.client = client;
    }

    public request<T, A = undefined>(route: string, method: Method, auth: boolean) {
        return new RequestHandler<A, T>({ 
            route, 
            method,
            auth: {
                required: auth,
                token: this.client.token
            }
        });
    }
}

