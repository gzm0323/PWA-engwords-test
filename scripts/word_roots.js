/**
 * 水滴石穿：按字母顺序学习常见拉丁/希腊词根与高频前缀，
 * 每条含讲解、例词及英例句与中文翻译（例词多选自初中英语常见词汇）。
 */
var WORD_ROOTS_RAW = [
  {
    root: "act",
    origin: "拉丁语",
    meaning: "做，行动，扮演",
    explain:
      "与“行动、活动、表演”相关。初中阶段常见 action、active、actor 等词都含有这一概念，记住它有助于一串词一起记。",
    items: [
      {
        word: "action",
        gloss: "行动；活动",
        sentenceEn: "We must take action now.",
        sentenceZh: "我们现在必须采取行动。"
      },
      {
        word: "active",
        gloss: "积极的；活跃的",
        sentenceEn: "She leads an active life.",
        sentenceZh: "她过着积极活跃的生活。"
      }
    ]
  },
  {
    root: "aud",
    origin: "拉丁语",
    meaning: "听",
    explain:
      "与“听、听觉”有关。audio、audience 等词在课内外阅读里经常出现，可联系“耳朵”来记。",
    items: [
      {
        word: "audio",
        gloss: "音频的；声音的",
        sentenceEn: "Please check the audio settings.",
        sentenceZh: "请检查一下音频设置。"
      },
      {
        word: "audience",
        gloss: "观众；听众",
        sentenceEn: "The audience clapped loudly.",
        sentenceZh: "观众大声鼓掌。"
      }
    ]
  },
  {
    root: "bio",
    origin: "希腊语",
    meaning: "生命",
    explain:
      "出现在 biology、biography 等词中，表示与“生命、生物、生平”相关，科学类阅读里很常见。",
    items: [
      {
        word: "biology",
        gloss: "生物学",
        sentenceEn: "Biology is my favorite subject.",
        sentenceZh: "生物学是我最喜欢的科目。"
      },
      {
        word: "biography",
        gloss: "传记",
        sentenceEn: "I read a biography about her.",
        sentenceZh: "我读了一本关于她的传记。"
      }
    ]
  },
  {
    root: "cap",
    origin: "拉丁语",
    meaning: "拿，取；头",
    explain:
      "可作“抓住、容纳”，也可联想 capital（首都；大写）与“头、首要”有关。",
    items: [
      {
        word: "capture",
        gloss: "捕获；夺得",
        sentenceEn: "The photo captured the moment.",
        sentenceZh: "这张照片捕捉了那一刻。"
      },
      {
        word: "capital",
        gloss: "首都；大写字母；资本",
        sentenceEn: "Beijing is the capital of China.",
        sentenceZh: "北京是中国的首都。"
      }
    ]
  },
  {
    root: "cess",
    origin: "拉丁语",
    meaning: "行走，前进",
    explain:
      "与 ceed 同源，表示“走、进行”。success、process 等都含有“向前推进”的意味。",
    items: [
      {
        word: "success",
        gloss: "成功",
        sentenceEn: "Hard work leads to success.",
        sentenceZh: "努力会带来成功。"
      },
      {
        word: "process",
        gloss: "过程；处理",
        sentenceEn: "Learning is a slow process.",
        sentenceZh: "学习是一个缓慢的过程。"
      }
    ]
  },
  {
    root: "cept",
    origin: "拉丁语",
    meaning: "拿，取",
    explain:
      "与 cap 相关。accept 表示“收下、接受”，except 表示“拿到一边”，即“除……之外”。",
    items: [
      {
        word: "accept",
        gloss: "接受",
        sentenceEn: "I accept your advice.",
        sentenceZh: "我接受你的建议。"
      },
      {
        word: "except",
        gloss: "除……之外",
        sentenceEn: "Everyone came except Tom.",
        sentenceZh: "除了汤姆大家都来了。"
      }
    ]
  },
  {
    root: "com-",
    origin: "拉丁语前缀",
    meaning: "共同，一起；加强语气",
    explain:
      "在 b、m、p 前常写作 com-。表示“一起”时，可联想 combine、compare 等词。",
    items: [
      {
        word: "compare",
        gloss: "比较",
        sentenceEn: "Compare the two answers.",
        sentenceZh: "比较这两个答案。"
      },
      {
        word: "complete",
        gloss: "完成；完整的",
        sentenceEn: "Please complete the exercise.",
        sentenceZh: "请完成这道练习。"
      }
    ]
  },
  {
    root: "dict",
    origin: "拉丁语",
    meaning: "说，讲",
    explain:
      "dictionary 即“关于说法的汇总”。predict 表示“预先说出”，即预测。",
    items: [
      {
        word: "dictionary",
        gloss: "词典",
        sentenceEn: "Look it up in the dictionary.",
        sentenceZh: "在词典里查一下。"
      },
      {
        word: "predict",
        gloss: "预测",
        sentenceEn: "It is hard to predict the weather.",
        sentenceZh: "天气很难预测。"
      }
    ]
  },
  {
    root: "dis-",
    origin: "拉丁语前缀",
    meaning: "分开，否定，相反",
    explain:
      "常表示“不、离开、分开”。dislike、disappear 在初中教材中出现频率较高。",
    items: [
      {
        word: "dislike",
        gloss: "不喜欢",
        sentenceEn: "I dislike being late.",
        sentenceZh: "我不喜欢迟到。"
      },
      {
        word: "disappear",
        gloss: "消失",
        sentenceEn: "The sun disappeared behind the clouds.",
        sentenceZh: "太阳消失在云后面。"
      }
    ]
  },
  {
    root: "duct",
    origin: "拉丁语",
    meaning: "引导，带领",
    explain:
      "conduct 为“引导行为”，即指挥、传导；reduce 有“往回引”，引申为减少。",
    items: [
      {
        word: "conduct",
        gloss: "行为；指挥；传导",
        sentenceEn: "Copper can conduct electricity.",
        sentenceZh: "铜能导电。"
      },
      {
        word: "reduce",
        gloss: "减少",
        sentenceEn: "We should reduce waste.",
        sentenceZh: "我们应该减少浪费。"
      }
    ]
  },
  {
    root: "equ",
    origin: "拉丁语",
    meaning: "相等，均匀",
    explain:
      "equal、equation 都与“相同、平衡”有关，数学与日常用语里都很常见。",
    items: [
      {
        word: "equal",
        gloss: "相等的；平等的",
        sentenceEn: "All people are equal.",
        sentenceZh: "人人平等。"
      },
      {
        word: "equation",
        gloss: "等式；方程式",
        sentenceEn: "Solve this equation, please.",
        sentenceZh: "请解这道方程式。"
      }
    ]
  },
  {
    root: "fect",
    origin: "拉丁语",
    meaning: "做，制作",
    explain:
      "与 fact（事实，已做成的事）同源。affect、perfect 都含有“作用、做到位”的意味。",
    items: [
      {
        word: "affect",
        gloss: "影响",
        sentenceEn: "Smoking affects your health.",
        sentenceZh: "吸烟影响你的健康。"
      },
      {
        word: "perfect",
        gloss: "完美的",
        sentenceEn: "Nobody is perfect.",
        sentenceZh: "没有人是完美的。"
      }
    ]
  },
  {
    root: "fer",
    origin: "拉丁语",
    meaning: "携带，承受",
    explain:
      "different 可理解为“分开带走”，即不同；refer 表示“带回（话题）”，即参考、提及。",
    items: [
      {
        word: "different",
        gloss: "不同的",
        sentenceEn: "We have different ideas.",
        sentenceZh: "我们有不同的想法。"
      },
      {
        word: "refer",
        gloss: "参考；指的是；提到",
        sentenceEn: "Refer to page ten, please.",
        sentenceZh: "请参阅第十页。"
      }
    ]
  },
  {
    root: "form",
    origin: "拉丁语",
    meaning: "形状，形式",
    explain:
      "information 是“形成内容的东西”，即信息；transform 是“改变形状”，即转变。",
    items: [
      {
        word: "information",
        gloss: "信息",
        sentenceEn: "I need more information.",
        sentenceZh: "我需要更多信息。"
      },
      {
        word: "transform",
        gloss: "使改变；转变",
        sentenceEn: "The city has transformed a lot.",
        sentenceZh: "这座城市变化很大。"
      }
    ]
  },
  {
    root: "fort",
    origin: "拉丁语",
    meaning: "强",
    explain:
      "effort 是“使出力量”；comfort 原与“加强、安慰”有关，现多指舒适、安慰。",
    items: [
      {
        word: "effort",
        gloss: "努力",
        sentenceEn: "Success takes effort.",
        sentenceZh: "成功需要努力。"
      },
      {
        word: "comfort",
        gloss: "舒适；安慰",
        sentenceEn: "I find comfort in music.",
        sentenceZh: "我在音乐中找到慰藉。"
      }
    ]
  },
  {
    root: "frag",
    origin: "拉丁语",
    meaning: "破碎",
    explain:
      "fragment 是碎片；fragile 表示易碎，阅读说明文时常见。",
    items: [
      {
        word: "fragment",
        gloss: "碎片；片段",
        sentenceEn: "I only heard a fragment of the talk.",
        sentenceZh: "我只听到了谈话的片段。"
      },
      {
        word: "fragile",
        gloss: "易碎的；脆弱的",
        sentenceEn: "This box is fragile.",
        sentenceZh: "这个箱子易碎。"
      }
    ]
  },
  {
    root: "grad",
    origin: "拉丁语",
    meaning: "步，级",
    explain:
      "grade 为等级、年级；graduate 表示完成一级一级学业，即毕业。",
    items: [
      {
        word: "grade",
        gloss: "年级；成绩等级",
        sentenceEn: "I am in Grade Eight.",
        sentenceZh: "我读八年级。"
      },
      {
        word: "graduate",
        gloss: "毕业",
        sentenceEn: "She will graduate next year.",
        sentenceZh: "她明年毕业。"
      }
    ]
  },
  {
    root: "graph",
    origin: "希腊语",
    meaning: "写，画，记录",
    explain:
      "geography 是“描写土地”；photograph 是“用光画出来”，即照片。",
    items: [
      {
        word: "geography",
        gloss: "地理",
        sentenceEn: "Geography class is interesting.",
        sentenceZh: "地理课很有趣。"
      },
      {
        word: "photograph",
        gloss: "照片",
        sentenceEn: "May I take a photograph here?",
        sentenceZh: "我可以在这里拍照吗？"
      }
    ]
  },
  {
    root: "inter-",
    origin: "拉丁语前缀",
    meaning: "在……之间；相互",
    explain:
      "internet 是“网与网之间”；international 是“国家之间”，即国际的。",
    items: [
      {
        word: "international",
        gloss: "国际的",
        sentenceEn: "English is an international language.",
        sentenceZh: "英语是国际语言。"
      },
      {
        word: "interview",
        gloss: "采访；面试",
        sentenceEn: "I have a job interview tomorrow.",
        sentenceZh: "我明天有一个工作面试。"
      }
    ]
  },
  {
    root: "ject",
    origin: "拉丁语",
    meaning: "投，掷",
    explain:
      "project 本义可联想“向前投出”；reject 是“扔回”，即拒绝。",
    items: [
      {
        word: "project",
        gloss: "项目；课题",
        sentenceEn: "We finished our science project.",
        sentenceZh: "我们完成了科学课题。"
      },
      {
        word: "reject",
        gloss: "拒绝",
        sentenceEn: "They rejected my suggestion.",
        sentenceZh: "他们拒绝了我的建议。"
      }
    ]
  },
  {
    root: "lect",
    origin: "拉丁语",
    meaning: "选，读",
    explain:
      "collect 是“选在一起”，即收集；lecture 与“读出来给大家听”有关，即讲课。",
    items: [
      {
        word: "collect",
        gloss: "收集",
        sentenceEn: "I like to collect stamps.",
        sentenceZh: "我喜欢集邮。"
      },
      {
        word: "lecture",
        gloss: "讲座；讲课",
        sentenceEn: "The lecture starts at nine.",
        sentenceZh: "讲座九点开始。"
      }
    ]
  },
  {
    root: "loc",
    origin: "拉丁语",
    meaning: "地方，位置",
    explain:
      "local 表示当地的；locate 表示确定位置，与地点话题紧密相关。",
    items: [
      {
        word: "local",
        gloss: "当地的；本地的",
        sentenceEn: "We visited a local museum.",
        sentenceZh: "我们参观了一家当地博物馆。"
      },
      {
        word: "locate",
        gloss: "找出……的位置；位于",
        sentenceEn: "The school is located in the east.",
        sentenceZh: "学校位于东部。"
      }
    ]
  },
  {
    root: "log",
    origin: "希腊语",
    meaning: "词，学说，研究",
    explain:
      "biology 等以 -logy 结尾的词常表示“某门学科”。dialogue 是“两人之间的言语”。",
    items: [
      {
        word: "dialogue",
        gloss: "对话",
        sentenceEn: "The story has little dialogue.",
        sentenceZh: "这个故事几乎没有对话。"
      },
      {
        word: "technology",
        gloss: "技术",
        sentenceEn: "Modern technology changes fast.",
        sentenceZh: "现代技术变化很快。"
      }
    ]
  },
  {
    root: "miss",
    origin: "拉丁语",
    meaning: "送，放出",
    explain:
      "与 mit 同源。mission 是“被派出去的任务”；admit 是“向里送”，即承认、准许进入。",
    items: [
      {
        word: "mission",
        gloss: "使命；任务",
        sentenceEn: "His mission was to help others.",
        sentenceZh: "他的使命是帮助他人。"
      },
      {
        word: "admit",
        gloss: "承认；准许进入",
        sentenceEn: "He admitted his mistake.",
        sentenceZh: "他承认了自己的错误。"
      }
    ]
  },
  {
    root: "mov",
    origin: "拉丁语",
    meaning: "移动",
    explain:
      "remove 是“移开”；remote 是“移得很远”，即遥远的。",
    items: [
      {
        word: "remove",
        gloss: "移开；去掉",
        sentenceEn: "Please remove your shoes.",
        sentenceZh: "请脱掉鞋子。"
      },
      {
        word: "remote",
        gloss: "遥远的；遥控的",
        sentenceEn: "The village is very remote.",
        sentenceZh: "这个村庄非常偏远。"
      }
    ]
  },
  {
    root: "phon",
    origin: "希腊语",
    meaning: "声音",
    explain:
      "telephone 是“远距离的声音”；symphony 可联想多种声音组合在一起。",
    items: [
      {
        word: "telephone",
        gloss: "电话",
        sentenceEn: "He called me on the telephone.",
        sentenceZh: "他用电话打给我。"
      },
      {
        word: "microphone",
        gloss: "麦克风",
        sentenceEn: "Speak clearly into the microphone.",
        sentenceZh: "对着麦克风说清楚一点。"
      }
    ]
  },
  {
    root: "port",
    origin: "拉丁语",
    meaning: "携带，运输",
    explain:
      "import 是“运进来”；export 是“运出去”。与港口、搬运有关的词常带 port。",
    items: [
      {
        word: "import",
        gloss: "进口；重要性",
        sentenceEn: "The country imports oil.",
        sentenceZh: "这个国家进口石油。"
      },
      {
        word: "transport",
        gloss: "运输",
        sentenceEn: "We need public transport.",
        sentenceZh: "我们需要公共交通。"
      }
    ]
  },
  {
    root: "pos",
    origin: "拉丁语",
    meaning: "放置",
    explain:
      "position 是“放置的位置”；opposite 是“放在对面”，即相反的。",
    items: [
      {
        word: "position",
        gloss: "位置；职位",
        sentenceEn: "What is your position on the team?",
        sentenceZh: "你在队里担任什么位置？"
      },
      {
        word: "opposite",
        gloss: "在对面；相反的",
        sentenceEn: "Our school is opposite the park.",
        sentenceZh: "我们学校在公园对面。"
      }
    ]
  },
  {
    root: "pre-",
    origin: "拉丁语前缀",
    meaning: "在……之前；预先",
    explain:
      "preview 是“提前看”；prepare 是“提前做好”。",
    items: [
      {
        word: "prepare",
        gloss: "准备",
        sentenceEn: "Prepare for the exam, please.",
        sentenceZh: "请为期末考试做准备。"
      },
      {
        word: "preview",
        gloss: "预习；预展",
        sentenceEn: "We previewed the new lesson today.",
        sentenceZh: "我们今天预习了新课。"
      }
    ]
  },
  {
    root: "re-",
    origin: "拉丁语前缀",
    meaning: "再次；回，向后",
    explain:
      "return 是“转回”；review 是“再看一遍”，即复习。",
    items: [
      {
        word: "return",
        gloss: "返回；归还",
        sentenceEn: "I will return the book tomorrow.",
        sentenceZh: "我明天还书。"
      },
      {
        word: "review",
        gloss: "复习；回顾",
        sentenceEn: "Let's review Unit Three.",
        sentenceZh: "我们来复习第三单元。"
      }
    ]
  },
  {
    root: "rupt",
    origin: "拉丁语",
    meaning: "断裂",
    explain:
      "interrupt 是“在中间断开”，即打断；bankrupt 与“账目断裂”有关，即破产。",
    items: [
      {
        word: "interrupt",
        gloss: "打断",
        sentenceEn: "Sorry to interrupt you.",
        sentenceZh: "抱歉打断你一下。"
      },
      {
        word: "corrupt",
        gloss: "腐败的；使腐化",
        sentenceEn: "We must fight corrupt behavior.",
        sentenceZh: "我们必须与腐败行为作斗争。"
      }
    ]
  },
  {
    root: "scrib",
    origin: "拉丁语",
    meaning: "写",
    explain:
      "describe 是“写下来”，即描述；prescription 是医生“写下的”用药说明。",
    items: [
      {
        word: "describe",
        gloss: "描述",
        sentenceEn: "Can you describe the picture?",
        sentenceZh: "你能描述一下这幅图吗？"
      },
      {
        word: "subscribe",
        gloss: "订阅；签署",
        sentenceEn: "I subscribe to a magazine.",
        sentenceZh: "我订阅了一本杂志。"
      }
    ]
  },
  {
    root: "spect",
    origin: "拉丁语",
    meaning: "看",
    explain:
      "inspect 是“往里仔细看”，即检查；respect 原与“回头看、重视”有关。",
    items: [
      {
        word: "respect",
        gloss: "尊敬；尊重",
        sentenceEn: "We should respect our teachers.",
        sentenceZh: "我们应该尊敬老师。"
      },
      {
        word: "expect",
        gloss: "期待；预料",
        sentenceEn: "I expect good news.",
        sentenceZh: "我期待好消息。"
      }
    ]
  },
  {
    root: "struct",
    origin: "拉丁语",
    meaning: "建造",
    explain:
      "structure 是结构；construct 是“堆建起来”，即建造。",
    items: [
      {
        word: "structure",
        gloss: "结构；建筑物",
        sentenceEn: "The bridge has a simple structure.",
        sentenceZh: "这座桥结构简单。"
      },
      {
        word: "construct",
        gloss: "建造；构建",
        sentenceEn: "They will construct a new road.",
        sentenceZh: "他们将修建一条新路。"
      }
    ]
  },
  {
    root: "tain",
    origin: "拉丁语",
    meaning: "握住，保持",
    explain:
      "contain 是“全部握住”，即包含；maintain 是“用手保持住”，即维持。",
    items: [
      {
        word: "contain",
        gloss: "包含；容纳",
        sentenceEn: "The box contains books.",
        sentenceZh: "箱子里装着书。"
      },
      {
        word: "maintain",
        gloss: "维持；保养",
        sentenceEn: "Exercise helps maintain health.",
        sentenceZh: "运动有助于保持健康。"
      }
    ]
  },
  {
    root: "tract",
    origin: "拉丁语",
    meaning: "拉，抽",
    explain:
      "attract 是“拉向自己”，即吸引；tractor 是“拉东西的”，即拖拉机。",
    items: [
      {
        word: "attract",
        gloss: "吸引",
        sentenceEn: "Bright colors attract children.",
        sentenceZh: "鲜艳的颜色吸引孩子。"
      },
      {
        word: "tractor",
        gloss: "拖拉机",
        sentenceEn: "The farmer drives a tractor.",
        sentenceZh: "农夫开着拖拉机。"
      }
    ]
  },
  {
    root: "un-",
    origin: "古英语前缀",
    meaning: "不，相反动作",
    explain:
      "加在形容词前常表示否定，如 unhappy；加在动词前可表示相反动作，如 unlock。",
    items: [
      {
        word: "unhappy",
        gloss: "不开心的",
        sentenceEn: "She felt unhappy yesterday.",
        sentenceZh: "她昨天感到不开心。"
      },
      {
        word: "unlock",
        gloss: "开锁",
        sentenceEn: "Please unlock the door.",
        sentenceZh: "请把门打开锁。"
      }
    ]
  },
  {
    root: "vent",
    origin: "拉丁语",
    meaning: "来",
    explain:
      "adventure 是“来到（新事物）”，即冒险；convention 是大家“来到一起”。",
    items: [
      {
        word: "adventure",
        gloss: "冒险；奇遇",
        sentenceEn: "We had an adventure in the forest.",
        sentenceZh: "我们在森林里经历了一次冒险。"
      },
      {
        word: "invent",
        gloss: "发明",
        sentenceEn: "Who invented the telephone?",
        sentenceZh: "谁发明了电话？"
      }
    ]
  },
  {
    root: "vers",
    origin: "拉丁语",
    meaning: "转",
    explain:
      "conversation 是“来回转话题”，即交谈；universe 可联想“万物转向统一整体”。",
    items: [
      {
        word: "conversation",
        gloss: "谈话",
        sentenceEn: "We had a long conversation.",
        sentenceZh: "我们谈了很久。"
      },
      {
        word: "universe",
        gloss: "宇宙",
        sentenceEn: "The universe is very large.",
        sentenceZh: "宇宙非常大。"
      }
    ]
  },
  {
    root: "vis",
    origin: "拉丁语",
    meaning: "看",
    explain:
      "visible 是“可看见的”；visit 是“去看”。与 vid（如 video）同源。",
    items: [
      {
        word: "visible",
        gloss: "可见的",
        sentenceEn: "The moon is visible tonight.",
        sentenceZh: "今晚能看见月亮。"
      },
      {
        word: "visit",
        gloss: "参观；拜访",
        sentenceEn: "We will visit our grandparents.",
        sentenceZh: "我们要去看望祖父母。"
      }
    ]
  },
  {
    root: "voc",
    origin: "拉丁语",
    meaning: "声音，喊叫",
    explain:
      "vocabulary 是“与词有关的一套说法”；advocate 可联想“为某事发声”。",
    items: [
      {
        word: "vocabulary",
        gloss: "词汇",
        sentenceEn: "Read more to build vocabulary.",
        sentenceZh: "多读书可以积累词汇。"
      },
      {
        word: "advocate",
        gloss: "拥护；提倡",
        sentenceEn: "They advocate saving water.",
        sentenceZh: "他们提倡节约用水。"
      }
    ]
  }
];

