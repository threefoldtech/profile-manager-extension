chrome.runtime.onInstalled.addListener(() => {
  chrome.action.disable();

  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostPrefix: "play", hostSuffix: "grid.tf" },
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostPrefix: "dashboard", hostSuffix: "grid.tf" },
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostContains: "localhost" },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowAction()],
      },
    ]);
  });
});
