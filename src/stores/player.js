import { Howl } from "howler";
import { defineStore } from "pinia";
import * as http from "http";

export default defineStore("player", {
  state: () => ({
    sounds: {},
    seek: "00.000",
    duration: "00.000",
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

      this.sounds.on("play", () => {
        requestAnimationFrame(this.progress);
      });
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

    progress() {
      this.seek = this.sounds.seek();
      this.duration = this.sounds.duration();

      if (this.sounds.playing()) {
        requestAnimationFrame(this.progress);
      }
    },
  },

  getters: {
    playing: (state) => {
      if (state.sounds.playing) {
        return state.sounds.playing();
      }
      return false;
    },
  },
});
