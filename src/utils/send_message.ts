import { Commands } from "@/config";

interface Message {
  cmd: keyof Commands;
  payload?: unknown;
}

export default function sendMessage<T>(message: Message) {
  return new Promise<T>((res) => {
    window.chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab || !tab.id) return;

      chrome.tabs.sendMessage(
        tab.id,
        { cmd: window.$$cmds[message.cmd], payload: message.payload },
        res,
      );
    });
  });
}
