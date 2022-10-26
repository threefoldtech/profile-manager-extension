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

import sendMessage from "@/utils/send_message";
import { ProfilesStore } from "./store";

@Component({
  name: "App",
  components: {
    ProfileManager,
    ProfileLogin,
    ManagerView,
  },
})
export default class App extends Vue {
  async created(): Promise<void> {
    const state = await sendMessage<ProfilesStore>({ cmd: "GetState" });

    if (state) {
      this.$store.dispatch("initState", state);
    } else {
      await sendMessage<boolean>({ cmd: "SetState", payload: this.$store.state });
    }

    this.$store.subscribe(async (_, newState) => {
      await sendMessage<boolean>({ cmd: "SetState", payload: newState });
    });

    return undefined;
  }
}
</script>
