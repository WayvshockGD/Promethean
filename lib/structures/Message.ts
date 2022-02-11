import { APIEmoji, APIMessage, ChannelType, RESTPostAPIGuildEmojiJSONBody, Routes } from "discord-api-types/v9"
import Client from "../Client";
import Base from "./Base";
import { Channels } from "./Channel";
import Guild from "./Guild";
import TextableChannel from "./TextableChannel";
import { Uncached, VerifyChannelType, VerifyGuild } from "./Types";
import User from "./User";

class Message<T extends Channels, G = Guild> extends Base {
    private data: APIMessage;

    public channel: VerifyChannelType<T>;

    public author: User;

    public constructor(data: APIMessage, client: Client) {
        super(client);
        
        this.data = data;

        this.channel = client.channels.resolve(data.channel_id) as VerifyChannelType<T>;

        this.author = new User(data.author, client);
    }

    public get guildID() {
        return this.data.guild_id;
    }

    public get content() {
        return this.data.content;
    }

    public get guild() {
        let ignored = [ChannelType.DM, ChannelType.GuildVoice, ChannelType.GuildStageVoice];
        if (ignored.includes(this.channel.type)) {
            return undefined;
        }
        
        let data: undefined | Uncached;
        let guild = this.client.guilds.get(this.guildID as string);
        
        if (!guild) {
            data = { id: this.guildID };
        }

        return (guild ? guild : data) as VerifyGuild<typeof data extends undefined ? Uncached : G>;
    }

    public get channelID() {
        return this.data.channel_id;
    }

    public get id() {
        return this.data.id;
    }

    public async createReaction(emoji: string) {
        let request = this.client.rest
            .request<{}>(
                Routes.channelMessageOwnReaction(this.channel.id, this.id, emoji),
                "POST",
                true
            );

        await request.make();
    }
}

export = Message;