import { AkairoClient } from "discord-akairo";
import { Message } from "discord.js";

export const verifierOnly = (message: Message): string | null =>
    !message.member?.roles.cache.has((message.client as AkairoClient).config.VERIFIER_ROLE) &&
    !message.member?.permissions.has("MANAGE_GUILD")
        ? `You are either not a Time Verifier or you don't have the \`MANAGE_GUILD\` permissions!`
        : null;
