import store from "./store";

window.profileManager = store;
type _Commands = "Keys";
export type Commands = {
  [K in _Commands]: string;
};
