import { IntentStrings } from "./client/ClientIntents";

export interface ClientOptions {
    intents: IntentStrings[];
    shards?: {
        type?: ShardOptions;
        size?: number;
    }
    debug?: boolean;
}

export type ShardOptions = "auto" | "manual";