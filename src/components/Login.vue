<template>
  <!-- Login Form -->
  <div
    v-if="log_show_alert"
    :class="log_alert_variant"
    class="text-white text-center font-bold p-4 rounded mb-4"
  >
    {{ log_alert_msg }}
  </div>
  <vee-form :validation-schema="schema" @submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        name="email"
        placeholder="Enter Email"
        type="email"
      />
      <span><ErrorMessage class="text-red-600" name="email" /></span>
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        name="password"
        placeholder="Password"
        type="password"
      />
      <span><ErrorMessage class="text-red-600" name="password" /></span>
    </div>
    <button
      :disabled="log_in_submission"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      type="submit"
    >
      Submit
    </button>
  </vee-form>
</template>

<script>
import { mapActions } from "pinia";
import useUserStore from "@/stores/user";

export default {
  name: "Login",
  data() {
    return {
      schema: {
        email: "required|email",
        password: "required|min:9|max:100",
      },
      log_in_submission: false,
      log_show_alert: false,
      log_alert_variant: "bg-500-blue",
      log_alert_msg: "Login in progress",
    };
  },
  methods: {
    ...mapActions(useUserStore, ["authenticate"]),
    async login(values) {
      this.log_in_submission = true;
      this.log_show_alert = true;
      this.log_alert_variant = "bg-500-blue";
      this.log_alert_msg = "Login in progress";

      try {
        await this.authenticate(values);
      } catch (error) {
        this.log_in_submission = false;
        this.log_alert_variant = "bg-red-500";
        this.log_alert_msg = "Please Check your credentials";
      }

      this.log_alert_variant = "bg-green-500";
      this.log_alert_msg = "You are successfully Logged in";
      console.log(values);
      window.location.reload();
    },
  },
};
</script>

<style scoped></style>
