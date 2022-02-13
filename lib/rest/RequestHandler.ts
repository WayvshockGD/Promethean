import got, { Method, OptionsOfTextResponseBody } from "got/dist/source";
import PrometheanError from "../errors/PrometheanError";
import { LIB_VERSION, URLS } from "../util/Constants";
import { RatelimitDataTypes } from "./Types";

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

        if (!this.options.ratelimits[this.options.route]) {
            let res = await got(`${URLS.api}${this.options.route}`, options);
            
            let limit = res.headers["x-ratelimit-limit"];
            let remaining = res.headers["x-ratelimit-remaining"];
            let reset = res.headers["x-ratelimit-reset"];
            let global = res.headers["x-ratelimit-global"];
            console.log(parseInt(reset as string));

            return typeof res.body === "string" ? JSON.parse(res.body) : res.body;
        } else {
            return {} as A;
        }
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
    ratelimits: RatelimitDataTypes;
    auth: {
        required: boolean;
        token: string;
    }
}