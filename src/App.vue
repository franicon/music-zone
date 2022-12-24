<template>
  <app-header />
  <router-view></router-view>
  <app-player />
  <auth />
</template>

<script>
import Auth from "@/components/Auth.vue";
import { mapWritableState } from "pinia";
import useUserStore from "@/stores/user";
import { auth } from "@/includes/firbase";
import AppPlayer from "@/components/Player.vue";
import AppHeader from "@/components/Header.vue";

export default {
  name: "App",
  components: { Auth, AppPlayer, AppHeader },
  computed: {
    ...mapWritableState(useUserStore, ["userLoggedIn"]),
  },

  created() {
    if (auth.currentUser) {
      this.userLoggedIn = true;
    }
  },
};
</script>
