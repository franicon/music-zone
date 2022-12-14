<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload ref="upload" :addSong="addSong" />
      </div>
      <div class="col-span-2">
        <div
          class="bg-white rounded border border-gray-200 relative flex flex-col"
        >
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i
              class="fa fa-compact-disc float-right text-green-400 text-2xl"
            ></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <composition-item
              v-for="(song, i) in songs"
              :key="song.id"
              :index="i"
              :removeSong="removeSong"
              :song="song"
              :updateSong="updateSong"
              :updateUnsaveFlag="updatedUnsaveFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import AppUpload from "@/components/Upload.vue";
import { songsCollection, auth } from "@/includes/firbase";
import CompositionItem from "@/components/CompositionItem.vue";

export default {
  name: "Manage",
  components: { AppUpload, CompositionItem },
  data() {
    return {
      songs: [],
      unsaveFlag: false,
    };
  },

  async created() {
    const snapShort = await songsCollection
      .where("uid", "==", auth.currentUser.uid)
      .get();

    snapShort.forEach(this.addSong);
  },
  methods: {
    updateSong(i, values) {
      this.songs[i].modified_name = values.modified_name;
      this.songs[i].genre = values.genre;
    },

    removeSong(i) {
      this.songs.splice(i, 1);
    },

    addSong(document) {
      const song = {
        ...document.data(),
        docId: document.id,
      };
      this.songs.push(song);
    },
    updatedUnsaveFlag(value) {
      this.unsaveFlag = value;
    },
  },
  beforeRouteLeave(to, from, next) {
    if (!this.updatedUnsaveFlag) {
      next();
    } else {
      const leave = confirm(
        "You have unsaved changes are sure you wan tot leave?"
      );
      next(leave);
    }
  },
};
</script>
