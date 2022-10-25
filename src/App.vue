<template>
  <v-app>
    <v-main>
      <ProfileManager>
        <ProfileLogin v-if="$store.getters.isLogin" />
        <ManagerView v-else />
      </ProfileManager>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ProfileManager from "@/components/ProfileManager.vue";
import ProfileLogin from "@/components/ProfileLogin.vue";
import ManagerView from "@/components/ManagerView.vue";

@Component({
  name: "App",
  components: {
    ProfileManager,
    ProfileLogin,
    ManagerView,
  },
})
export default class App extends Vue {}
</script>
