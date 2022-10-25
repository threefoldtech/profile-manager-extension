// eslint-disable-next-line import/no-unresolved
import { NetworkEnv } from "grid3_client";
import Vue from "vue";
import Vuex, { Store } from "vuex";
import { v4 } from "uuid";
import { enc } from "crypto-js";
import md5 from "crypto-js/md5";
import { encrypt, decrypt } from "crypto-js/aes";
import sendMessage from "@/utils/send_message";

Vue.use(Vuex);

export interface Profile {
  id: string;
  name: string;
  mnemonics: string;
  ssh: string;
  network: NetworkEnv;
  disableSSH: boolean;
}

export interface FullProfile extends Profile {
  twinId: number;
  address: string;
  secret: string;
}

interface Active {
  id: string;
  twinId: number;
  address: string;
}

export interface ProfilesStore {
  secret: string;
  profiles: Profile[];
  active: Active | null;
  isLogin: boolean;
}

export function createProfile(options: Partial<Profile> = {}): Profile {
  return {
    id: options.id || v4(),
    name: options.name || "NewProfile",
    mnemonics: options.mnemonics || "",
    network: options.network || NetworkEnv.dev,
    ssh: options.ssh || "",
    disableSSH: false,
  };
}

const store: Store<ProfilesStore> = new Vuex.Store<ProfilesStore>({
  state: {
    secret: "",
    profiles: [createProfile({ id: "primary" })],
    active: null,
    isLogin: true,
  },
  getters: {
    profiles: (state) => state.profiles,
    activeProfile: (state) => {
      if (!state.active) return null;

      const active = state.active as Active;
      const profile = state.profiles.find((p) => p.id === active.id);
      return {
        ...profile,
        twinId: active.twinId,
        address: active.address,
        secret: state.secret,
      } as FullProfile;
    },
    isLogin: (state) => state.isLogin,
    encryptedSecret: (state) => md5(state.secret).toString(),
    encryptedData(state) {
      // prettier-ignore
      return {
        secret: store.getters.encryptedSecret,
        store: encrypt(
          JSON.stringify({ profiles: state.profiles, active: state.active }),
          store.getters.encryptedSecret,
        ).toString(),
      };
    },
  },
  mutations: {
    ADD_PROFILE(state) {
      state.profiles.push(createProfile());
    },
    REMOVE_PROFILE(state, id: string) {
      state.profiles = state.profiles.filter((profile) => profile.id !== id);
      if (state.active?.id === id) {
        state.active = null;
      }
    },
    ACTIVATE_PROFILE(state, payload: Active | null) {
      state.active = payload;
    },
    SET_LOGIN(state, isLogin: boolean) {
      state.isLogin = isLogin;
      state.active = null;
    },
  },
  actions: {
    initState({ state, commit }, payload: ProfilesStore) {
      commit("SET_LOGIN", payload.isLogin);
      state.active = payload.active;
      state.profiles = payload.profiles;
      state.secret = payload.secret;
    },
    async addProfile({ commit }) {
      commit("ADD_PROFILE");
      // eslint-disable-next-line no-use-before-define
      await saveState();
    },
    async removeProfile({ commit }, id: string) {
      commit("REMOVE_PROFILE", id);
      // eslint-disable-next-line no-use-before-define
      await saveState();
    },
    async activateProfile({ commit }, payload: Active | null) {
      commit("ACTIVATE_PROFILE", payload);
      // eslint-disable-next-line no-use-before-define
      await saveState();
    },
    setLogin({ commit }, isLogin: boolean) {
      commit("SET_LOGIN", isLogin);
    },
    loadStore({ state }, loadedStore: string) {
      const data = decrypt(loadedStore, store.getters.encryptedSecret).toString(enc.Utf8);
      const { profiles, active } = JSON.parse(data);
      state.active = active;
      state.profiles = profiles;
    },
  },
});

export function saveState() {
  return sendMessage({ cmd: "SaveState", payload: store.getters.encryptedData });
}

export default store;
