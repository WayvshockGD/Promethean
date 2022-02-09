import { APIMessage, RESTPostAPIChannelMessageJSONBody, Routes } from "discord-api-types/v9";
import Client from "../Client"
import Message from "../structures/Message";
import { WrappedMessageContent } from "../structures/Types";

export = class MessageHandler {
    public client: Client;
    private id: string;

    public constructor(client: Client, id: string) {
        this.id = id;
        this.client = client;
    }

    public async createMessage(content: WrappedMessageContent): Promise<Message> {
        if (typeof content === "string") {
            content = { content };
        }
        let request = this.client.rest
         .request<APIMessage, RESTPostAPIChannelMessageJSONBody>(
             Routes.channelMessages(this.id), 
             "POST",
             true
        )
        let data = await request.make(content);
        return new Message(data, this.client);
    }
}
