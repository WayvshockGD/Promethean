import PrometheanError from "../errors/PrometheanError";

export let AllIntents: IntentObject = {
    Guilds: 1 << 0,
    GuildMembers: 1 << 1,
    GuildBans: 1 << 2,
    GuildEmojisAndStickers: 1 << 3,
    GuildIntegrations: 1 << 4,
    GuildWebhooks: 1 << 5,
    GuildInvites: 1 << 6,
    GuildVoiceStates: 1 << 7,
    GuildPresences: 1 << 8,
    GuildMessages: 1 << 9,
    GuildMessageReactions: 1 << 10,
    GuildMessageTyping: 1 << 11,
    DirectMessages: 1 << 12,
    DirectMessageReactions: 1 << 13,
    DirectMessageTyping: 1 << 14,
    GuildScheduledEvents: 1 << 16
}

export function resolve(intents: IntentStrings[]): number {
    if (!Array.isArray(intents)) {
        throw new PrometheanError(`{intents} isn't an array, revieved: {${typeof intents}}`);
    }
    let bits = 0;
    for (let i of intents) {
        let intent = AllIntents[i];
        if (!intent) {
            throw new PrometheanError(`Intent {${i}} isn't a valid intent`);
        }
        bits |= intent;
    }
    return bits;
}

export let PrivilegedPresences = AllIntents.GuildPresences;
export let PrivilegedMembers = AllIntents.GuildMembers;

export type IntentStrings = "Guilds" | 
                     "GuildMembers"  | 
                     "GuildBans"     |
                     "GuildEmojisAndStickers" |
                     "GuildIntegrations" |
                     "GuildWebhooks" |
                     "GuildInvites" |
                     "GuildVoiceStates" |
                     "GuildPresences" |
                     "GuildMessages" |
                     "GuildMessageReactions" |
                     "GuildMessageTyping" |
                     "DirectMessages" |
                     "DirectMessageReactions" | 
                     "DirectMessageTyping" |
                     "GuildScheduledEvents";

export type IntentObject = {
    [intent in IntentStrings]: number;
};
