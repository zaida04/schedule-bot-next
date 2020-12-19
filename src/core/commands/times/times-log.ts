import { Command } from "discord-akairo";
import { MessageEmbed, Message } from "discord.js";
import Log from "../../../database/Log";

export default class log extends Command {
    public constructor() {
        super("times-log", {
            aliases: ["log"],
            args: [
                {
                    id: "tutor_name",
                    type: "lowercase",
                    prompt: {
                        start:
                            "Welcome to the interactive hour logger. Please respond to my questions as I ask them. You have ~120 seconds for each question so please have your answers ready before hand. We will be asking information such as, hours and minutes taught, the date, your name, the tutee name, what you taught, what grade they were in, student/parent email, description of what you taught, and perhaps some additional notes. If you have no further questions, let's move on. You can stop this at any time by saying `cancel`. \n\nLet's start off with what is your FULL name?",
                    },
                },
                {
                    id: "hours",
                    type: "number",
                    prompt: {
                        start: "How many hours did you teach for? (Do not include minutes yet)",
                    },
                },
                {
                    id: "minutes",
                    type: "number",
                    prompt: {
                        start: "How many minutes did you teach for?",
                    },
                },
                {
                    id: "tutee_name",
                    type: "lowercase",
                    prompt: {
                        start:
                            "What was the name of your student? If multiple separate with comma (Ex. John, Katie, Zaid)",
                    },
                },
                {
                    id: "grade",
                    type: "number",
                    prompt: {
                        start: "What grade are they in? Please only include the number",
                    },
                },
                {
                    id: "contact",
                    type: "lowercase",
                    prompt: {
                        start: "What is your students contact email/what ever method you used to contact them.",
                    },
                },
                {
                    id: "subject",
                    type: "lowercase",
                    prompt: {
                        start: "What subject did you teach them?",
                    },
                },
                {
                    id: "description",
                    type: "lowercase",
                    prompt: {
                        start: "Can you describe what you taught them?",
                    },
                },
                {
                    id: "date",
                    type: "date",
                    prompt: {
                        start: `What date did you tutor them? Please format it as MM/DD/YYYY (Month/Day/Year). If you just taught them today, say \`${new Date().toLocaleDateString(
                            "en-US"
                        )}\``,
                    },
                },
                {
                    id: "additional_notes",
                    type: "lowercase",
                    prompt: {
                        start: "Do you have any more details to give? If not, say `no`",
                    },
                },
            ],
            category: "times",
            description: {
                content: "Log your hours",
            },
            channel: "dm",
        });
    }

    public async exec(
        message: Message,
        {
            hours,
            minutes,
            tutee_name,
            tutor_name,
            contact,
            grade,
            subject,
            date,
            description,
            additional_notes,
        }: {
            hours: number;
            minutes: number;
            tutee_name: string;
            tutor_name: string;
            contact: string;
            grade: number;
            subject: string;
            date: Date;
            description: string;
            additional_notes: string;
        }
    ) {
        const timeEmbed = new MessageEmbed()
            .setTitle("New Volunteer Time")
            .setDescription(`**additional notes:** \`${description}\``)
            .addFields([
                {
                    name: "Amount of Time",
                    value: `${hours} hours and ${minutes} minutes`,
                    inline: true,
                },
                {
                    name: "Date",
                    value: date,
                    inline: true,
                },
                {
                    name: "Subject",
                    value: subject,
                },
                {
                    name: "Tutee",
                    value: `${tutee_name} (${contact})`,
                    inline: true,
                },
                {
                    name: "Tutee Grade",
                    value: grade,
                    inline: true,
                },
                {
                    name: "Tutor",
                    value: tutor_name,
                },
                {
                    name: "Submitter",
                    value: message.author.tag,
                    inline: true,
                },
            ]);
        try {
            const msg = await this.client.times_channel.send(
                this.client.verifier_role ? this.client.verifier_role.toString() : "New Log",
                timeEmbed
            );
            const newTime = await new Log({
                name: tutor_name,
                description: description,
                additional_note: additional_notes,
                time: {
                    hours: hours,
                    minutes: minutes,
                },
                tutee: {
                    name: tutee_name,
                    contact: contact,
                    grade: grade,
                },
                subject: subject,
                date: date,
                msg_id: msg.id,
                submitter: message.author.id,
            }).save();
            void msg.edit(
                msg.embeds[0].setFooter(`To verify or reject this time, press the ✅ or ❌ • ID: ${newTime._id}`)
            );
            await msg.react("✅");
            await msg.react("❌");
            return message.author.send(
                `Your time log has been recieved and will be reviewed before being inputted. Please screenshot the details below for your records.\n\nid: ${
                    newTime._id
                }\nname: ${tutor_name}\ntime: ${hours} hours and ${minutes} minutes\ndate: ${new Date().toLocaleDateString()}`
            );
        } catch (e) {
            return message.channel.send("Issue Saving time to Database. Contact Zaid.");
        }
    }
}
