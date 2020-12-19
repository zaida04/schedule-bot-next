import { Listener } from "discord-akairo";
import { User, MessageReaction } from "discord.js";
import Log from "../../database/Log";
import Position from "../../database/Position";
import { verifierOnly } from "../util/verifierOnly";

export default class messageReactionAdd extends Listener {
    public constructor() {
        super("messageReactionAdd", {
            emitter: "client",
            event: "messageReactionAdd",
        });
    }

    public async exec(reaction: MessageReaction, user: User) {
        if (user.bot || user.id === this.client.user!.id) return;
        if (!reaction.message.guild) return;
        switch (reaction.emoji.name) {
            case "✋": {
                const possiblePosition = await Position.findOne({ msg_id: reaction.message.id });
                if (!possiblePosition) return;
                await reaction.message.fetch();
                await this.client.commandHandler.runCommand(
                    reaction.message,
                    this.client.commandHandler.modules.get("positions-claim")!,
                    {
                        position: possiblePosition,
                        claimer: user,
                    }
                );
                break;
            }
            case "✅": {
                const possibleTime = await Log.findOne({ msg_id: reaction.message.id });
                if (!possibleTime) return;
                await reaction.message.fetch();
                if (verifierOnly(reaction.message)) return;
                await this.client.commandHandler.runCommand(
                    reaction.message,
                    this.client.commandHandler.modules.get("times-verify")!,
                    {
                        time: possibleTime,
                        executor: user,
                    }
                );
                void user.send(`Time ${possibleTime._id} verified by you.`);
                break;
            }
            case "❌": {
                const possibleTime = await Log.findOne({ msg_id: reaction.message.id });
                if (!possibleTime) return;
                await reaction.message.fetch();
                if (verifierOnly(reaction.message)) return;
                const reason = await (
                    await user
                        .createDM()
                        .then((x) =>
                            x
                                .send(
                                    `Please give a reason for rejecting the log for \`${possibleTime.name}\` - \`${possibleTime.time.hours}\` hour(s) and \`${possibleTime.time.minutes}\` minutes(s)`
                                )
                                .then(() => x)
                        )
                )
                    .awaitMessages((msg) => msg.author.id === user.id, {
                        max: 1,
                        time: 120000,
                        errors: ["time"],
                    })
                    .then((collected) => collected.first()?.content)
                    .catch(() => null);
                if (!reason)
                    return user.send("You did not provide a reason within 2 minutes. Cancelled rejection, try again.");
                await this.client.commandHandler.runCommand(
                    reaction.message,
                    this.client.commandHandler.modules.get("times-reject")!,
                    {
                        time: possibleTime,
                        executor: user,
                        reason: reason,
                    }
                );
                void user.send(`Time ${possibleTime._id} rejected by you.`);
                break;
            }
        }
    }
}
