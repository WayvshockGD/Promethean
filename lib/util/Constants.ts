import { APIChannel, ChannelType } from "discord-api-types/v9";
import { ChannelTypes } from "../structures/Types";

export let API_VERSION: number = 10; // 🎉 v10 REST AND GATEWAY

export let LIB_VERSION: string = "1.0.0";

export let URLS = {
    api: `https://discord.com/api/v${API_VERSION}`,
    git: "https://github.com/WayvshockGD/Promethean"
}

export let DISCORD_CODES = {
    ratelimit: 429
}

export function resolveChannelType(type: ChannelTypes, channel: APIChannel) {
    let data;

    switch (type) {
        case "guild_text":
            data = channel.type === ChannelType.GuildText;
            break;
        case "voice":
            data = channel.type === ChannelType.GuildVoice;
            break;
    } 
    return data;
}