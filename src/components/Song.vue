<template>
  <!-- Music Header -->
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div
      class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)"
    ></div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button
        class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
        type="button"
        @click="newSong(song)"
      >
        <i
          :class="{ 'fa-play': !playing, 'fa-pause': playing }"
          class="fas"
        ></i>
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold">{{ song.modified_name }}</div>
        <div>{{ song.genre }}</div>
      </div>
    </div>
  </section>
  <!-- Form -->
  <section id="comments" class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <!-- Comment Count -->
        <span class="card-title">Comments ({{ song.comment_count }})</span>
        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <div
          v-if="comment_show_alert"
          :class="comment_alert_variant"
          class="text-white text-center font-semibold p-4 mb-4"
        >
          {{ comment_alert_msg }}
        </div>
        <vee-form
          v-if="userLoggedIn"
          :validation-schema="schema"
          @submit="addComment"
        >
          <vee-field
            as="textarea"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
            name="comment"
            placeholder="Your comment here..."
          ></vee-field>
          <div class="text-red-600">
            <ErrorMessage name="comment" />
          </div>
          <button
            :disabled="comment_in_submission"
            class="py-1.5 px-3 rounded text-white bg-green-600 block"
            type="submit"
          >
            Submit
          </button>
        </vee-form>
        <!-- Sort Comments -->
        <select
          v-model="sort"
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        >
          <option value="1">Latest</option>
          <option value="2">Oldest</option>
        </select>
      </div>
    </div>
  </section>
  <!-- Comments -->
  <ul id="" class="container mx-auto">
    <li
      v-for="comment in sortedComment"
      :key="comment.docId"
      class="p-6 bg-gray-50 border border-gray-200"
    >
      <!-- Comment Author -->
      <div class="mb-5">
        <div class="font-bold">{{ comment.name }}</div>
        <time>{{ comment.datePosted }}</time>
      </div>

      <p>
        {{ comment.content }}
      </p>
    </li>
  </ul>
</template>

<script>
import useUserStore from "@/stores/user";
import usePlayerStore from "@/stores/player";
import { mapState, mapActions } from "pinia";
import { songsCollection, auth, commentsCollection } from "@/includes/firbase";

export default {
  name: "Song",
  data() {
    return {
      song: {},
      comments: [],
      sort: "1",
      schema: {
        comment: "required|min:3",
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: "bg-blue-500",
      comment_alert_msg: "Please wait, your comment is being submitted",
    };
  },
  computed: {
    ...mapState(useUserStore, ["userLoggedIn"]),
    ...mapState(usePlayerStore, ["playing"]),
    sortedComment() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === "1") {
          return new Date(b.datePosted) - new Date(a.datePosted);
        }
        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    },
  },
  async created() {
    const docSnapShort = await songsCollection.doc(this.$route.params.id).get();

    if (!docSnapShort.exists) {
      this.$router.push({ name: "home" });
      return;
    }
    const { sort } = this.$route.query;

    this.sort = sort === "1" || sort === "2" ? sort : "1";

    this.song = docSnapShort.data();
    this.getComment();
  },

  methods: {
    ...mapActions(usePlayerStore, ["newSong"]),
    async getComment() {
      const snapShort = await commentsCollection
        .where("sid", "==", this.$route.params.id)
        .get();

      this.comments = [];
      snapShort.forEach((document) => {
        this.comments.push({
          docId: document.id,
          ...document.data(),
        });
      });
    },
    async addComment(values, { resetForm }) {
      this.comment_in_submission = true;
      this.comment_show_alert = true;
      this.comment_alert_variant = "bg-blue-500";
      this.comment_alert_msg = "Please wait, your comment is being submitted";

      const comment = {
        content: values.comment,
        uid: auth.currentUser.uid,
        sid: this.$route.params.id,
        datePosted: new Date().toString(),
        name: auth.currentUser.displayName,
      };
      await commentsCollection.add(comment);
      this.song.comment_count += 1;
      await songsCollection
        .doc(this.$route.params.id)
        .update({ comment_count: this.song.comment_count });
      this.getComment();

      this.comment_in_submission = false;
      this.comment_alert_variant = "bg-green-500";
      this.comment_alert_msg = "Comment added successfully";
      resetForm();
    },
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return;
      }
      this.$router.push({ query: { sort: newVal } });
    },
  },
};
</script>

<style scoped></style>
