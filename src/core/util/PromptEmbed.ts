import { MessageEmbed } from "discord.js";

export default class PromptEmbed extends MessageEmbed {
    public constructor(title: string, description: string) {
        super();
        super.setColor("GREEN");
        super.setTitle(title);
        super.setDescription(description);
        super.setTimestamp();
    }
}
