import { DISCORD_CODES } from "../util/Constants";
import DiscordError from "./DiscordError";

export = class DiscordRatelimitError extends DiscordError {
    public constructor(message: string) {
        super(DISCORD_CODES.ratelimit, message);
    }
}