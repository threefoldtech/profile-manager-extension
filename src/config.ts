type _Commands = "GetState" | "SetState" | "CheckSecret" | "SaveState" | "LoadState";
export type Commands = {
  [K in _Commands]: string;
};
