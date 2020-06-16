const { Command } = require("discord.js-commando");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      aliases: ["s"],
      name: "stop",
      group: "music",
      memberName: "stop",
      description: "Nyetop musik",
      guildOnly: true,
    });
  }

  run(message) {
    const { channel } = message.member.voice;
    if (!channel)
      return message.channel.send("Kamu belum gabung voice channel, nak...");
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send("Mau nyetop apa aku...");
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
    message.react("⏹");
  }
};
