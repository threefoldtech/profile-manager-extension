/**
 * @typedef { import('../src/config').Commands } Commands
 */

/** @type { Commands } */
const cmds = window.$$cmds;

/**
 *
 * @param { { cmd: string, payload?: any } } message
 * @param { chrome.runtime.MessageSender } sender
 * @param { (response?: any) => void } sendResponse
 */
function handleMessage(message, sender, sendResponse) {
  console.log("[Sender]", sender);

  if (!message && !message.cmd) return;

  switch (message.cmd) {
    case cmds.Keys:
      console.log(message);
      break;

    default:
      console.log("Unhandled", message);
      break;
  }
}

window.chrome.runtime.onMessage.addListener(handleMessage);
