<template>
  <section>
    <v-tabs centered v-model="tab" @change="resetError">
      <v-tab v-for="tab in ['Activate Profile Manager', 'Create Profile Manager']" :key="tab">
        {{ tab }}
      </v-tab>
    </v-tabs>

    <v-form v-model="valid" @submit.prevent="onLogin">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-bind="attrs"
            v-on="on"
            label="Password"
            placeholder="Profile Manager Password"
            :rules="[
              required('Password is required.'),
              minLength(2, 'Password minLength is 2 chars.'),
              maxLength(16, 'Password maxLength is 16 chars.'),
            ]"
            ref="input"
            :error-messages="error"
            :type="show ? 'text' : 'password'"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show = !show"
            v-model="$store.state.secret"
            @change="resetError"
          ></v-text-field>
        </template>
        <span>
          {{
            tab === 0
              ? "Password to activate a previously configured profile manager"
              : "Password will be used to encrypt data in the browser"
          }}</span
        >
      </v-tooltip>

      <div class="d-flex mt-3">
        <v-spacer />
        <v-btn color="primary" depressed type="submit" :disabled="!valid">
          {{ tab === 0 ? "Load Profiles" : "Create New Profile Manager" }}
        </v-btn>
        <v-spacer />
      </div>
    </v-form>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { required, minLength, maxLength } from "@/utils/validators";
import sendMessage from "@/utils/send_message";

@Component({
  name: "ProfileLogin",
  methods: {
    required,
    minLength,
    maxLength,
  },
})
export default class ProfileLogin extends Vue {
  tab = 0;

  show = false;

  valid = false;

  error: string | null = null;

  resetError(): void {
    if (this.error) {
      this.error = null;
    }
  }

  mounted() {
    const input = this.$refs.input as unknown as { focus(): void };
    input.focus();
  }

  async onLogin() {
    const checkSecret = await sendMessage<boolean>({
      cmd: "CheckSecret",
      payload: this.$store.state.secret,
    });

    if (checkSecret) {
      if (this.tab === 0) {
        this.$store.dispatch("setLogin", false);
      } else {
        this.error = "Password already exists.";
      }
      return;
    }

    if (this.tab === 0) {
      this.error = "Password is not correct.";
    } else {
      await sendMessage({
        cmd: "CreateSecret",
        payload: { secret: this.$store.state.secret, profiles: this.$store.getters.profiles },
      });
      this.$store.dispatch("setLogin", false);
    }
  }
}
</script>
