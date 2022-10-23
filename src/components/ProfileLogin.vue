<template>
  <section>
    <v-tabs centered v-model="tab">
      <v-tab v-for="tab in tabs" :key="tab">
        {{ tab }}
      </v-tab>
    </v-tabs>

    <v-form ref="form" @submit.prevent="onLogin">
      <v-text-field
        label="Password"
        placeholder="Profile Manager Password"
        :rules="[() => false]"
      ></v-text-field>
    </v-form>
    <!-- <v-tabs-items v-model="tab">
      <v-tab-item v-for="tab in tabs" :key="tab">
        <v-card>
          <v-card-text>{{ tab }}</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items> -->
  </section>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

@Component({
  name: "ProfileLogin",
})
export default class ProfileLogin extends Vue {
  tabs = ["Activate Profile Manager", "Create Profile Manager"];

  tab = 0;

  mounted() {
    console.log(this.$refs.form);

    (this.$refs.form as any).validate();
  }

  onLogin() {
    console.log("test", this);
  }
}
</script>
