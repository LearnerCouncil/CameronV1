const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage, formatDate } = require("../../functions.js");

module.exports = {
    name: "request",
    aliases: ["auth", "requested", "authentication"],
    category: "moderation",
    description: "Request authentication from Village Home.",
    run: async (client, message, args) => {

        if (message.deletable) message.delete();

        if(message.channel.name != "rr-1") return message.reply("Can't do that here.");

        let requestlog = message.guild.channels.find(channel => channel.name === "request-log");

        const startEmbed = new RichEmbed()
            .setColor("#00ff00")
            .setAuthor("This will expire in 1 minute.")
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setDescription("You are about to request access to The Learner Server. Do you want to proceed?");

        const question1Embed = new RichEmbed()
            .setColor("#00ff00")
            .setAuthor("This will expire in 1 minute.")
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .addField(`What is your rank?`, stripIndents`**> Are you a:**
            1️⃣ Student
            2️⃣ Parent
            3️⃣ Teacher`);

        const question2SEmbed = new RichEmbed()
            .setColor("#57b8fc")
            .setAuthor("This will expire in 2 minutes.")
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setDescription("Type your First and Last Name.");

        const question2AEmbed = new RichEmbed()
            .setColor("#1fc8d8")
            .setAuthor("This will expire in 2 minutes.")
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setDescription("Type your First and Last Name.");

        const question2TEmbed = new RichEmbed()
            .setColor("#4e7cfc")
            .setAuthor("This will expire in 2 minutes.")
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setDescription("Type your First and Last Name.");

        const question3SEmbed = new RichEmbed()
            .setColor("#57b8fc")
            .setAuthor("This will expire in 5 minutes.")
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setDescription("Type your parents Email address for Village Home.");

        const question3AEmbed = new RichEmbed()
            .setColor("#1fc8d8")
            .setAuthor("This will expire in 5 minutes.")
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setDescription("Type your Email address for Village Home.");

        const question3TEmbed = new RichEmbed()
            .setColor("#4e7cfc")
            .setAuthor("This will expire in 5 minutes.")
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setDescription("Type your Email address for Village Home.");

        const question4SEmbed = new RichEmbed()
            .setColor("#57b8fc")
            .setAuthor("This will expire in 2 minutes.")
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .addField(`What is your age group at Village Home?`, stripIndents`**> Age group:**
            1️⃣ 6-9
            2️⃣ 10-14
            3️⃣ 15-18`);

        const question4AEmbed = new RichEmbed()
            .setColor("#1fc8d8")
            .setAuthor("This will expire in 2 minutes.")
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setDescription("Type your Child's name(s)?");

        const question4TEmbed = new RichEmbed()
            .setColor("#4e7cfc")
            .setAuthor("This will expire in 2 minutes.")
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setDescription("Type your Job for Village Home?");

        const endEmbed = new RichEmbed()
            .setColor("#00ff00")
            .setAuthor("Finished!")
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setDescription("You are all set! We will let you know once you have been accepted!");

        // Send the message
        await message.channel.send(startEmbed).then(async msg => {
            // Await the reactions and the reaction collector
            const emoji = await promptMessage(msg, message.author, 60, ["✅", "❌"]);

            // Proceed
            if (emoji === "✅") {
                msg.delete();

                //Question 1
                await message.channel.send(question1Embed).then(async msg => {
                // Await the reactions and the reaction collector
                    const emoji = await promptMessage(msg, message.author, 60, [`1️⃣`, `2️⃣`, `3️⃣`]);

                    // If they are a Student
                    if (emoji === `1️⃣`) {
                        msg.delete();

                        // Question 2: Name.
                        const filter = m => m.author.id === message.author.id;
                            message.channel.send(question2SEmbed).then(q => q.delete(125000))
                            message.channel.awaitMessages(filter, {
                                max: 1,
                                time: 120000
                            }).then(collected => {
                                //message.delete().catch(O_o=>{});

                                if (collected.first().content === 'cancel') {
                                    return message.reply("Canceled.");
                                }

                                let q2S = collected.first().content;

                                    // Question 3: Parents Email for Village Home.
                                    const filter = m => m.author.id === message.author.id;
                                        message.channel.send(question3SEmbed).then(q => q.delete(305000))
                                        message.channel.awaitMessages(filter, {
                                            max: 1,
                                            time: 300000
                                        }).then(collected => {
                                            message.delete().catch(O_o=>{});
                                    
                                            if (collected.first().content === 'cancel') {
                                                return message.reply("Canceled.");
                                            }

                                        let q3S = collected.first().content;

                                        // Question 4: What is you age group?
                                        message.channel.send(question4SEmbed).then(async msg => {
                                            // Await the reactions and the reaction collector
                                            const emoji = await promptMessage(msg, message.author, 120, [`1️⃣`, `2️⃣`, `3️⃣`]);

                                            if (emoji === `1️⃣`) {
                                                msg.delete();
                                                let q4S = "6-9";

                                                const question5SEmbed = new RichEmbed()
                                                    .setColor("#57b8fc")
                                                    .setTitle("Does this look correct?")
                                                    .setDescription(`Click the 'X' if you want to cancel.
                                                    This will expire in 2 minutes.`)
                                                    .setFooter(message.member.displayName, message.author.displayAvatarURL)
                                                    .addField(`Information provided to us`, stripIndents`**> Village Home Rank:** Student
                                                    **> Name:** ${q2S}
                                                    **> Parent Email Address:** ${q3S}
                                                    **> Age group:** ${q4S}`);

                                                //Question 5: Is it all correct?
                                                message.channel.send(question5SEmbed).then(async msg => {
                                                    const emoji = await promptMessage(msg, message.author, 120, [`✅`, `❌`]);

                                                    if (emoji === `✅`) {
                                                        msg.delete();

                                                        const sRequestEmbed = new RichEmbed()
                                                            .setColor("#57b8fc")
                                                            .setTitle(`${message.member.displayName} made a Request to come in!`)
                                                            .setDescription(`If you accept them, manually change thier role to 'Learner'`)
                                                            .setFooter(message.member.displayName, message.author.displayAvatarURL)
                                                            .addField(`Information provided to us`, stripIndents`**> Village Home Rank:** Student
                                                            **> Name:** ${q2S}
                                                            **> Parent Email Address:** ${q3S}
                                                            **> Age group:** ${q4S}`);

                                                        message.channel.send(endEmbed).then(m => m.delete(5000));

                                                        requestlog.send(sRequestEmbed);
                                                    } else if (emoji === `❌`) {
                                                        message.channel.send(`All canceled ${message.author}! Type '_request' if you want to try again.`)
                                                    }
                                                });
                                            }
                                            if (emoji === `2️⃣`) {
                                                msg.delete();
                                                let q4S = "10-14";

                                                const question5SEmbed = new RichEmbed()
                                                    .setColor("#57b8fc")
                                                    .setTitle("Does this look correct?")
                                                    .setDescription(`Click the 'X' if you want to cancel.
                                                    This will expire in 2 minutes.`)
                                                    .setFooter(message.member.displayName, message.author.displayAvatarURL)
                                                    .addField(`Information provided to us`, stripIndents`**> Village Home Rank:** Student
                                                    **> Name:** ${q2S}
                                                    **> Parent Email Address:** ${q3S}
                                                    **> Age group:** ${q4S}`);

                                                //Question 5: Is it all correct?
                                                message.channel.send(question5SEmbed).then(async msg => {
                                                    const emoji = await promptMessage(msg, message.author, 120, [`✅`, `❌`]);

                                                    if (emoji === `✅`) {
                                                        msg.delete();

                                                        const sRequestEmbed = new RichEmbed()
                                                            .setColor("#57b8fc")
                                                            .setTitle(`${message.member.displayName} made a Request to come in!`)
                                                            .setDescription(`If you accept them, manually change thier role to 'Learner'`)
                                                            .setFooter(message.member.displayName, message.author.displayAvatarURL)
                                                            .addField(`Information provided to us`, stripIndents`**> Village Home Rank:** Student
                                                            **> Name:** ${q2S}
                                                            **> Parent Email Address:** ${q3S}
                                                            **> Age group:** ${q4S}`);

                                                        message.channel.send(endEmbed).then(m => m.delete(5000));

                                                        requestlog.send(sRequestEmbed);
                                                    } else if (emoji === `❌`) {
                                                        message.channel.send(`All canceled ${message.author}! Type '_request' if you want to try again.`)
                                                    }
                                                });
                                            }
                                            if (emoji === `3️⃣`) {
                                                msg.delete();
                                                let q4S = "15-18";

                                                const question5SEmbed = new RichEmbed()
                                                    .setColor("#57b8fc")
                                                    .setTitle("Does this look correct?")
                                                    .setDescription(`Click the 'X' if you want to cancel.
                                                    This will expire in 2 minutes.`)
                                                    .setFooter(message.member.displayName, message.author.displayAvatarURL)
                                                    .addField(`Information provided to us`, stripIndents`**> Village Home Rank:** Student
                                                    **> Name:** ${q2S}
                                                    **> Parent Email Address:** ${q3S}
                                                    **> Age group:** ${q4S}`);

                                                //Question 5: Is it all correct?
                                                message.channel.send(question5SEmbed).then(async msg => {
                                                    const emoji = await promptMessage(msg, message.author, 120, [`✅`, `❌`]);

                                                    if (emoji === `✅`) {
                                                        msg.delete();

                                                        const sRequestEmbed = new RichEmbed()
                                                            .setColor("#57b8fc")
                                                            .setTitle(`${message.member.displayName} made a Request to come in!`)
                                                            .setDescription(`If you accept them, manually change thier role to 'Learner'`)
                                                            .setFooter(message.member.displayName, message.author.displayAvatarURL)
                                                            .addField(`Information provided to us`, stripIndents`**> Village Home Rank:** Student
                                                            **> Name:** ${q2S}
                                                            **> Parent Email Address:** ${q3S}
                                                            **> Age group:** ${q4S}`);

                                                        message.channel.send(endEmbed).then(m => m.delete(5000));

                                                        requestlog.send(sRequestEmbed);
                                                    } else if (emoji === `❌`) {
                                                        message.channel.send(`All canceled ${message.author}! Type '_request' if you want to try again.`)
                                                    }
                                                });
                                            }


                                        });

                                    });

                                });
                    }
                     
                    if (emoji === `2️⃣`) {
                        msg.delete();

                        //Question 2: What is your First and Last Name?
                        const filter = m => m.author.id === message.author.id;
                            message.channel.send(question2AEmbed).then(q => q.delete(125000))
                            message.channel.awaitMessages(filter, {
                                max: 1,
                                time: 300000
                            }).then(collected => {
                                
                                let q2A = collected.first().content;

                                //Question 3: What is your email used for Village Home?
                                const filter = m => m.author.id === message.author.id;
                                    message.channel.send(question3AEmbed).then(q => q.delete(305000))
                                    message.channel.awaitMessages(filter, {
                                        max: 1,
                                        time: 300000
                                    }).then(collected => {

                                        let q3A = collected.first().content;

                                        //Question 4: What is your Child's name(s)?
                                        const filter = m => m.author.id === message.author.id;
                                            message.channel.send(question4AEmbed).then(q => q.delete(125000))
                                            message.channel.awaitMessages(filter, {
                                                max: 1,
                                                time: 300000
                                            }).then(collected => {

                                                let q4A = collected.first().content;

                                                const question5AEmbed = new RichEmbed()
                                                    .setColor("#57b8fc")
                                                    .setTitle("Does this look correct?")
                                                    .setDescription(stripIndents`**>Click the 'X' if you want to cancel.**
                                                    This will expire in 2 minutes.`)
                                                    .setFooter(message.member.displayName, message.author.displayAvatarURL)
                                                    .addField(`Information provided to us`, stripIndents`**> Village Home Rank:** Parent
                                                    **> Name:** ${q2A}
                                                    **> Parent Email Address:** ${q3A}
                                                    **> Child's name(s):** ${q4A}`);

                                                message.channel.send(question5AEmbed).then(async msg => {
                                                    // Await the reactions and the reaction collector
                                                    const emoji = await promptMessage(msg, message.author, 60, ["✅", "❌"]);

                                                    if (emoji === `✅`) {
                                                        msg.delete();

                                                        const aRequestEmbed = new RichEmbed()
                                                            .setColor("#1fc8d")
                                                            .setTitle(`${message.member.displayName} made a Request to come in!`)
                                                            .setDescription(`If you accept them, manually change thier role to 'Learner'`)
                                                            .setFooter(message.member.displayName, message.author.displayAvatarURL)
                                                            .addField(`Information provided to us`, stripIndents`**> Village Home Rank:** Parent
                                                            **> Parent Name:** ${q2A}
                                                            **> Parent Email Address:** ${q3A}
                                                            **> Child's name(s):** ${q4A}`);

                                                        message.channel.send(endEmbed).then(m => m.delete(10000));

                                                        requestlog.send(aRequestEmbed);
                                                    } else if (emoji === `❌`) {
                                                        msg.delete();
                                                        message.channel.send(`All canceled ${message.member.displayName}. Type '_request' if you want to try again!`).then(m => m.delete(10000));
                                                    };
                                                });

                                            });

                                    });
                        });
                    }
                    if (emoji === `3️⃣`) {
                        msg.delete();

                        //Question 2: What is your First and Last Name?
                        const filter = m => m.author.id === message.author.id;
                            message.channel.send(question2TEmbed).then(q => q.delete(125000))
                            message.channel.awaitMessages(filter, {
                                max: 1,
                                time: 300000
                            }).then(collected => {
                                
                                let q2T = collected.first().content;

                                //Question 3: What is your email used for Village Home?
                                const filter = m => m.author.id === message.author.id;
                                    message.channel.send(question3TEmbed).then(q => q.delete(305000))
                                    message.channel.awaitMessages(filter, {
                                        max: 1,
                                        time: 300000
                                    }).then(collected => {

                                        let q3T = collected.first().content;

                                        //Question 4: What is your job at Village Home?
                                        const filter = m => m.author.id === message.author.id;
                                            message.channel.send(question4TEmbed).then(q => q.delete(125000))
                                            message.channel.awaitMessages(filter, {
                                                max: 1,
                                                time: 300000
                                            }).then(collected => {

                                                let q4T = collected.first().content;

                                                const question5TEmbed = new RichEmbed()
                                                    .setColor("#4e7cfc")
                                                    .setTitle("Does this look correct?")
                                                    .setDescription(stripIndents`**>Click the 'X' if you want to cancel.**
                                                    This will expire in 2 minutes.`)
                                                    .setFooter(message.member.displayName, message.author.displayAvatarURL)
                                                    .addField(`Information provided to us`, stripIndents`**> Village Home Rank:** Teacher
                                                    **> Name:** ${q2T}
                                                    **> Village Home Email Address:** ${q3T}
                                                    **> Job at Village:** ${q4T}`);

                                                message.channel.send(question5TEmbed).then(async msg => {
                                                    // Await the reactions and the reaction collector
                                                    const emoji = await promptMessage(msg, message.author, 60, ["✅", "❌"]);

                                                    if (emoji === `✅`) {
                                                        msg.delete();

                                                        const tRequestEmbed = new RichEmbed()
                                                            .setColor("#4e7cfc")
                                                            .setTitle(`${message.member.displayName} made a Request to come in!`)
                                                            .setDescription(`If you accept them, manually change thier role to 'Teacher'`)
                                                            .setFooter(message.member.displayName, message.author.displayAvatarURL)
                                                            .addField(`Information provided to us`, stripIndents`**> Village Home Rank:** Teacher
                                                            **> Teacher Name:** ${q2T}
                                                            **> Village Home Email Address:** ${q3T}
                                                            **> Job at Village:** ${q4T}`);

                                                        message.channel.send(endEmbed).then(m => m.delete(10000));

                                                        requestlog.send(tRequestEmbed);
                                                    } else if (emoji === `❌`) {
                                                        msg.delete();
                                                        message.channel.send(`All canceled ${message.member.displayName}. Type '_request' if you want to try again!`).then(m => m.delete(10000));
                                                    };
                                                });

                                            });

                                    });
                        });
                    }
                });
            
            } else if (emoji === "❌") {
                msg.delete();

                message.channel.send(`Ok, have fun where you are ${message.author}!`)
                    .then(m => m.delete(10000));
            }
        });
    }
}