import { DISCORD_CODES } from "../util/Constants";
import DiscordError from "./DiscordError";

export = class DiscordRatelimitError extends DiscordError {
    public time: number;
    public global: boolean;

    public constructor(message: string, ratelimit: RatelimitErrorData) {
        super(DISCORD_CODES.ratelimit, message);

        this.time = parseInt(`${ratelimit.reset}000`);

        this.global = ratelimit.global;
    }
}

interface RatelimitErrorData {
    reset: number;
    global: boolean;
}