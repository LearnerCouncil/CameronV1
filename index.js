const { Client, Collection, RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { config } = require("dotenv");
const { ErelaClient, Utils } = require("erela.js");
const { nodes } = require("./botconfig.json");
const fs = require("fs");
bannedWords = require("./banned-words.json");
whitelistedWords = require("./whitelisted-words.json");

const client = new Client({
    disableEveryone: true
})

// Collections
client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./commands/");

config({
    path: __dirname + "/.env"
});

// Run the command loader
["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on("ready", () => {
    console.log(`Hi, ${client.user.username} is now online!`);

    client.user.setPresence({
        status: "online",
        game: {
            name: "over you learners!",
            type: "WATCHING"
        }
    }); 

    client.music = new ErelaClient(client, nodes)
        .on("nodeError", console.log)
        .on("nodeConnect", () => console.log("Successfully created a new Node."))
        .on("queueEnd", player => {
            player.textChannel.send("Queue has ended.")
            return client.music.players.destroy(player.guild.id)
        })
        .on("trackStart", ({textChannel}, {title, duration}) => textChannel.send(`Now playing: **${title}** \`${Utils.formatTime(duration, true)}\``).then(m => m.delete()))
})

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.find(channel => channel.name === 'member-log');
    if (!channel) return;

    let role = member.guild.roles.find("name", "Waiting");

    const joinEmbed = new RichEmbed()
        .setColor("#00ff00")
        .setTitle(`${member.displayName} joined the server.`)
        .setDescription(`And now we wait...`)
        .setImage(member.displayAvatarURL)
        .setTimestamp()
        .setAuthor(member.displayName, member.displayAvatarURL);

    member.addRole(role);
    channel.send(joinEmbed);
});

client.on("messageDelete", (messageDelete) => {
    const deleteChannel = messageDelete.guild.channels.find(channel => channel.name === 'delete-log');

    const dEmbed = new RichEmbed()
        .setColor("#f2fa1b")
        .setTitle(stripIndents`**${messageDelete.author.tag} message got deleted.**`)
        .setDescription(stripIndents`*> Message:*
        ${messageDelete.content}`)
        .setTimestamp();
    
    deleteChannel.send(dEmbed);
});

client.on("message", async message => {
    const prefix = "_";

    if (message.author.bot) return;
    if (!message.guild) return;
    //if (!message.content.startsWith(prefix)) return;

    // If message.member is uncached, cache it.
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0) return;

    if(!message.content.startsWith(prefix)) {
        if(message.channel === "rr-1"){
            message.channel.send("Hello there.");
        }
    }
    
    // Get the command
    let command = client.commands.get(cmd);
    // If none is found, try to find it by alias
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    // If a command is finally found, run the command
    if (command) 
        command.run(client, message, args);
        if (message.content.toLowerCase().includes("dab")) return message.channel.send("ㄥ(⸝ ، ⸍ )‾‾");

        let blacklistedWords = bannedWords.bannedWord;

        let blacklisted = blacklistedWords;

        let whitelisted = whitelistedWords.whitelistedWord;
    
        let foundInText = false;
        for (var i in blacklisted) {
            if (message.content.toLowerCase().includes(blacklisted[i].toLowerCase())) foundInText = true;
        }

        if (message.member.hasPermission("VIEW_AUDIT_LOG")) return;

        if (foundInText) {
            message.delete().catch(O_o=>{});
            console.log("Yes it worked.")
    
            const logChannel = message.guild.channels.find(c => c.name === "inappropriate-log") || message.channel;
            const iMessage = message.content;
    
            const iDmEmbed = new RichEmbed()
                .setColor("RED")
                .setAuthor(message.member.displayName, message.author.displayAvatarURL)
                .setTitle(`Whoa! That's not allowed here at ${message.guild.name}!`)
                .setDescription("We have been notified of your actions. Do not do it again.")
                .addField(stripIndents`**> Your Message:**`, `${iMessage}`)
                .setFooter(`You could be Kicked or worse Banished!`);
    
            const iEmbed = new RichEmbed()
                .setColor("RED")
                .setAuthor(message.member.displayName, message.author.displayAvatarURL)
                .setTitle(`${message.member.displayName} said something bad!`)
                .setDescription("Do what you want with this information.")
                .setTimestamp()
                .addField('User information:', stripIndents`
                **> User:** ${message.author}
                **> Username:** ${message.author.username}
                **> Tag:** ${message.author.tag}
                **> Created at:** ${message.author.createdAt}`)
                .addField(`Message`, stripIndents`**> Users Message:** ${iMessage}
                **> Channel:** ${message.channel}`);
            
            if (message.author.send) message.author.send(iDmEmbed)
                .catch((err) => {
                    message.channel.send(`Not here ${message.author}.`).then(m => m.delete(5000))
                    return;
                });
    
            logChannel.send(iEmbed);
        }

});

client.login(process.env.TOKEN);