import { APIEmoji, APIMessage, RESTPostAPIChannelMessageJSONBody, RESTPostAPIGuildEmojiJSONBody, Routes } from "discord-api-types/v9";
import Client from "../Client"
import Message from "../structures/Message";
import TextableChannel from "../structures/TextableChannel";
import { WrappedMessageContent } from "../structures/Types";
import Content from "../util/Content";

export = class MessageHandler {
    public client: Client;
    private id: string;

    public constructor(client: Client, id: string) {
        this.id = id;
        this.client = client;
    }

    public async createMessage(content: WrappedMessageContent): Promise<Message<TextableChannel>> {
        let data = await this.client.rest
         .make<APIMessage, RESTPostAPIChannelMessageJSONBody>(
             Routes.channelMessages(this.id), 
             "POST",
             true,
             Content.parse(content)
        )
        return new Message(data, this.client);
    }
}
