if (typeof window !== "undefined") {
  window.chrome.extension.onMessage.addListener((request, sender) => {
    if (request.message === "PROFILE_MANAGER_ACTIVATE_ICON") {
      window.chrome.pageAction.show(sender.tab.id);
    }
  });
}
