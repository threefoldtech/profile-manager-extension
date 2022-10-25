<template>
  <v-form v-model="valid" @submit.prevent="activateProfile">
    <div class="d-flex">
      <v-spacer />
      <v-btn
        color="primary"
        type="submit"
        :loading="loading"
        :disabled="isActiveProfile || loading || !valid"
      >
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
      :readonly="isActiveProfile || loading"
    ></v-text-field>

    <v-select
      :items="networks"
      item-text="name"
      item-value="value"
      v-model="profile.network"
      label="Select a network"
      :readonly="isActiveProfile || loading"
    />

    <v-text-field
      label="Mnemonics"
      placeholder="Enter Your Polkadot Mnemonics or TFChain secret"
      :type="show ? 'text' : 'password'"
      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append="show = !show"
      v-model="profile.mnemonics"
      ref="mnemonicsInput"
      :rules="[required('Mnemonics is required.'), validateMnemonic]"
      :readonly="isActiveProfile || loading"
    ></v-text-field>

    <template v-if="isActiveProfile">
      <v-text-field label="Twin ID" type="number" readonly :value="activeProfile.twinId" />
      <v-text-field label="Address" readonly :value="activeProfile.address" />
    </template>

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
        :readonly="isActiveProfile || loading"
      ></v-text-field>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on">
            <v-switch
              :readonly="isActiveProfile || loading"
              v-model="profile.disableSSH"
              @change="$refs.ssh.validate()"
            />
          </div>
        </template>
        <span>On disable the deployed solutions'll be inaccessible.</span>
      </v-tooltip>
    </div>
  </v-form>
</template>

<script lang="ts">
// eslint-disable-next-line import/no-unresolved
import { NetworkEnv } from "grid3_client";
import { Component, Prop, Vue } from "vue-property-decorator";
import { Profile, FullProfile } from "@/store";
// eslint-disable-next-line object-curly-newline
import { required, minLength, maxLength, getGrid } from "@/utils/validators";
import { validateMnemonic } from "bip39";

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

  networks = [
    { name: "Mainnet", value: NetworkEnv.main },
    { name: "Testnet", value: NetworkEnv.test },
    { name: "QAnet", value: NetworkEnv.qa },
    { name: "Devnet", value: NetworkEnv.dev },
  ];

  show = false;

  valid = false;

  loading = false;

  get activeProfile(): FullProfile {
    return this.$store.getters.activeProfile;
  }

  get isActiveProfile(): boolean {
    return this.activeProfile?.id === this.profile.id;
  }

  mounted() {
    const input = this.$refs.input as unknown as { focus(): void };
    input.focus();
  }

  async activateProfile() {
    const { id, network, mnemonics } = this.profile;

    try {
      this.loading = true;
      const grid = await getGrid(network, mnemonics);
      this.$store.dispatch("activateProfile", {
        id,
        twinId: await grid.twins.get_my_twin_id(),
        address: grid.twins.client.client.address,
      });
      await grid.disconnect();
      this.loading = false;
    } catch {
      const input = this.$refs.mnemonicsInput as unknown as { validate(): void; focus(): void };
      input.validate();
      input.focus();
      this.loading = false;
    }
  }
}
</script>
