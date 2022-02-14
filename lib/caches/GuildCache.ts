import { APIGuild, RESTGetAPIGuildQuery, Routes } from "discord-api-types/v9";
import Guild from "../structures/Guild";
import CacheCollection from "../util/CacheCollection";

export class GuildCache extends CacheCollection<Guild> {
    public async fetch(id: string, options: GuildFetchOptions = {}) {
        let data = await this.client.rest
            .make<APIGuild, RESTGetAPIGuildQuery>(
                Routes.guild(id), 
                "GET", 
                true,
                { with_counts: options.with_counts }
            );

        let guild = new Guild(data, this.client);
        
        if (options.cache) {
            this.set(data.id, guild);
        }

        return guild;
    }
}

export interface GuildFetchOptions {
    cache?: boolean;
    with_counts?: boolean;
}