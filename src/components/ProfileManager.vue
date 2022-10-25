<template>
  <v-card class="ma-3" width="750">
    <v-card-title class="d-flex">
      <span> Profile Manager </span>
      <v-spacer />
      <v-btn
        class="ml-3"
        v-for="action in actions"
        :key="action.icon"
        :outlined="action.outlined"
        small
        :color="action.color"
        @click="action.fn"
      >
        <v-icon small left> mdi-{{ action.icon }}</v-icon>
        {{ action.label }}
      </v-btn>
    </v-card-title>
    <v-card-subtitle>
      Please visit
      <a
        class="text-decoration-none"
        href="https://library.threefold.me/info/manual/#/manual__weblets_profile_manager"
        target="_blank"
      >
        the manual
      </a>
      to <strong>get started</strong>.
    </v-card-subtitle>

    <v-divider />

    <v-card-text>
      <slot />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "ProfileManager",
})
export default class ProfileManager extends Vue {
  actions = [
    {
      label: "Add Profile",
      icon: "account-plus",
      color: "primary",
      outlined: true,
      fn: () => this.$store.dispatch("addProfile"),
    },
    {
      label: "Deactivate",
      icon: "exit-to-app",
      color: "red",
      outlined: false,
      fn: () => this.$store.dispatch("setLogin", true),
    },
  ];
}
</script>
