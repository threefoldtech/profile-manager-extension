<template>
  <v-app>
    <v-main>
      <ProfileManager>
        <ProfileLogin />
      </ProfileManager>
      <!-- <v-card class="ma-3">
        <v-card-title> Profile Manager </v-card-title>
        <v-card-subtitle>
          Please visit <a class="text-decoration-none" href="#!" target="_blank">the manual</a> to
          <strong>get started</strong>.
        </v-card-subtitle>
        <v-divider />

        <v-card-text>
          <v-tabs background-color="transparent" color="basil" grow>
            <v-tab v-for="item in [1, 2]" :key="item">
              {{ item }}
            </v-tab>
          </v-tabs>

          <v-tabs-items>
            <v-tab-item v-for="item in [1, 2]" :key="item">
              <v-card color="basil" flat>
                <v-card-text>{{ item }}</v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
      </v-card> -->
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ProfileManager from "@/components/ProfileManager.vue";
import ProfileLogin from "./components/ProfileLogin.vue";

@Component({
  name: "App",
  components: {
    ProfileManager,
    ProfileLogin,
  },
})
export default class App extends Vue {}
</script>
