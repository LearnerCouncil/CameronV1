module.exports = {
    name: "massmute",
    aliases: ["mute", "offline"],
    category: "moderation",
    description: "Mutes Everyone",
    usage: "<command>",
    run: async (client, message, args) => {

        let role = message.guild.roles.find(r => r.name == 'Offline')

        if (!role) return message.channel.send(`**${message.author.username}**, role not found`)

        message.guild.members.filter(m => !m.user.bot).forEach(member => member.addRole(role))
        message.channel.send(`**${message.author.username}**, role **${role.name}** was added to all members`)
    }
}