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
      description: "Ngeplay musik",
      guildOnly: true,
    });
  }

  run(message) {
    var youtube = new YouTube();
    youtube.setKey(process.env.YOUTUBE_API_KEY);
    youtube.search(message.argString, 2, async function (err, res) {
      var data = res.items[0];
      // console.log(data);

      const { channel } = message.member.voice;
      if (!channel)
        return message.channel.send("Kamu belum gabung voice channel, nak...");

      const serverQueue = message.client.queue.get(message.guild.id);

      var songInfo;

      if (message.argString.substring(0, 5) == "https") {
        songInfo = message.argString;
      } else {
        songInfo = await ytdl.getInfo(
          "https://www.youtube.com/watch?v=" + data.id.videoId
        );
      }

      const song = {
        id: data.id.videoId,
        title: Util.escapeMarkdown(data.snippet.title),
        url: songInfo.videoDetails.video_url,
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

        options = {
          quality: "highestaudio",
        };

        const dispatcher = queue.connection
          .play(ytdl(song.url), options)
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
    });
  }
};
