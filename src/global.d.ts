import { Store } from "vuex";
import { ProfilesStore } from "./store";
import type { Commands } from "./config";

declare global {
  interface Window {
    profileManager: Store<ProfilesStore>;
    $$cmds: Commands;
  }
}
