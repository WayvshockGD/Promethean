import { APIChannel } from "discord-api-types"
import Client from "../Client";
import { resolveChannelType } from "../util/Constants";
import Base from "./Base";
import { ChannelTypes } from "./Types";

class VoiceChannel extends Base {
    private data: APIChannel;

    public constructor(data: APIChannel, client: Client) {
        super(client);

        this.data = data;
    }

    public get id() {
        return this.data.id;
    }
    
    public get type() {
        return this.data.type;
    }

    public isType(type: ChannelTypes) {
        return resolveChannelType(type, this.data);
    }
}

export = VoiceChannel;