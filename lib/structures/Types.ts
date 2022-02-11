import User from "./User";
import { Channels } from "./Channel";
import Guild from "./Guild";
import GuildTexable from "./GuildTextable";
import TextableChannel from "./TextableChannel";
import VoiceChannel from "./VoiceChannel";

export type Uncached = { id?: string };

export type AsNull<T> = T | null; 
export type asNullAndUndefined<T> = T | undefined | null;

export type VerifyChannelType<T extends Channels> = T extends TextableChannel
     ? TextableChannel : T extends GuildTexable 
     ? GuildTexable : T extends VoiceChannel
     ? VoiceChannel : Uncached;

export type VerifyGuild<T> = T extends Guild ? Guild : Uncached;

export type WrappedMessageContent = string | MessageContent;

export type ChannelTypes = "guild_text" | "voice";

export interface MessageContent {
    content: string;
    embeds?: PrometheanEmbed[];
    embed?: PrometheanEmbed;
}

export interface PrometheanEmbed {
    title: string;
    description?: string;
    fields: PrometheanEmbedField[];
}

export interface PrometheanEmbedField {
    name: string;
    value: string;
    inline?: boolean;
}

export interface PartialGuildMember {
    premiumSince: AsNull<string>;
}