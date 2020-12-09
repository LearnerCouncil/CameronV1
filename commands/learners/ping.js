module.exports = {
    name: "ping",
    category: "learners",
    description: "Returns latency and API ping",
    run: async (client, message, args) => {
        const msg = await message.channel.send(`🏓 Pinging....`);

        msg.edit(`🏓 Pong!
Latency is ${Math.round(client.ping)}ms`);
    }
}