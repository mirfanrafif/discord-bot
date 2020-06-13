const discord = require("discord.js");
const MusicClient = require("./Client");
const music = require("./music");

const client = new MusicClient({ token: process.env.DISCORD_TOKEN });

const prefix = ".";

client.on("ready", () => {
  console.log("I am ready");
});

//message
client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  } else {
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    switch (command) {
      case "avatar":
        const mentionedUser = message.mentions.users.first();
        message.channel.send(mentionedUser.avatarURL());
        break;

      case "ping":
        const reply = message.createdTimestamp - new Date().getTime() + " ms";
        message.channel.send(reply);
        break;

      case "play":
        music.MusicPlay(message, args);
        break;

      case "queue":
        music.queue(message);
        break;

      case "stop":
        music.stop(message);
        break;

      case "skip":
        music.skip(message);
        break;

      default:
        message.channel.send("Command not found");
        break;
    }
  }
});

//autoroles
client.on("guildMemberAdd", async (member) => {
  var role = member.guild.roles.cache.find((r) => r.name === "numpang lewat");
  await member.roles.add(role.id);
});

client.login("NzIxMDIyNDU4NTA0Njc1NDE4.XuOeyg.sEeXOjKDGZi_hovH0VyXei9ubkM");
