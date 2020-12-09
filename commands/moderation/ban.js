const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "ban",
    category: "moderation",
    description: "bans the member",
    usage: "<id | mention>",
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === "ban-log") || message.channel;

        if (message.deletable) message.delete();

        // No author permissions
        if (!message.member.hasPermission("VIEW_AUDIT_LOG")) {
            return message.reply("You do not have permissions to ban members.")
                .then(m => m.delete(5000));
        }

        // No args
        if (!args[0]) {
            return message.reply("Please provide a person to ban.")
                .then(m => m.delete(5000));
        }

        // No reason
        if (!args[1]) {
            return message.reply("Please provide a reason to ban.")
                .then(m => m.delete(5000));
        }

        // No bot permissions
        if (!message.guild.me.hasPermission("VIEW_AUDIT_LOG")) {
            return message.reply("I do not have permissions to ban members.")
                .then(m => m.delete(5000));
        }

        const toBan = message.mentions.members.first() || message.guild.members.get(args[0]);

        // No member found
        if (!toBan) {
            return message.reply("Couldn't find that member.")
                .then(m => m.delete(5000));
        }

        // Can't ban urself
        if (toBan.id === message.author.id) {
            return message.reply("You can't ban yourself...")
                .then(m => m.delete(5000));
        }

        // Check if the user's banable
        if (!toBan.bannable) {
            return message.reply("I can't ban that person.")
                .then(m => m.delete(5000));
        }
        
        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setThumbnail(toBan.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents`**> Banned member:** ${toBan} (${toBan.id})
            **> Banned by:** ${message.member} (${message.member.id})
            **> Reason:** ${args.slice(1).join(" ")}`);

        const promptEmbed = new RichEmbed()
            .setColor("GREEN")
            .setAuthor(`This verification becomes invalid after 30s.`)
            .setDescription(`Do you want to ban ${toBan}?`);

        const bannedEmbed = new RichEmbed()
            .setColor("#ff0000")
            .setFooter(message.guild.name, message.guild.iconURL)
            .setTimestamp()
            .setTitle(stripIndents`**> BANISHED!** You have been banned from ${message.guild.name}.`)
            .setDescription(stripIndents`**> Banned member:** ${toBan}
            **> Reason:** ${args.slice(1).join(" ")}`);

        // Send the message
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reactioncollector
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            // Verification stuffs
            if (emoji === "✅") {
                msg.delete();

            toBan
                .createDM()
                .then((DMChannel) => {
                    // We have now a channel ready.
                    // Send the message.
                    DMChannel
                        .send(bannedEmbed)
                            .catch((err) => {
                                logChannel.send(`Direct message to ${toBan.displayName}: Failed; Not a vital element.`)
                            })
                        .then(() => {
                            // Message sent, time to kick.
                            toBan.ban(args.slice(1).join(" "))
                                .catch((err) => {
                                    message.reply("Couldn't ban them...")
                                });
                        });
                });

                logChannel.send(embed);

            } else if (emoji === "❌") {
                msg.delete();

                message.reply(`Ban canceled.`)
                    .then(m => m.delete(10000));
            }
        });
    }
};