import { APIChannel, ChannelType } from "discord-api-types/v9";
import { ChannelTypes } from "../structures/Types";

export let API_VERSION: number = 9;

export let LIB_VERSION: string = "1.0.0";

export let URLS = {
    api: `https://discord.com/api/v${API_VERSION}`,
    git: "https://github.com/WayvshockGD/Promethean"
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