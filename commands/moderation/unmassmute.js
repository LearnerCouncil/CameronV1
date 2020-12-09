module.exports = {
    name: "unmassmute",
    aliases: ["unmute", "online"],
    category: "moderation",
    description: "Unmutes Everyone",
    usage: "<command>",
    run: async (client, message, args) => {

        let role = message.guild.roles.find(r => r.name == 'Offline');

        if (!role) return message.channel.send(`**${message.author.username}**, role not found`);

        message.guild.members.filter(m => !m.user.bot).forEach(member => member.removeRole(role));
        message.channel.send(`**${message.author.username}**, role **${role.name}** was removed from all members`);
    }
}