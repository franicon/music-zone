<template>
  <!-- Registration Form -->
  <div
    v-if="reg_show_alert"
    :class="reg_alert_variant"
    class="text-white text-center font-bold p-4 rounded mb-4"
  >
    {{ reg_alert_msg }}
  </div>
  <vee-form
    :initial-values="userData"
    :validation-schema="schema"
    @submit="register"
  >
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <vee-field
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        name="name"
        placeholder="Enter Name"
        type="text"
      />
      <span><ErrorMessage class="text-red-600" name="name" /></span>
    </div>
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
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <vee-field
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        name="age"
        type="number"
      />
      <span><ErrorMessage class="text-red-600" name="age" /></span>
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field v-slot="{ field, errors }" :bails="false" name="password">
        <input
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          type="password"
          v-bind="field"
        />
        <div v-for="error in errors" :key="error" class="text-red-600">
          {{ error }}
        </div>
      </vee-field>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <vee-field
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        name="confirm_password"
        placeholder="Confirm Password"
        type="password"
      />
      <span><ErrorMessage class="text-red-600" name="confirm_password" /></span>
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <vee-field
        as="select"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        name="country"
      >
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
        <option value="Antarctica">Antarctica</option>
      </vee-field>
      <span><ErrorMessage class="text-red-600" name="country" /></span>
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <vee-field
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
        name="tos"
        type="checkbox"
        value="1"
      />
      <label class="inline-block">Accept terms of service</label>
      <span><ErrorMessage class="text-red-600 block" name="tos" /></span>
    </div>
    <button
      :disabled="reg_in_submission"
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
  name: "Register",
  data() {
    return {
      schema: {
        name: "required|min:3|max:100|alpha_spaces",
        email: "required|email",
        age: "required|min_value:18|max_value:100",
        password: "required|min:9|max:100|not_one_of:password",
        confirm_password: "passwords_mismatch:@password",
        country: "required|country_excluded:Antarctica",
        tos: "tos",
      },
      userData: {
        country: "USA",
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: "bg-500-blue",
      reg_alert_msg: "Please wait! Your account is being created.",
    };
  },
  methods: {
    ...mapActions(useUserStore, {
      createUser: "register",
    }),

    async register(values) {
      this.reg_in_submission = true;
      this.reg_show_alert = true;
      this.reg_alert_variant = "bg-500-blue";
      this.reg_alert_msg = "Please wait! Your account is being created.";

      try {
        await this.createUser(values);
      } catch (error) {
        this.reg_in_submission = false;
        this.reg_alert_variant = "bg-red-500";
        this.reg_alert_msg =
          "An unexpected error occurred Please try again later";
        return;
      }

      this.reg_alert_variant = "bg-green-500";
      this.reg_alert_msg = "Success! Your account has been created.";
      window.location.reload();
    },
  },
};
</script>

<style scoped></style>
