let translate_text = document.getElementById("translate_text");
let submit_button = document.getElementById("submit");

submit_button.addEventListener("click", function () {
  let translate_code = translate_text.value;
  chrome.storage.local.set({ destination: translate_code });
});
