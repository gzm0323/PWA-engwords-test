(() => {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js", { scope: "./" })
      .then((reg) => reg.update?.())
      .catch(() => {
        // ignore: app still works online without SW
      });
  });
})();

