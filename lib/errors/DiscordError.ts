import _ from "lodash";
import PrometheanError from "./PrometheanError";

export = class DiscordError extends PrometheanError {
    public status: number;

    constructor(status: number, reason?: string) {
        reason = typeof reason === "undefined" ? "No message" : reason;
        super(`(${status}) ${reason}`);

        this.status = status;
    }
}