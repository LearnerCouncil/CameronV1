const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "kick",
    category: "moderation",
    description: "Kicks the member",
    usage: "<id | mention>",
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === "kick-log") || message.channel;

        if (message.deletable) message.delete();

        // No author permissions
        if (!message.member.hasPermission("VIEW_AUDIT_LOG")) {
            return message.channel.send(`You do not have permissions to kick members, ${message.author}.`)
                .then(m => m.delete(5000));
        }

        // No args
        if (!args[0]) {
            return message.reply("Please provide a person to kick.")
                .then(m => m.delete(5000));
        }

        // No reason
        if (!args[1]) {
            return message.reply("Please provide a reason to kick.")
                .then(m => m.delete(5000));
        }

        // No bot permissions
        if (!message.guild.me.hasPermission("VIEW_AUDIT_LOG")) {
            return message.reply("I do not have permissions to kick members.")
                .then(m => m.delete(5000));
        }

        const toKick = message.mentions.members.first() || message.guild.members.get(args[0]);

        // No member found
        if (!toKick) {
            return message.reply("Couldn't find that member, try again.")
                .then(m => m.delete(5000));
        }

        // Can't kick urself
        if (toKick.id === message.author.id) {
            return message.reply("You can't kick yourself...")
                .then(m => m.delete(5000));
        }

        // Check if the user's kickable
        if (!toKick.kickable) {
            return message.reply("I can't kick that person.")
                .then(m => m.delete(5000));
        }
                
        const embed = new RichEmbed()
            .setColor("#ff9900")
            .setThumbnail(toKick.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents`**> Kicked member:** ${toKick} (${toKick.id})
            **> Kicked by:** ${message.member} (${message.member.id})
            **> Reason:** ${args.slice(1).join(" ")}`);

        const promptEmbed = new RichEmbed()
            .setColor("GREEN")
            .setAuthor(`This verification becomes invalid after 30s.`)
            .setDescription(`Do you want to kick ${toKick}?`);

        const kickedEmbed = new RichEmbed()
            .setColor("#ff9900")
            .setFooter(message.guild.name, message.guild.iconURL)
            .setTimestamp()
            .setTitle(stripIndents`**> Kicked!** You have been kicked from ${message.guild.name}.`)
            .setDescription(stripIndents`**> Kicked member:** ${toKick}
            **> Reason:** ${args.slice(1).join(" ")}`);

        // Send the message
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reaction collector
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            // The verification stuffs
            if (emoji === "✅") {
                msg.delete();

                toKick
                .createDM()
                .then((DMChannel) => {
                    // We have now a channel ready.
                    // Send the message.
                    DMChannel
                        .send(kickedEmbed)
                            .catch((err) => {
                                logChannel.send(`Direct message to ${toKick.displayName}: Failed; Not a vital element.`)
                            })
                        .then(() => {
                            // Message sent, time to kick.
                            toKick.kick(args.slice(1).join(" "))
                                .catch((err) => {
                                    message.reply("Couldn't kick them...")
                                });
                        });
                });

                logChannel.send(embed);
            
            } else if (emoji === "❌") {
                msg.delete();

                message.reply(`Kick canceled.`)
                    .then(m => m.delete(10000));
            }
        });
    }
};