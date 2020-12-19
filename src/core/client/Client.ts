import { AkairoClient, CommandHandler, ListenerHandler } from "discord-akairo";
import { join } from "path";
import { ClientOptions } from "../../typings/ClientOptions";
import mongoose from "mongoose";

import "../../typings/Akairo";
import "../../typings/Guild";
import Logger from "../../logger/Logger";
import { Intents } from "discord.js";

export default class Client extends AkairoClient {
    public constructor(public config: ClientOptions) {
        super({
            ownerID: [config.ADMIN_ID],

            disableMentions: "everyone",
            partials: ["MESSAGE", "CHANNEL", "REACTION"],
            messageCacheMaxSize: 25,
            messageCacheLifetime: 86400,
            messageSweepInterval: 43200,
            messageEditHistoryMaxSize: 2,
            ws: {
                intents: [Intents.NON_PRIVILEGED],
            },
        });

        this.config = config;
        this.Logger = new Logger();
        mongoose
            .connect(config.DB_URI, {
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true,
            })
            .catch((e) => {
                console.error.bind(`Error connecting to MongoDB Database. ${e}`);
                process.exitCode = 1;
            });
        this.db = mongoose.connection;

        this.commandHandler = new CommandHandler(this, {
            directory: join(__dirname, "/../commands/"),
            prefix: this.config.PREFIX,
            allowMention: true,
            defaultCooldown: 5000,
            argumentDefaults: {
                prompt: {
                    retries: 2,
                    retry:
                        'Not quite what I was looking for, please try saying that again. Be sure to check if I asked you to say this in a specific way like "only say the number"',
                    cancel: "A'ight boss, cancelled.",
                    ended: "Cancelled command.",
                    timeout:
                        "You ran out of time! Please try answering within 120 seconds next time. You can reattempt this command.",
                    time: 120000,
                },
            },
        });
        this.listenerHandler = new ListenerHandler(this, {
            directory: join(__dirname, "/../listeners/"),
        });
    }

    private _init() {
        this.commandHandler.useListenerHandler(this.listenerHandler);

        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler,
        });

        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();
    }

    public async login(token: string) {
        this._init();
        this.Logger.log("Logging in...");
        return super.login(token);
    }
}
