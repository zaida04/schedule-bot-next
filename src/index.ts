import Client from "./core/client/Client";

import { readFileSync } from "fs";
import { ClientOptions } from "./typings/ClientOptions";
try {
    const settings = JSON.parse(readFileSync(`${__dirname}/../settings.json`, "utf8"));

    if (!settings) throw new Error("Error getting settings json file");
    const settings_key = Object.keys(settings);
    ["ADMIN_ID", "CHANNEL_ID", "CLAIMER_ROLE", "DB_URI", "EMAIL", "PREFIX", "TIMES_ID", "TOKEN"].forEach((element) => {
        if (!settings_key.includes(element)) throw new Error(`MISSING REQUIRED KEY ${element} IN SETTINGS.JSON`);
    });
    const BotClient = new Client(settings as ClientOptions);
    void BotClient.login(settings.TOKEN);
} catch (e) {
    console.log(`Error on startup: ${e.message as string}`);
    process.exitCode = 1;
}
