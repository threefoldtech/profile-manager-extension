import store from "./store";

window.profileManager = store;
type _Commands = "GetState" | "SetState" | "CheckSecret" | "CreateSecret";
export type Commands = {
  [K in _Commands]: string;
};
