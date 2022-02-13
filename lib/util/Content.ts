import { PrometheanEmbed, WrappedMessageContent } from "../structures/Types";
import { RESTPostAPIChannelMessageJSONBody } from "discord-api-types/v9";
import PrometheanMessageEmbed from "../structures/PrometheanMessageEmbed";

export = class Content {
    static parse(content: WrappedMessageContent): RESTPostAPIChannelMessageJSONBody {
        if (typeof content === "string") {
            return { content };
        } else {
            let embeds: PrometheanEmbed[] = [];

            if (content.embed) {
                embeds.push(content.embed);
            }

            if (content.embeds instanceof PrometheanMessageEmbed) {
                for (let embed of content.embeds.toJSON()) {
                    // @ts-ignore be quiet typescript
                    embeds.push(embed);
                }
            } else {
                if (content.embeds && content.embeds.length) {
                    for (let embed of content.embeds) {
                        embeds.push(embed);
                    }
                }
            }

            return { 
                embeds, 
                content: content.content
            };
        }
    }
}