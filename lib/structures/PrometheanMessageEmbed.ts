import { 
    APIEmbed, 
    APIEmbedAuthor, 
    APIEmbedField, 
    APIEmbedFooter, 
    APIEmbedImage,
    APIEmbedThumbnail,
} from "discord-api-types/v9";
import { AllColors, ColorPallets } from "../util/ColorPallets";

export = class PrometheanMessageEmbed implements APIEmbed {
    public title?: string;
    public author?: APIEmbedAuthor | undefined;
    public fields?: APIEmbedField[] | undefined;
    public image?: APIEmbedImage | undefined;
    public footer?: APIEmbedFooter | undefined;
    public thumbnail?: APIEmbedThumbnail | undefined;
    public description?: string | undefined;
    public url?: string | undefined;
    public timestamp?: string | undefined;
    public color?: number | undefined;
    public children: PrometheanMessageEmbed[] = [];

    public addTitle(title: string) {
        this.title = title;
        return this;
    }

    public addAuthor(author: APIEmbedAuthor) {
        this.author = author;
        return this;
    }

    public addFields(fields: APIEmbedField | APIEmbedField[]) {
        if (!this.fields && Array.isArray(fields)) {
            this.fields = [...fields];
        } else if (!this.fields && !Array.isArray(fields)) {
            this.fields = [fields];
        } else if (this.fields) {
            if (Array.isArray(fields)) {
                for (let field of fields) {
                    this.fields.push(field);
                }
            } else {
                this.fields.push(fields);
            }
        }
        return this;
    }

    public addImage(image: APIEmbedImage) {
        this.image = image;
        return this;
    }

    public addThumbnail(thumbnail: APIEmbedImage) {
        this.thumbnail = thumbnail;
        return this;
    }

    public addColor(color: AllColors) {
        this.color = ColorPallets.parse(color);
        return this;
    }

    public addURL(url: string) {
        this.url = url;
        return this;
    }

    public addTimestamp(timestamp: string) {
        this.timestamp = timestamp;
        return this;
    }

    public addDescription(description: string) {
        this.description = description;
        return this;
    }

    public addChild(embed: PrometheanMessageEmbed) {
        this.children.push(embed);
    }

    public addChildren(embeds: PrometheanMessageEmbed[]) {
        for (let embed of embeds) {
            this.children.push(embed);
        }
        return this;
    }

    public toJSON(): APIEmbed[] {
        return [
            {
                title: this.title,
                description: this.description,
                author: this.author,
                image: this.image,
                thumbnail: this.thumbnail,
                color: this.color,
                fields: this.fields,
                timestamp: this.timestamp,
                url: this.url,
            },
            ...this.children
        ]
    }
}