function sortWordRoots(list) {
  return list.slice().sort(function (a, b) {
    return a.root.toLowerCase().localeCompare(b.root.toLowerCase(), "en");
  });
}

var WORD_ROOTS_SORTED = sortWordRoots(WORD_ROOTS_RAW);

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderRootAt(index) {
  var total = WORD_ROOTS_SORTED.length;
  if (total === 0) return;
  var i = ((index % total) + total) % total;
  var r = WORD_ROOTS_SORTED[i];
  var html = "";
  html +=
    '<p class="roots-progress" lang="zh-CN">第 ' +
    (i + 1) +
    " / " +
    total +
    " 个词根（按字母顺序）</p>";
  html += '<h2 class="roots-root-title" lang="en">' + escapeHtml(r.root) + "</h2>";
  html +=
    '<p class="roots-meta" lang="zh-CN"><span class="roots-origin">' +
    escapeHtml(r.origin) +
    '</span> · 核心含义：<strong lang="en">' +
    escapeHtml(r.meaning) +
    "</strong></p>";
  html += '<div class="roots-explain" lang="zh-CN">' + escapeHtml(r.explain) + "</div>";
  html += '<ul class="roots-examples" lang="zh-CN">';
  for (var k = 0; k < r.items.length; k++) {
    var it = r.items[k];
    html += '<li class="roots-example-block">';
    html +=
      '<p class="roots-example-word"><span lang="en" class="roots-en">' +
      escapeHtml(it.word) +
      '</span> <span class="roots-gloss">（' +
      escapeHtml(it.gloss) +
      "）</span></p>";
    html +=
      '<p class="roots-example-sentence" lang="en">' +
      escapeHtml(it.sentenceEn) +
      "</p>";
    html +=
      '<p class="roots-example-zh" lang="zh-CN">' +
      escapeHtml(it.sentenceZh) +
      "</p>";
    html += "</li>";
  }
  html += "</ul>";
  $("#roots-display").html(html);
}

$(function () {
  var idx = 0;
  renderRootAt(idx);
  $("#btn-next-root").on("click", function () {
    idx += 1;
    if (idx >= WORD_ROOTS_SORTED.length) idx = 0;
    renderRootAt(idx);
  });
  $("#btn-prev-root").on("click", function () {
    idx -= 1;
    if (idx < 0) idx = WORD_ROOTS_SORTED.length - 1;
    renderRootAt(idx);
  });
});
