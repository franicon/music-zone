import {
  configure,
  defineRule,
  ErrorMessage,
  Field as VeeField,
  Form as VeeForm,
} from "vee-validate";
import {
  alpha_spaces as alphaSpaces,
  confirmed,
  email,
  max,
  max_value as maxVal,
  min,
  min_value as minVal,
  not_one_of as excluded,
  required,
} from "@vee-validate/rules";

export default {
  install(app) {
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
    app.component("ErrorMessage", ErrorMessage);

    defineRule("tos", required);
    defineRule("min", min);
    defineRule("max", max);
    defineRule("email", email);
    defineRule("required", required);
    defineRule("min_value", minVal);
    defineRule("max_value", maxVal);
    defineRule("not_one_of", excluded);
    defineRule("alpha_spaces", alphaSpaces);
    defineRule("country_excluded", excluded);
    defineRule("passwords_mismatch", confirmed);

    configure({
      generateMessage: (ctx) => {
        const messages = {
          tos: `You must accept terms of service`,
          min: `The field ${ctx.field} is too short.`,
          max: `The field ${ctx.field} is too long.`,
          email: `The field ${ctx.field} must be a valid email`,
          required: `The field ${ctx.field} is required.`,
          min_value: `The field ${ctx.field} is too low`,
          max_value: `The field ${ctx.field} is too high`,
          not_one_of: `You are not allowed to use this value for the field ${ctx.field}`,
          alpha_spaces: `The field ${ctx.field} can only contain Alphabetical Character and spaces.`,
          country_excluded: `Due to restrictions, we do not allow user from this location`,
          passwords_mismatch: `The password don't match`,
        };
        return messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : `The field ${ctx.field} is invalid`;
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true,
    });
  },
};
