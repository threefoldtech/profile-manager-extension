// import { NetworkEnv } from "grid3_client/dist/es6/index";
import Vue from "vue";
import Vuex from "vuex";
import { v4 } from "uuid";

Vue.use(Vuex);

export interface Profile {
  id: string;
  name: string;
  mnemonics: string;
  ssh: string;
  network: /* NetworkEnv */ string;
  disableSSH: boolean;
}

export interface FullProfile extends Profile {
  twinId: number;
  address: string;
}

export interface ProfilesStore {
  loading: boolean;
  profiles: Profile[];
  active: string | null;
}

export function createProfile(options: Partial<Profile> = {}): Profile {
  return {
    id: options.id || v4(),
    name: options.name || "NewProfile",
    mnemonics: options.mnemonics || "",
    network: options.network || /* NetworkEnv.dev */ "dev",
    ssh: options.ssh || "",
    disableSSH: false,
  };
}

export default new Vuex.Store<ProfilesStore>({
  state: {
    loading: false,
    profiles: [createProfile({ id: "primary" })],
    active: null,
  },
  getters: {
    loading: (state) => state.loading,
    profiles: (state) => state.profiles,
    activeProfile: (state) => {
      if (!state.active) return null;

      const twinId = 1;
      const address = "address";
      const profile = state.profiles.find((p) => p.id === state.active);
      return {
        ...profile,
        twinId,
        address,
      } as FullProfile;
    },
  },
  mutations: {},
  actions: {
    addProfile({ state }) {
      state.profiles.push(createProfile());
    },
    removeProfile({ state }, id: string) {
      state.profiles = state.profiles.filter((profile) => profile.id !== id);
      if (state.active === id) {
        state.active = null;
      }
    },
  },
  modules: {},
});
