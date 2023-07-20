const observerConfig = { childList: true, subtree: true };
let translation_code;

const getTranslationLanguageCode = async () => {
  const storage = await chrome.storage.local.get();
  translation_code = storage.destination;
};

getTranslationLanguageCode();

chrome.runtime.onMessage.addListener((obj, sender, response) => {
  const { type, value, videoId } = obj;

  if (type === "NEW") {
    commentsObserver.observe(document, observerConfig);
  }
});

const commentsObserver = new MutationObserver((e) => {
  for (let mut of e) {
    if (mut.target.id == "contents") {
      const commentNodes = document.querySelectorAll("ytd-comment-thread-renderer");
      for (let node of commentNodes) {
        addTranslateButton(node);
      }
    }
  }
});

const addTranslateButton = (commentNode) => {
  // add a translate button/text to the comment node
  const commentText = commentNode.querySelector("#toolbar");

  if (commentNode.querySelector("#translate_text_button") == null) {
    let translate_text_button = document.createElement("button");
    translate_text_button.innerText = "Translate";
    translate_text_button.id = "translate_text_button";

    translate_text_button.setAttribute("translate", "no");

    commentText.appendChild(translate_text_button);

    translate_text_button.addEventListener("click", () => {
      let comment_text = commentNode.querySelector("#content-text").innerText;

      translated_text = "";

      if (translate_text_button.getAttribute("translate") == "no") {
        translate_text_button.setAttribute("data-original", comment_text);
        translate_text_button.setAttribute("translate", "yes");
        fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${translation_code}&dt=t&q=${encodeURIComponent(
            comment_text
          )}`
        )
          .then((response) => response.json())
          .then((json) => {
            // for (let i = 0; i < json[0].length; i++) translated_text += json[0][i][0].replace("\n", " ");
            for (let i = 0; i < json[0].length; i++) translated_text += json[0][i][0];
            commentNode.querySelector("#content-text").innerText = translated_text;
          });

        translate_text_button.innerText = "See Original";
      } else {
        commentNode.querySelector("#content-text").innerText = translate_text_button.getAttribute("data-original");
        translate_text_button.setAttribute("translate", "no");
        translate_text_button.innerText = "Translate";
      }
    });
  }
};
