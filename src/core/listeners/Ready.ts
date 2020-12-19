import { Listener } from "discord-akairo";
import { TextChannel } from "discord.js";

export default class Ready extends Listener {
    public constructor() {
        super("ready", {
            emitter: "client",
            event: "ready",
        });
    }

    public exec() {
        this.client.times_channel = this.client.channels.cache.get(this.client.config.TIMES_ID) as TextChannel;
        this.client.verifier_role = this.client.times_channel.guild.roles.cache.get(this.client.config.CLAIMER_ROLE);
        this.client.positions_channel = this.client.channels.cache.get(this.client.config.CHANNEL_ID) as TextChannel;
        this.client.Logger.log(`Bot logged in as ${this.client.user!.tag}`);
    }
}
