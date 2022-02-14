import EventEmitter from "node:events";
import got, { Method, OptionsOfTextResponseBody } from "got/dist/source";
import PrometheanError from "../errors/PrometheanError";
import { DISCORD_CODES, LIB_VERSION, URLS } from "../util/Constants";
import { RatelimitDataTypes } from "./Types";
import DiscordError from "../errors/DiscordError";
import DiscordRatelimitError from "../errors/DiscordRatelimitError";
import Client from "../Client";
import Util from "../util/Util";
import Bucket from "../util/Bucket";

let sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export class RequestHandler extends EventEmitter {
    public client: Client;
    public options?: RequestOptions;
    public ratelimits: RatelimitDataTypes = [];
    public rate: number;

    public constructor(client: Client, options?: RequestOptions) {
        super();

        this.client = client;

        this.options = options;

        this.rate = 0;
    }

    get agent() {
        return `Promethean (${URLS.git}, ${LIB_VERSION})`;
    }

    public async make<TY, T = {}>(route: string, method: Method, auth: boolean, body?: T): Promise<TY> {
        console.log(this.ratelimits)
        let options: OptionsOfTextResponseBody = {
            throwHttpErrors: false,
            method: method,
            headers: {
                "content-type": "application/json",
                "User-Agent": this.agent,
                "Accept-Encoding": "gzip,deflate",
                "X-RateLimit-Precision": "millisecond"
            }
        };

        let bucket = new Bucket(route, this.ratelimits);

        if (auth) {
            options.headers!["Authorization"] = makeToken(this.client.token);
        }

        if (body) {
            options.body = JSON.stringify(body);
        }

        this.rate++;
        let res = await got(`${URLS.api}${route}`, options);

        let reset = res.headers["x-ratelimit-reset-after"] as string;
        let global = res.headers["x-ratelimit-global"] as string;

        if (global) {
            this.emit("ratelimit");
        }

        //if (this.ratelimits.find((o) => o.route === route)) {
        //    let time = `${parseInt(reset)}000`;
        //    console.log(this, parseInt(time));
        //    await sleep(parseInt(time));
        //    this.ratelimits = this.ratelimits.filter((val) => val.route != route);
        //    return this.make(route, method, auth, body);
        //}

        if (this.rate > 1) {
            this.rate = 0;
            this.ratelimits = [];
            setTimeout(() => {
                return this.make(route, method, auth, body);
            }, parseInt(`${parseInt(reset)}000`));
        }

        this.ratelimits.push({
            route: route,
            remaining: parseInt(reset)
        });

        if (res.statusCode !== 200 && res.statusCode !== 429) {
            throw new DiscordError(res.statusCode, res.statusMessage);
        } else if (res.statusCode === DISCORD_CODES.ratelimit) {
            throw new DiscordRatelimitError(res.statusMessage!);
        }

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

export interface RequestOptions { }