import { APIChannel } from "discord-api-types/v9";
import Client from "../Client";
import MessageHandler from "../handlers/ChannelHandler";
import { resolveChannelType } from "../util/Constants";
import Base from "./Base";
import { ChannelTypes, WrappedMessageContent } from "./Types";

class TextableChannel extends Base {
    private data: APIChannel;
    private handler: MessageHandler;

    public constructor(data: APIChannel, client: Client) {
        super(client);

        this.data = data;

        this.handler = new MessageHandler(client, this.id);
    }

    public async createContent(content: WrappedMessageContent) {
        return await this.handler.createMessage(content);
    }

    public isType(type: ChannelTypes) {
        return resolveChannelType(type, this.data);
    }

    public get type() {
        return this.data.type;
    }

    public get id() {
        return this.data.id;
    }
}

export = TextableChannel;