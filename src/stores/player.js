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
    async toggleAudio() {
      if (!this.sounds.playing) {
        return;
      }

      if (this.sounds.playing()) {
        this.sounds.pause();
      } else {
        this.sounds.play();
      }
    },
    getters: {
      playing: (state) => {
        if (state.sounds.playing) {
          return this.sounds.playing();
        }
        return false;
      },
    },
  },
});
