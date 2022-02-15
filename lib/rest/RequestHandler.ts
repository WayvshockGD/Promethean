import EventEmitter from "node:events";
import got, { Method, OptionsOfTextResponseBody } from "got/dist/source";
import PrometheanError from "../errors/PrometheanError";
import { DISCORD_CODES, LIB_VERSION, URLS } from "../util/Constants";
import { RatelimitDataTypes } from "./Types";
import DiscordError from "../errors/DiscordError";
import DiscordRatelimitError from "../errors/DiscordRatelimitError";
import Client from "../Client";
import Util from "../util/Util";
import { RatelimitWait } from "../util/Bucket";

let sleep = (ms: number) => {
    let timeStart = new Date().getTime();
    while (true) {
      let elapsedTime = new Date().getTime() - timeStart;
      if (elapsedTime > ms) {
        break;
      }
    }
};

export class RequestHandler extends EventEmitter {
    public client: Client;
    public options?: RequestOptions;
    public ratelimits: RatelimitDataTypes = [];
    public rate: number;
    public queues: (() => any)[];

    public constructor(client: Client, options?: RequestOptions) {
        super();

        this.client = client;

        this.options = options;

        this.rate = 0;

        this.queues = [];
    }

    get agent() {
        return `Promethean (${URLS.git}, ${LIB_VERSION})`;
    }

    public makeQueue() {
        let fun = this.queues.shift();
        if (fun) return fun();
    }

    public async make<TY, T = {}>(route: string, method: Method, auth: boolean, body?: T): Promise<TY> {
        return
        let fun = async () => {
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
    
            this.ratelimits.push({
                route: route,
                remaining: parseInt(reset)
            });
    
            if (res.statusCode !== 200 && res.statusCode !== 201 && res.statusCode !== 429) {
                throw new DiscordError(res.statusCode, res.statusMessage);
            } else if (res.statusCode === DISCORD_CODES.ratelimit) {
                throw new DiscordRatelimitError((res.statusMessage!), {
                    reset: parseInt(reset),
                    global: Boolean(global)
                });
            }
    
            return typeof res.body === "string" ? JSON.parse(res.body) : res.body;
        };

        console.log(this.rate > 2, this.rate < 2);
        console.group(this)
        if (this.rate > 1) {
            let map = this.ratelimits.find((op) => op.route === route);

            if (map) {
                console.log(this)
                let bucket = new RatelimitWait<TY>({
                    bucketSize: 1,
                    refillTime: parseInt(`${map.remaining}000`),
                });

                bucket.wait().then(async () => {
                    return await fun();
                });
            }
        }
        this.queues.push(fun);
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