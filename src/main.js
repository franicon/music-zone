import { createApp } from "vue";
import { createPinia } from "pinia";
import { auth } from "./includes/firbase";
import VeeValidatePlugIn from "./includes/validation";

import App from "./App.vue";
import router from "./router";

import "./assets/base.css";
import "./assets/main.css";

let app;
auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);

    app.use(createPinia());
    app.use(router);
    app.use(VeeValidatePlugIn);

    app.mount("#app");
  }
});
