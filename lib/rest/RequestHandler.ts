import got, { Method, OptionsOfTextResponseBody } from "got/dist/source";
import PrometheanError from "../errors/PrometheanError";
import { LIB_VERSION, URLS } from "../util/Constants";

export class RequestHandler<T, A> {
    public options: RequestOptions;

    public constructor(options: RequestOptions) {
        this.options = options;
    }

    get agent() {
        return `Promethean (${URLS.git}, ${LIB_VERSION})`;
    }

    public async make(body?: T): Promise<A> {
        let options: OptionsOfTextResponseBody = {
            throwHttpErrors: false,
            method: this.options.method,
            headers: {
                "content-type": "application/json",
                "User-Agent": this.agent,
                "Accept-Encoding": "gzip,deflate",
                "X-RateLimit-Precision": "millisecond"
            }
        };

        if (this.options.auth.required) {
            options.headers!["Authorization"] = makeToken(this.options.auth.token);
        }

        if (body) {
            options.body = JSON.stringify(body);
        }
        
        let res = await got(`${URLS.api}${this.options.route}`, options);

        return typeof res.body === "string" ? JSON.parse(res.body) : res.body;
    }
}

export function makeToken(token: string) {
    if (token.startsWith("Bot ")) {
        return token;
    } else if (token.startsWith("User ")) {
        throw new PrometheanError("Self-bots are unsupported by both discord and the library");
    } else {
        return `Bot ${token}`;
    }
}

export interface RequestOptions {
    route: string;
    method: Method;
    auth: {
        required: boolean;
        token: string;
    }
}