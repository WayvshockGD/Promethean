import { APIChannel, Routes } from "discord-api-types/v9";
import { Channel, Channels } from "../structures/Channel";
import CacheCollection from "../util/CacheCollection";

export = class ChannelCache extends CacheCollection<Channels> {
    public async fetch(id: string, cache?: boolean) {
        let data = await this.client.rest
            .make<APIChannel>(Routes.channel(id), "GET", true);
        
        let channel = new Channel(data, this.client).get();

        if (cache) {
            this.set(data.id, channel);
        }

        return channel;
    }
}