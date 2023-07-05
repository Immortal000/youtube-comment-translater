const observerConfig = { childList: true, subtree: true };
const commentsObserver = new MutationObserver((e) => {
  for (let mut of e) {
    if (mut.target.id == "contents") {
      for (let node of mut.addedNodes) {
        console.log(node);
      }
    }
  }
});

commentsObserver.observe(document, observerConfig);
