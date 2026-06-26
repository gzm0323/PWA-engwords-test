/**
 * 首页：用本地学习记录渲染「积累」进度。
 * 复用 QuizStorage（已掌握 / 难词库）与 words 词库总数。
 */
(function () {
  function pairCount() {
    return typeof words !== "undefined" && words.length
      ? Math.floor(words.length / 2)
      : 0;
  }

  function render() {
    var statsEl = document.getElementById("home-progress-stats");
    var fillEl = document.getElementById("home-progress-fill");
    var trackEl = fillEl ? fillEl.parentNode : null;
    if (!statsEl) return;

    var mastered = 0;
    var needle = 0;
    if (window.QuizStorage) {
      mastered = (QuizStorage.getMasteredIndices() || []).length;
      needle = (QuizStorage.getNeedleIndices() || []).length;
    }
    var total = pairCount();

    if (mastered === 0 && needle === 0) {
      statsEl.textContent = "还没有记录，从一个模块开始吧。";
    } else {
      statsEl.textContent =
        "已掌握 " +
        mastered +
        " · 难词库 " +
        needle +
        (total ? " · 共 " + total + " 词" : "");
    }

    var pct = total > 0 ? Math.max(0, Math.min(100, Math.round((mastered / total) * 100))) : 0;
    if (fillEl) fillEl.style.width = pct + "%";
    if (trackEl && trackEl.setAttribute) {
      trackEl.setAttribute("aria-valuemin", "0");
      trackEl.setAttribute("aria-valuemax", "100");
      trackEl.setAttribute("aria-valuenow", String(pct));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
