import { Howl } from "howler";
import { defineStore } from "pinia";

export default defineStore("player", {
  state: () => ({
    sounds: {},
    current_song: {},
  }),
  actions: {
    async newSong(song) {
      this.current_song = song;
      this.sounds = new Howl({
        src: [song.url],
        html5: true,
      });
      this.sounds.play();
    },
    async toggleAudio() {},
  },
});
