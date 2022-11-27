




chrome.webNavigation.onCompleted.addListener(function (tab) {
  console.log("entered background script, dom loaded");
  
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.tabId, allFrames: true },
      files: ["content_script.js"],
    },

    function (result) {

      result = result[0].result;
      console.log(result)

    }
  );
});
