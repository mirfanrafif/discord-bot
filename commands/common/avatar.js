const { Command } = require("discord.js-commando");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "avatar",
      group: "common",
      memberName: "avatar",
      description: "Replies with a meow, kitty cat.",
    });
  }

  run(message) {
    console.log("kodingan ini jalan");
    const mentionedUser = message.mentions.users.first();
    return message.channel.send(mentionedUser.avatarURL());
  }
};
