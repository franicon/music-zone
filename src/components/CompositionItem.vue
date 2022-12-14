<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-md font-bold">{{ song.modified_name }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div>
      <div class="text-white text-center font-semibold p-4 mb-4">
        <div v-if="show_alert" :class="alert_variant">{{ alert_msg }}</div>
      </div>
      <vee-form
        v-show="showForm"
        :initial-values="song"
        :validation-schema="schema"
        @submit="edit"
      >
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            name="modified_name"
            placeholder="Enter Song Title"
            type="text"
          />
          <ErrorMessage class="text-red-500 text-xs" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            name="genre"
            placeholder="Enter Genre"
            type="text"
          />
          <ErrorMessage class="text-red-500" name="genre" />
        </div>
        <button
          :disabled="in_submission"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          type="submit"
        >
          Submit
        </button>
        <button
          :disabled="in_submission"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          type="button"
          @click.prevent="showForm = false"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { songsCollection } from "@/includes/firbase";

export default {
  name: "CompositionItem",
  props: {
    song: {
      type: Object,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      schema: {
        modified_name: "required",
        genre: "alpha_spaces",
      },
      showForm: false,
      in_submission: false,
      show_alert: false,
      alert_variant: "bg-blue-500",
      alert_msg: "Please wait! Updating song info.",
    };
  },

  methods: {
    async edit(values) {
      this.in_submission = true;
      this.show_alert = true;
      this.alert_variant = "bg-blue-500";
      this.alert_msg = "Please wait! Updating song info.";
      try {
        await songsCollection.doc(this.song.docID).update(values);
      } catch (error) {
        this.in_submission = false;
        this.alert_variant = "bg-red-500";
        this.alert_msg = "Something Went wrong, Try again Later";
      }
      this.updateSong(this.index, values);

      this.in_submission = false;
      this.alert_variant = "bg-green-500";
      this.alert_msg = "Success!";
    },
  },
};
</script>

<style scoped></style>
