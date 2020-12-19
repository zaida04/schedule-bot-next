import { Role } from "discord.js";
import { TextChannel } from "discord.js";
import Mongoose from "mongoose";
import Logger from "../logger/Logger";
import { ClientOptions } from "./ClientOptions";

declare module "discord-akairo" {
    interface AkairoClient {
        config: ClientOptions;
        db: Mongoose.Connection;
        times_channel: TextChannel;
        verifier_role?: Role;
        positions_channel: TextChannel;
        commandHandler: CommandHandler;
        listenerHandler: ListenerHandler;
        inhibitorHandler: InhibitorHandler;
        Logger: Logger;
    }
}
