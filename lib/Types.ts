import { IntentStrings } from "./client/ClientIntents";
import { RequestOptions } from "./rest/RequestHandler";

export interface ClientOptions {
    intents: IntentStrings[];
    shards?: {
        type?: ShardOptions;
        size?: number;
    }
    debug?: boolean;
    rest?: RequestOptions;
}

export type ShardOptions = "auto" | "manual";