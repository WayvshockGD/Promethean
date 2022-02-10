import User from "./User";
import { Channels } from "./Channel";
import Guild from "./Guild";
import GuildTexable from "./GuildTextable";
import TextableChannel from "./TextableChannel";
import VoiceChannel from "./VoiceChannel";

export type Uncached = { id?: string };

export type AsNull<T> = T | null; 

export type VerifyChannelType<T extends Channels> = T extends TextableChannel
     ? TextableChannel : T extends GuildTexable 
     ? GuildTexable : T extends VoiceChannel
     ? VoiceChannel : Uncached;

export type VerifyGuild<T> = T extends Guild ? Guild : Uncached;

export type WrappedMessageContent = string | MessageContent;

export type ChannelTypes = "guild_text" | "voice";

export interface MessageContent {
    content: string;
}

export interface PartialGuildMember {
    premiumSince: AsNull<string>;
    user: AsNull<User>;
}