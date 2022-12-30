import { Howl } from "howler";
import { defineStore } from "pinia";
import helpers from "@/includes/helpers";

export default defineStore("player", {
  state: () => ({
    sounds: {},
    seek: "00.00",
    duration: "00.00",
    current_song: {},
    playerProgress: "0%",
  }),
  actions: {
    async newSong(song) {
      if (this.sounds instanceof Howl) {
        this.sounds.unload();
      }
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
      this.seek = helpers.formatTime(this.sounds.seek());
      this.duration = helpers.formatTime(this.sounds.duration());
      this.playerProgress = `${
        (this.sounds.seek() / this.sounds.duration()) * 100
      }%`;

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
