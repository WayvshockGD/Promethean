import EventEmitter from "node:events";
import got, { Method, OptionsOfTextResponseBody } from "got/dist/source";
import PrometheanError from "../errors/PrometheanError";
import { LIB_VERSION, URLS } from "../util/Constants";
import { RatelimitDataTypes } from "./Types";

export class RequestHandler<T, A> extends EventEmitter {
    public options: RequestOptions;

    public constructor(options: RequestOptions) {
        super();

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

            let reset = res.headers["x-ratelimit-reset-after"] as string;
            let global = res.headers["x-ratelimit-global"] as string;
            console.log(res.headers)

            this.options.ratelimits[this.options.route] = {
                remaining: parseInt(reset)
            };

            if (global) {
                this.emit("ratelimit");
            }

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