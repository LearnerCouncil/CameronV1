const { config } = require("dotenv");

const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const sms = require('twilio')(accountSid, authToken);

module.exports = {
    name: "sms",
    aliases: ["text"],
    category: "moderation",
    description: "description",
    usage: "<input>",
    run: async (client, message, args) => {
        
        if(message.deletable) message.delete();

        if(!message.author.id === "345717758417305600") return message.reply("Nope. You can not do that.").then(m => m.delete(5000));

        if(!args[0]) return message.reply("You to provide a phone number.").then(m => m.delete(5000));
        if(!args[1]) return message.reply("You to provide a message.").then(m => m.delete(5000));

        let phoneTo = args[0];

        if(phoneTo.startsWith("+1")) {
            if (!phoneTo.length === "12") return message.reply("That doesn't look like a vaild U.S. number.").then(m => m.delete(5000));

            let smsTo = phoneTo;
            let smsMessage = args.slice(1).join(" ");

            sms.messages
                .create({
                    body: smsMessage,
                    from: '+15038522696',
                    to: smsTo
                })
                .then(message => console.log(message.sid));
            return;
        } else if(!phoneTo.startsWith("+1")) {
            if (!phoneTo.length === 10) return message.reply("That doesn't look like a vaild U.S. number.").then(m => m.delete(5000));

            let smsTo = `+1${phoneTo}`;
            let smsMessage = args.slice(1).join(" ");

            sms.messages
                .create({
                    body: smsMessage,
                    from: '+15038522696',
                    to: smsTo
                })
                .then(message => console.log(message.sid));
            return;
        } else if(!phoneTo.startsWith("1")) {
            if (!phoneTo.length === 11) return message.reply("That doesn't look like a vaild U.S. number.").then(m => m.delete(5000));

            let smsTo = `+${phoneTo}`;
            let smsMessage = args.slice(1).join(" ");

            sms.messages
                .create({
                    body: smsMessage,
                    from: '+15038522696',
                    to: smsTo
                })
                .then(message => console.log(message.sid));
            return;
        } 

    }
}