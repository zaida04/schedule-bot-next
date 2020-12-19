# ScheduleBot  
Discord bot in charge of handling Schedules, positions, and time logs for MoreToLearn  

## Disclaimer
This bot is meant to be a singular guild bot and isn't intended to be robsut in any manner, hence you must configure the settings.json file appropriately with the keys in the [settings](#settings)

## Scripts  
`npm start` - Compile and run the bot
`npm run lint` - Lint the TS of the bot  
`npm run build` - Compile the bot  

## Settings
```json
{
    "ADMIN_ID": "admin id",
    "CHANNEL_ID": "channel id",
    "CLAIMER_ROLE": "role to apply to people who've claimed",
    "DB_URI": "mongodb uri to connect to database",
    "EMAIL": "email to include when positions are taken",
    "PREFIX": "bot prefix",
    "TIMES_ID": "channel to send times log"
}
```

### LICENSING  
> © [zaida04](https://github.com/zaida04) Licensed under [MIT](https://github.com/zaida04/ScheduleBot-next/blob/main/LICENSE) 

