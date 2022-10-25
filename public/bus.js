const VERSION = "v0.0.1-alpha";

/**
 * @typedef { import('../src/config').Commands } Commands
 */

/** @type { Commands } */
const cmds = window.$$cmds;
const _ = "PROFILE_MANAGER_";

const SessionKeys = {
  State: `${_}STATE`,
};
const Session = {
  /**
   *
   * @param { keyof typeof SessionKeys } key
   * @returns { any }
   */
  get(key) {
    const value = window.sessionStorage.getItem(SessionKeys[key]);
    if (value === null) return null;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  },

  /**
   *
   * @param { keyof typeof SessionKeys } key
   * @param { any } value
   * @returns { void }
   */
  set(key, value) {
    return window.sessionStorage.setItem(SessionKeys[key], JSON.stringify(value));
  },
};

// prettier-ignore
function notify(activeProfile) {
  document.dispatchEvent(
    new CustomEvent("PROFILE_MANAGER_ACTIVE_PROFILE", {
      detail: activeProfile,
      composed: true,
      bubbles: true,
    }),
  );
}

function getActiveProfile(state) {
  const { active } = state;
  const profile = state.profiles.find((p) => p.id === active.id);
  return {
    ...profile,
    twinId: active.twinId,
    address: active.address,
    secret: state.secret,
  };
}

/**
 *
 * @param { { cmd: string, payload?: any } } message
 * @param { chrome.runtime.MessageSender } sender
 * @param { (response?: any) => void } sendResponse
 */
function handleMessage(message, _sender, sendResponse) {
  if (!message && !message.cmd) return;

  switch (message.cmd) {
    case cmds.GetState: {
      const state = Session.get("State");
      sendResponse(state);
      if (state && state.active) {
        notify(getActiveProfile(state));
      }
      break;
    }

    case cmds.SetState: {
      const state = message.payload;
      if (!state || !state.active) {
        notify(null);
      } else {
        notify(getActiveProfile(state));
      }

      Session.set("State", state);
      sendResponse(true);
      break;
    }

    case cmds.CheckSecret: {
      const secret = message.payload;
      const data = localStorage.getItem(`${VERSION}.${secret}`);
      sendResponse(!!data);
      break;
    }

    case cmds.SaveState: {
      const { secret, store } = message.payload;
      localStorage.setItem(`${VERSION}.${secret}`, store);
      sendResponse(true);
      break;
    }

    case cmds.LoadState: {
      const secret = message.payload;
      const store = localStorage.getItem(`${VERSION}.${secret}`);
      sendResponse(store);
      break;
    }

    default:
      console.log("Unhandled", message);
      break;
  }
}

function init() {
  const state = Session.get("State");
  if (state && state.active) {
    notify(getActiveProfile(state));
  }
}

window.addEventListener("load", init, { once: true });
window.chrome.runtime.onMessage.addListener(handleMessage);
