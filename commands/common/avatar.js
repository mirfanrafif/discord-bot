const { Command } = require("discord.js-commando");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "avatar",
      group: "common",
      memberName: "avatar",
      description: "Munculin avatar",
    });
  }

  run(message) {
    var avatar;
    if (message.mentions.users.first()) {
      avatar = message.mentions.users.first();
      return message.channel.send(avatar.avatarURL());
    } else {
      message.channel.send("Mention orangnya dong...");
    }
  }
};
