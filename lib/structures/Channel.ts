import { APIChannel } from "discord-api-types";
import TextableChannel from "./TextableChannel";
import VoiceChannel from "./VoiceChannel";
import { ChannelType } from "discord-api-types/v9";
import GuildTexable from "./GuildTextable";
import Client from "../Client";
import Base from "./Base";

class Channel extends Base {
    private data: APIChannel;

    public constructor(data: APIChannel, client: Client) {
        super(client);
        
        this.data = data;
    }

    public get() {
        let channel: Channels;

        switch (this.data.type) {
            case ChannelType.GuildText:
                channel = new GuildTexable(this.data, this.client);
                break;
            case ChannelType.GuildVoice:
                channel = new VoiceChannel(this.data, this.client);
            default:
                if (this.client.options.debug) {
                    console.log(`Unknown channel type ${this.data.type}`);
                }
                channel = new TextableChannel(this.data, this.client);
        }
        return channel;
    }
}

type Channels = TextableChannel | GuildTexable | VoiceChannel;

export {
    Channels,
    Channel
};