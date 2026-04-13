/**
 * 随机选择词库中的单词，并通过免费字典 API (Free Dictionary API) 
 * 获取包含该词的真实、符合语法的英语例句。
 */
function trimEnglishLemma(en) {
  return String(en == null ? "" : en).replace(/\s+/g, " ").trim();
}

function collectValidIndices() {
  var pairCount = words.length / 2;
  var valid = [];
  var i;
  for (i = 0; i < pairCount; i++) {
    var raw = words[i * 2];
    if (typeof WordPolicy !== "undefined" && WordPolicy.isBlocked) {
      if (WordPolicy.isBlocked(raw)) continue;
    }
    // 过滤掉多词词组，只保留单字以提高查词成功率
    var lemma = trimEnglishLemma(raw);
    if (!lemma || lemma.indexOf(" ") !== -1) continue;
    valid.push(i);
  }
  if (valid.length === 0) {
    for (i = 0; i < pairCount; i++) {
      if (trimEnglishLemma(words[i * 2])) valid.push(i);
    }
  }
  return valid;
}

function getRandomWordData() {
  var valid = collectValidIndices();
  var idx = valid[Math.floor(Math.random() * valid.length)];
  var en = trimEnglishLemma(words[idx * 2]);
  var zh = String(words[idx * 2 + 1] == null ? "" : words[idx * 2 + 1]).trim();
  return { en: en, zh: zh };
}

async function fetchExampleSentence(word) {
  try {
    const res = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(word));
    if (!res.ok) return null;
    const data = await res.json();
    
    // 收集所有例句
    let examples = [];
    for (let entry of data) {
      if (entry.meanings) {
        for (let meaning of entry.meanings) {
          if (meaning.definitions) {
            for (let def of meaning.definitions) {
              if (def.example) {
                examples.push(def.example);
              }
            }
          }
        }
      }
    }
    if (examples.length > 0) {
      // 随机选一个例句
      return examples[Math.floor(Math.random() * examples.length)];
    }
  } catch (e) {
    console.error("API error:", e);
  }
  return null;
}

async function buildRandomSentence() {
  // 尝试最多 10 次获取真实例句
  for (let i = 0; i < 10; i++) {
    let wordData = getRandomWordData();
    let example = await fetchExampleSentence(wordData.en);
    if (example) {
      // 首字母大写
      example = example.charAt(0).toUpperCase() + example.slice(1);
      if (!/[.!?]$/.test(example)) example += "."; // 补充标点
      
      return {
        en: example,
        gloss: "【" + wordData.en + "】 → " + wordData.zh
      };
    }
  }
  
  // 如果 API 失败多次，回退到一个兜底的通用真实例句模板
  let wordData = getRandomWordData();
  return {
    en: "Here is a sentence containing the word '" + wordData.en + "'.",
    gloss: "【" + wordData.en + "】 → " + wordData.zh
  };
}

function setLoadingState(isLoading) {
  var btn = $("#btn-new-sentence");
  if (isLoading) {
    btn.prop("disabled", true);
    btn.text("加载中...");
    $("#sentence-en").text("Fetching a real sentence from dictionary...");
    $("#sentence-gloss").hide();
    $("#sentence-translation").hide();
    $("#btn-toggle-gloss").hide();
    $("#btn-toggle-translation").hide();
  } else {
    btn.prop("disabled", false);
    btn.text("再来一句");
    $("#btn-toggle-gloss").show();
    $("#btn-toggle-translation").show();
  }
}

async function fetchTranslation(text) {
  try {
    const url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=" + encodeURIComponent(text);
    const res = await fetch(url);
    if (!res.ok) return "翻译获取失败，请稍后再试。";
    const data = await res.json();
    let translation = "";
    if (data && data[0]) {
      for (let i = 0; i < data[0].length; i++) {
        translation += data[0][i][0];
      }
    }
    return translation || "无法获取翻译。";
  } catch (e) {
    console.error("Translation API error:", e);
    return "翻译请求出错。";
  }
}

async function renderSentence() {
  setLoadingState(true);
  var data = await buildRandomSentence();
  $("#sentence-en").text(data.en);
  $("#sentence-gloss").text(data.gloss);
  $("#sentence-gloss").hide();
  
  $("#sentence-translation").text("正在翻译...");
  $("#sentence-translation").hide();

  $("#btn-toggle-gloss info").attr("text", "no");
  $("#btn-toggle-gloss info").text("单词释义");
  
  $("#btn-toggle-translation info").attr("text", "no");
  $("#btn-toggle-translation info").text("句子翻译");

  setLoadingState(false);
  
  fetchTranslation(data.en).then(zh => {
    $("#sentence-translation").text("【翻译】" + zh);
  });
}

function toggleGloss() {
  var info = $("#btn-toggle-gloss info").attr("text");
  if (info === "no") {
    $("#sentence-gloss").slideDown(150);
    $("#btn-toggle-gloss info").attr("text", "yes");
    $("#btn-toggle-gloss info").text("隐藏释义");
  } else {
    $("#sentence-gloss").slideUp(150);
    $("#btn-toggle-gloss info").attr("text", "no");
    $("#btn-toggle-gloss info").text("单词释义");
  }
}

function toggleTranslation() {
  var info = $("#btn-toggle-translation info").attr("text");
  if (info === "no") {
    $("#sentence-translation").slideDown(150);
    $("#btn-toggle-translation info").attr("text", "yes");
    $("#btn-toggle-translation info").text("隐藏翻译");
  } else {
    $("#sentence-translation").slideUp(150);
    $("#btn-toggle-translation info").attr("text", "no");
    $("#btn-toggle-translation info").text("句子翻译");
  }
}

$(function () {
  renderSentence();
  $("#btn-new-sentence").on("click", function () {
    renderSentence();
  });
  $("#btn-toggle-gloss").on("click", function () {
    toggleGloss();
  });
  $("#btn-toggle-translation").on("click", function () {
    toggleTranslation();
  });
});
