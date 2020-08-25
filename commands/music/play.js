const { Command } = require("discord.js-commando");
const { Util } = require("discord.js");
const ytdl = require("ytdl-core");
const YouTube = require("youtube-node");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      aliases: ["p"],
      name: "play",
      group: "music",
      memberName: "play",
      description: "Ngeplay musik pake link",
      guildOnly: true,
    });
  }

  async run(message) {
    console.log(message.argString);

    const song = {
      id: data.id.videoId,
      title: Util.escapeMarkdown(data.snippet.title),
      url: "https://www.youtube.com/watch?v=" + data.id.videoId,
    };

    if (serverQueue) {
      serverQueue.songs.push(song);
      message.react(`✅`);
      return;
    }

    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: channel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
    };
    message.client.queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);

    const play = async (song) => {
      const queue = message.client.queue.get(message.guild.id);
      if (!song) {
        queue.voiceChannel.leave();
        message.client.queue.delete(message.guild.id);
        return;
      }

      const dispatcher = queue.connection
        .play(ytdl(song.url), {
          quality: "highestaudio",
        })
        .on("finish", () => {
          queue.songs.shift();
          play(queue.songs[0]);
        })
        .on("error", (error) => console.error(error));
      dispatcher.setVolumeLogarithmic(queue.volume / 5);
      message.react("🎶");
    };

    try {
      const connection = await channel.join();
      queueConstruct.connection = connection;
      play(queueConstruct.songs[0]);
    } catch (error) {
      message.client.queue.delete(message.guild.id);
      await channel.leave();
    }
  }
};
