const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { getMember } = require('../../functions.js');

module.exports = {
    name: "report",
    category: "learners",
    description: "Reports a member.",
    usage: "<mention | id>",
    run: async (client, message, args) => {
        if (message.deletable) message.delete();

        let rMember = message.mentions.members.first() || message.guild.members.get(args[0]);

        if (!rMember)
            return message.channel.send(`Couldn't find that person ${message.author}.`).then(m => m.delete(5000));

        if (rMember.hasPermission("BAN_MEMBERS") || rMember.user.bot)
            return message.channel.send(`Can't report that member ${message.author}.`).then(m => m.delete(5000));
    
        if (!args[1])
            return message.channel.send(`Please give a reason for the report ${message.author}.`).then(m => m.delete(5000));

        const channel = message.guild.channels.find(channel => channel.name === "reporting-log");

        if (!channel)
            return message.channel.send("I couldn't find a \`#reporting-log\` channel").then(m => m.delete(5000));

        const embed = new RichEmbed()
            .setColor("#fff200")
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setAuthor("Reported member", rMember.user.displayAvatarURL)
            .setDescription(stripIndents`**> Member:** ${rMember} (${rMember.id})
            **> Reported by:** ${message.member} (${message.member.id})
            **> Reported in:** ${message.channel}
            **> Reason:** ${args.slice(1).join(" ")}`);

        return channel.send(embed);
    }
}