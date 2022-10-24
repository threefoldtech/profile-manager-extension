<template>
  <section>
    <v-tabs centered v-model="tab">
      <v-tab v-for="(profile, index) in profiles" :key="profile.id">
        {{ profile.name ? profile.name : `Profile ${index}` }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab" class="mt-5">
      <v-tab-item v-for="profile in profiles" :key="profile.id">
        <ProfileView :profile="profile" />
      </v-tab-item>
    </v-tabs-items>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ProfileView from "@/components/ProfileView.vue";
import { Profile } from "@/store";

@Component({
  name: "ManagerView",
  components: {
    ProfileView,
  },
})
export default class ManagerView extends Vue {
  tab = 0;

  get profiles(): Profile[] {
    return this.$store.getters.profiles;
  }
}
</script>
