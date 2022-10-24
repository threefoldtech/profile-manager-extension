<template>
  <v-form v-model="valid" @submit.prevent="activateProfile">
    <div class="d-flex">
      <v-spacer />
      <v-btn color="primary" :disabled="isActiveProfile || !valid">
        {{ isActiveProfile ? "Active" : "Activate" }}
      </v-btn>
    </div>

    <v-text-field
      label="Profile Name"
      placeholder="Profile Name"
      ref="input"
      :rules="[
        required('Profile Name is required.'),
        minLength(2, 'Profile Name minLength is 2 chars.'),
        maxLength(15, 'Profile Name maxLength is 15 chars.'),
      ]"
      v-model="profile.name"
    ></v-text-field>

    <v-text-field
      label="Mnemonics"
      placeholder="Enter Your Polkadot Mnemonics or TFChain secret"
      :type="show ? 'text' : 'password'"
      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append="show = !show"
      v-model="profile.mnemonics"
      :rules="[required('Mnemonics is required.'), validateMnemonic]"
    ></v-text-field>

    <div class="d-flex pr-1">
      <v-text-field
        class="mr-3"
        label="Public SSH Key"
        placeholder="Your public SSH key will be added as default to all deployments."
        v-model="profile.ssh"
        ref="ssh"
        :disabled="profile.disableSSH"
        :rules="[
          (value) => {
            if (profile.disableSSH) return true;
            return required('Public SSH Key is requried.')(value);
          },
        ]"
      ></v-text-field>

      <v-switch v-model="profile.disableSSH" @change="$refs.ssh.validate()" />
    </div>
  </v-form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Profile, FullProfile } from "@/store";
import { required, minLength, maxLength } from "@/utils/validators";
import { validateMnemonic, mnemonicToEntropy } from "bip39";

console.log({ validateMnemonic, mnemonicToEntropy });

@Component({
  name: "ProfileView",
  methods: {
    required,
    minLength,
    maxLength,
    validateMnemonic(value) {
      return validateMnemonic(value) ? true : "Mnemonics doesn't seem to be valid.";
    },
  },
})
export default class ProfileView extends Vue {
  @Prop({ required: true }) profile!: Profile;

  show = false;

  valid = false;

  get activeProfile(): FullProfile {
    return this.$store.getters.activeProfile;
  }

  get isActiveProfile(): boolean {
    return this.activeProfile?.id === this.profile.id;
  }

  mounted() {
    (this.$refs.input as any).focus();
  }

  activateProfile() {
    console.log("activating", this.profile);
  }
}
</script>
