/**
 * 日积月累：选自初中英语常见实词（名词、动词、形容词等），按字母顺序，
 * 每个词配一段英文小故事与中文翻译（词汇范围贴近“初中英语词汇1600”类词表）。
 */
var WORD_STORIES_RAW = [
  {
    word: "ability",
    pos: "名词",
    storyEn:
      "Ming joined the English club last term. At first he was shy, but the teacher saw his ability to learn quickly. He practiced every day. By the end of the year, he could give a short speech in front of the whole school.",
    storyZh:
      "上学期明加入了英语社团。起初他很害羞，但老师发现他学得快的能力。他每天都练习。到学年末，他已能在全校师生面前做简短演讲。"
  },
  {
    word: "accident",
    pos: "名词",
    storyEn:
      "Yesterday there was a small accident near the crossing. A car stopped too late and hit a bicycle lightly. Nobody was badly hurt. The police reminded everyone to be careful and said most accidents can be avoided.",
    storyZh:
      "昨天路口附近发生了一起小事故。一辆车刹车太晚，轻轻撞到了一辆自行车。没有人重伤。警察提醒大家要小心，并说大多数事故是可以避免的。"
  },
  {
    word: "active",
    pos: "形容词",
    storyEn:
      "Grandma is over seventy, but she is still very active. She walks in the park every morning and joins a dance group twice a week. Her friends say her active life keeps her happy and healthy.",
    storyZh:
      "奶奶七十多岁了，但仍然很活跃。她每天早上在公园散步，每周还参加两次舞蹈队。朋友们说她积极的生活让她又快乐又健康。"
  },
  {
    word: "adventure",
    pos: "名词",
    storyEn:
      "Last summer, Lin and her cousins planned a camping adventure in the mountains. They carried food, tents, and a map. It rained once, but they laughed and cooked under a big tree. It was the best adventure of their holiday.",
    storyZh:
      "去年夏天，琳和表兄妹们计划到山里露营冒险。他们带了食物、帐篷和地图。下过一次雨，但他们笑着在大树下做饭。那是假期里最棒的一次冒险。"
  },
  {
    word: "afraid",
    pos: "形容词",
    storyEn:
      "Little Ben was afraid of speaking in class. One day his teacher asked him to read one sentence only. His voice shook, but the class clapped kindly. Ben smiled and felt less afraid the next time.",
    storyZh:
      "小本害怕在课堂上发言。有一天老师只请他读一个句子。他的声音在发抖，但同学们友善地鼓掌。本笑了，下次就没那么害怕了。"
  },
  {
    word: "airport",
    pos: "名词",
    storyEn:
      "Father's plane landed at ten at night. We arrived at the airport early and watched the screens. When we saw him walk through the gate, we waved and ran to hug him. The airport was noisy but full of joy.",
    storyZh:
      "父亲的航班夜里十点降落。我们早早到了机场盯着屏幕。看到他走出到达口时，我们挥手跑过去拥抱他。机场很吵，却充满喜悦。"
  },
  {
    word: "alone",
    pos: "形容词 / 副词",
    storyEn:
      "After school, the old man often sat alone on the bench. A girl from the neighborhood started to say hello every day. Soon they talked about books and weather. The street felt warmer, and he was not alone anymore.",
    storyZh:
      "放学后，老人常常独自坐在长椅上。邻居家的女孩开始每天向他问好。很快他们聊起了书和天气。街道变得温暖起来，他不再孤单。"
  },
  {
    word: "animal",
    pos: "名词",
    storyEn:
      "Our school trip went to a farm. We fed rabbits and watched cows rest under trees. The guide said every animal needs clean water and kind care. I decided to read more about wild animals when I got home.",
    storyZh:
      "我们学校旅行去了农场。我们喂兔子，看奶牛在树下休息。导游说每种动物都需要干净的水和善待。回家后我决定多读一些关于野生动物的书。"
  },
  {
    word: "answer",
    pos: "名词 / 动词",
    storyEn:
      "The math problem looked difficult. Jia thought for ten minutes and tried a new way. She wrote her answer on the board. The teacher nodded and said sometimes the best answer comes from a second try.",
    storyZh:
      "这道数学题看起来很难。佳想了十分钟，换了一种新方法。她把答案写在黑板上。老师点头说，有时最好的答案来自再试一次。"
  },
  {
    word: "artist",
    pos: "名词",
    storyEn:
      "Uncle Zhou left his office job to become a street artist. He paints quick portraits for tourists. People say his lines are simple but full of life. On weekends he teaches children that anyone can be an artist with practice.",
    storyZh:
      "周叔叔辞去办公室工作，当了街头画家。他给游客画速写肖像。人们说他的线条简洁却充满生命力。周末他教孩子们：只要练习，谁都可以成为艺术家。"
  },
  {
    word: "autumn",
    pos: "名词",
    storyEn:
      "Autumn arrived with cool wind and yellow leaves. We took photos under the old maple tree. Mother made soup with fresh pumpkins. In our city, autumn is short, so we enjoy every sunny afternoon.",
    storyZh:
      "秋天随着凉风与黄叶来了。我们在老枫树下拍照。妈妈用新鲜南瓜煮汤。在我们这座城市，秋天很短，所以我们珍惜每一个晴朗的下午。"
  },
  {
    word: "balance",
    pos: "名词 / 动词",
    storyEn:
      "Yoga class taught Mei how to balance on one foot. At first she fell often, but she did not give up. Slowly she learned that balance is also about a quiet mind. Now she feels calmer before exams.",
    storyZh:
      "瑜伽课教梅如何单脚保持平衡。起初她常常摔倒，但没有放弃。慢慢地她明白，平衡也与内心平静有关。现在她在考试前更冷静了。"
  },
  {
    word: "banana",
    pos: "名词",
    storyEn:
      "Every morning Grandpa eats one banana before his walk. He says it gives him energy without heavy sugar. Sometimes he shares half with the little dog. The banana peel always goes into the bin, never on the road.",
    storyZh:
      "爷爷每天早上散步前吃一根香蕉。他说这能给他能量，又不会糖分太重。有时他分一半给小狗。香蕉皮总是扔进垃圾桶，从不扔在路上。"
  },
  {
    word: "basket",
    pos: "名词",
    storyEn:
      "Mother carried a basket to the market. She chose eggs, green vegetables, and fresh fish. The basket became heavy, so I helped hold one handle. Walking home, we planned a simple dinner together.",
    storyZh:
      "妈妈提着篮子去市场。她选了鸡蛋、青菜和鲜鱼。篮子变重了，我就帮忙拎一边。回家的路上，我们一起计划了一顿简单的晚饭。"
  },
  {
    word: "beauty",
    pos: "名词",
    storyEn:
      "We hiked to a lake at sunrise. The beauty of the pink sky on the water made us silent. A photographer whispered that nature does not need filters. We agreed and put our phones away for a while.",
    storyZh:
      "我们黎明时徒步到湖边。粉霞映在水上的美让我们屏住了呼吸。摄影师低声说大自然不需要滤镜。我们同意，于是暂时收起了手机。"
  },
  {
    word: "bicycle",
    pos: "名词",
    storyEn:
      "Wei saved money for half a year and bought a blue bicycle. He rode to school and helped carry his sister on weekends. Once the chain broke, and a repair shop fixed it in twenty minutes. The bicycle became his good friend.",
    storyZh:
      "伟攒了半年钱买了一辆蓝色自行车。他骑车上学，周末还帮妹妹驮东西。有一次链条断了，修车铺二十分钟就修好了。这辆自行车成了他的好伙伴。"
  },
  {
    word: "birthday",
    pos: "名词",
    storyEn:
      "On Lily's twelfth birthday, her parents hid a small gift under her pillow. She found a diary with her name on the cover. Friends came in the evening with a cake and silly songs. It was a birthday she still remembers.",
    storyZh:
      "莉莉十二岁生日那天，父母把一份小礼物藏在她的枕头下。她发现了一本封面写着自己名字的日记本。晚上朋友们带着蛋糕和搞怪的歌来了。那是她一直记得的一个生日。"
  },
  {
    word: "blanket",
    pos: "名词",
    storyEn:
      "Winter nights are cold in the north. Grandmother knitted a thick blanket with red flowers. She put it on my bed without saying much. When I cover myself with that blanket, I always sleep deeply and feel safe.",
    storyZh:
      "北方的冬夜很冷。奶奶织了一条带红花的厚毯子。她没多说什么就铺在我床上。盖上那条毯子，我总能睡得很沉、很安心。"
  },
  {
    word: "borrow",
    pos: "动词",
    storyEn:
      "Tom forgot his pen before the test. He whispered to his classmate and asked to borrow one for an hour. After the test he returned it with a small candy as thanks. Good friends borrow things and return them on time.",
    storyZh:
      "考试前汤姆忘了带笔。他小声向同学借一支用一小时。考完后他还笔并塞了一颗糖表示感谢。好朋友借东西会按时归还。"
  },
  {
    word: "bottle",
    pos: "名词",
    storyEn:
      "We collected empty plastic bottles along the river bank. Volunteers put them into recycling bags. One child found a bottle with a tiny plant growing inside. We took a photo and called it hope in a bottle.",
    storyZh:
      "我们沿着河岸捡拾空塑料瓶。志愿者把它们装进回收袋。有个孩子发现瓶子里长着一株小植物。我们拍了照，叫它“瓶子里的希望”。"
  },
  {
    word: "brave",
    pos: "形容词",
    storyEn:
      "The fire alarm rang during lunch. Students walked out in lines, but an older boy ran back for a classmate on crutches. Teachers called him brave, but he said anyone would help a friend. Still, we were proud of him.",
    storyZh:
      "午餐时火警响了。学生们排队撤离，但一个高个子男生跑回去搀扶拄拐的同学。老师说他勇敢，他却说谁都会帮朋友。我们仍为他骄傲。"
  },
  {
    word: "bridge",
    pos: "名词",
    storyEn:
      "A new bridge connects our town to the train station. Before, people walked thirty extra minutes. Now bicycles and buses cross the river in two minutes. At night lights on the bridge look like a quiet necklace.",
    storyZh:
      "一座新桥把我们镇和火车站连起来。以前人们要多走三十分钟。现在自行车和公交车两分钟就过河。夜里桥上的灯像一条安静的项链。"
  },
  {
    word: "bright",
    pos: "形容词",
    storyEn:
      "After the rain, the sky turned bright blue. Sunlight filled the classroom and woke sleepy students. Our teacher opened the windows and said a bright morning is a gift. Everyone felt ready to study again.",
    storyZh:
      "雨过天晴，天空变得明亮湛蓝。阳光洒进教室，叫醒了犯困的同学。老师打开窗户说明亮的早晨是一份礼物。大家又觉得有精神读书了。"
  },
  {
    word: "butterfly",
    pos: "名词",
    storyEn:
      "In the garden a yellow butterfly rested on a flower. Children moved closer quietly so it would not fly away. It opened and closed its wings like paper in the wind. For a moment the whole class forgot their phones.",
    storyZh:
      "花园里一只黄蝴蝶停在花上。孩子们悄悄靠近，生怕它飞走。它开合翅膀，像风中的纸片。那一刻全班都忘了看手机。"
  },
  {
    word: "calendar",
    pos: "名词",
    storyEn:
      "Father hung a calendar on the kitchen wall. He circles exam days and family visits in red. My little brother adds stickers on his birthday month. Without that calendar, our busy week would feel like a puzzle.",
    storyZh:
      "爸爸在厨房墙上挂了一本日历。他用红笔圈出考试和探亲的日子。弟弟在自己生日的月份贴贴纸。没有那本日历，我们忙碌的一周会像拼图一样难记。"
  },
  {
    word: "camera",
    pos: "名词",
    storyEn:
      "Aunt brought an old camera to the reunion. It could not send photos to the internet, but the pictures looked warm. We posed with funny faces and waited for the click. Later we laughed at our double chins on paper photos.",
    storyZh:
      "姑姑带了一台旧相机来聚会。它不能上网传图，但照片很温暖。我们摆着滑稽的鬼脸等快门声。后来对着纸质照片里双下巴哈哈大笑。"
  },
  {
    word: "captain",
    pos: "名词",
    storyEn:
      "Our basketball captain hurt his knee last week. Instead of resting alone, he came to every practice and shouted encouragement. The team won a close game on Friday. The coach said a true captain leads with heart, not only with points.",
    storyZh:
      "我们的篮球队长上周膝盖受伤。他没有独自休息，而是每场训练都来大声鼓励。周五球队险胜。教练说真正的队长用心领导，不只靠得分。"
  },
  {
    word: "careful",
    pos: "形容词",
    storyEn:
      "Science class used small glass tools today. The teacher asked us to be careful with every step. I moved slowly and wore safety glasses. At the end nobody broke anything, and we learned that careful work saves time.",
    storyZh:
      "今天的科学课要用小玻璃器材。老师要求我们每一步都小心。我慢慢操作并戴上护目镜。最后没人打碎东西，我们明白细心反而省时。"
  },
  {
    word: "carrot",
    pos: "名词",
    storyEn:
      "Grandpa grows carrots behind his house. They are sweeter than the ones in the supermarket. He washes the soil off and cuts them into sticks for us. Even children who dislike vegetables will try his carrot salad.",
    storyZh:
      "爷爷在屋后种胡萝卜。它们比超市的更甜。他洗掉泥土，切成条给我们。连不爱吃蔬菜的孩子也会尝他的胡萝卜沙拉。"
  },
  {
    word: "celebrate",
    pos: "动词",
    storyEn:
      "Our class did well in the singing contest. We did not spend money on a big party. Instead we brought homemade snacks and played music in the classroom. Sometimes the best way to celebrate is simply to be together.",
    storyZh:
      "我们班在歌唱比赛里表现很好。我们没有花大钱办派对，而是自带点心在教室里放音乐。有时最好的庆祝方式就是待在一起。"
  },
  {
    word: "century",
    pos: "名词",
    storyEn:
      "The museum showed photos from the last century. Black-and-white streets looked narrow and quiet. My grandfather pointed at a corner and said he played there as a boy. History is not only a date; it is people's real lives.",
    storyZh:
      "博物馆展出了上世纪的照片。黑白街道显得又窄又静。爷爷指着街角说他小时候在那儿玩。历史不只是年代，更是真实的人生。"
  },
  {
    word: "cheap",
    pos: "形容词",
    storyEn:
      "Ming bought a cheap umbrella on a rainy day. It broke after two weeks. He learned that the lowest price is not always the best deal. Next time he saved a little longer and chose a stronger one.",
    storyZh:
      "明雨天买了一把便宜伞。两周就坏了。他明白最便宜的不一定最划算。下次他多攒一点钱，选了一把更结实的。"
  },
  {
    word: "cheer",
    pos: "名词 / 动词",
    storyEn:
      "When our runner reached the last hundred meters, the crowd began to cheer loudly. Her legs were tired, but she heard her name. She passed one more student and crossed the line with a smile. Cheer can push people forward.",
    storyZh:
      "我们的赛跑选手跑到最后一百米时，人群开始大声欢呼。她的腿很沉，但听到了自己的名字。她又超过一名同学，笑着冲过终点。欢呼能推人向前。"
  },
  {
    word: "chocolate",
    pos: "名词",
    storyEn:
      "On Valentine's Day, the shop sold heart-shaped chocolate. My sister bought one for Mother and hid it in the fridge. Mother pretended she did not know, but her eyes were happy. Sweet chocolate carries sweet words without speaking.",
    storyZh:
      "情人节那天店里卖心形巧克力。姐姐给妈妈买了一块藏在冰箱里。妈妈装作不知道，眼睛却很高兴。甜甜的巧克力不用说话也带着情意。"
  },
  {
    word: "choose",
    pos: "动词",
    storyEn:
      "Two clubs met at the same time on Tuesday. Hua had to choose between chess and painting. She asked herself which one she would miss more. She chose painting because colors calm her mind after long study.",
    storyZh:
      "周二两个社团同一时间活动。华必须在象棋和绘画之间选择。她问自己更舍不得哪一个。她选了绘画，因为鲜艳的颜色能在长时间学习后让她平静。"
  },
  {
    word: "circle",
    pos: "名词 / 动词",
    storyEn:
      "We sat in a circle on the grass and shared stories about our hometowns. The teacher drew a circle on paper and asked what it means in different cultures. Some said family, some said the sun. A simple circle held many ideas.",
    storyZh:
      "我们围成一圈坐在草地上，分享家乡的故事。老师在纸上画了一个圆，问它在不同文化里代表什么。有人说家庭，有人说太阳。简单的圆能装下许多想法。"
  },
  {
    word: "clever",
    pos: "形容词",
    storyEn:
      "The fox in the story was clever enough to reach the grapes with a stick. In real life, clever students also ask for help when they are stuck. Cleverness is not only quick answers; it is knowing when to think and when to listen.",
    storyZh:
      "故事里的狐狸够聪明，用棍子够到葡萄。现实中聪明的学生卡住时也会求助。聪明不只是答得快，还知道何时思考、何时倾听。"
  },
  {
    word: "climb",
    pos: "动词",
    storyEn:
      "We planned to climb the small hill behind school on Saturday. The path was steep at first, but trees gave shade. On the top we saw the whole town under clouds. Anyone can climb higher step by step if they keep breathing steadily.",
    storyZh:
      "我们计划周六爬学校后的小山。开头路很陡，但树提供了阴凉。山顶上我们看到云下的整座城。只要呼吸均匀，谁都可以一步步爬得更高。"
  },
  {
    word: "clothes",
    pos: "名词",
    storyEn:
      "Before the trip, Mother washed our clothes and folded them neatly. She said clean clothes show respect for others. My brother tried to pack only two shirts and failed. In the end we laughed and shared space in one suitcase.",
    storyZh:
      "旅行前妈妈洗净衣服叠得整整齐齐。她说整洁的衣服是对别人的尊重。弟弟想只带两件衬衫，结果失败了。最后我们笑着共用一个行李箱。"
  },
  {
    word: "cloud",
    pos: "名词",
    storyEn:
      "We lay on the grass and watched a white cloud change shape. First it looked like a rabbit, then a ship. Wind moved it slowly across the blue sky. For a quiet hour, nobody thought about homework or screens.",
    storyZh:
      "我们躺在草地上看一朵白云变形。先像兔子，又像船。风把它慢慢吹过蓝天。安静的一小时里，没人想到作业或屏幕。"
  },
  {
    word: "coast",
    pos: "名词",
    storyEn:
      "Last holiday we drove along the east coast. Fishermen sold fresh shrimp by the road. Waves hit the rocks with a steady rhythm. My cousin said the coast is loud and peaceful at the same time. I wrote that line in my diary.",
    storyZh:
      "上次假期我们沿着东海岸开车。渔民在路边卖鲜虾。海浪有节奏地拍打着岩石。表弟说海岸又喧闹又宁静。我把这句话写进了日记。"
  },
  {
    word: "college",
    pos: "名词",
    storyEn:
      "My sister studies at a college in another city. She calls home on Sunday and talks about new friends and heavy reading lists. Parents listen quietly and remind her to sleep early. College is busy, but she likes choosing her own time.",
    storyZh:
      "姐姐在另一座城市上大学。她周日打电话回家，聊新朋友和长长的书单。父母静静听着，提醒她早点睡。大学很忙，但她喜欢自己安排时间。"
  },
  {
    word: "comfort",
    pos: "名词 / 动词",
    storyEn:
      "When I failed a test, I did not tell anyone at first. Mother made tea and sat beside me without questions. Her quiet comfort helped me speak. Sometimes comfort is not advice; it is just staying near.",
    storyZh:
      "我考试失利时起初谁也没说。妈妈泡了茶坐在我旁边，一句也不追问。她安静的安慰让我开口。有时安慰不是讲道理，只是陪在身边。"
  },
  {
    word: "concert",
    pos: "名词",
    storyEn:
      "The school concert began with piano music and ended with a choir. Parents filled the hall and recorded videos carefully. My hands were sweaty before my violin part, but the lights felt warm. After the last note, applause washed over us like rain.",
    storyZh:
      "学校音乐会以钢琴曲开场，以合唱结束。家长们坐满大厅，认真录视频。我拉小提琴前手心出汗，但灯光很暖。最后一个音符后，掌声像雨点落在我们身上。"
  },
  {
    word: "continue",
    pos: "动词",
    storyEn:
      "Heavy rain stopped our football match at half time. Everyone waited in the gym for forty minutes. When the sky cleared, the referee let the game continue. We were tired but ran again because we loved the green field.",
    storyZh:
      "大雨在半场时中断了足球赛。大家在体育馆等了四十分钟。天晴后裁判让比赛继续。我们很累，但仍奔跑，因为我们爱这片绿草地。"
  },
  {
    word: "courage",
    pos: "名词",
    storyEn:
      "Public speaking used to scare Han. She wrote her speech on small cards and practiced in front of a mirror. On competition day her legs shook, yet she walked to the microphone. Courage does not mean no fear; it means moving forward with fear.",
    storyZh:
      "公开演讲曾让涵害怕。她把演讲稿写在小卡片上，对着镜子练。比赛那天她腿在发抖，仍走向话筒。勇气不是没有恐惧，而是带着恐惧仍然向前。"
  },
  {
    word: "cousin",
    pos: "名词",
    storyEn:
      "Every Spring Festival my cousin comes from another province. We are the same age and both like badminton. We sleep in one room and whisper until midnight. Even when we argue about games, we know we are still family.",
    storyZh:
      "每年春节表弟都从外省回来。我们同龄，都喜欢羽毛球。我们睡一间房，窃窃私语到半夜。就算为游戏争吵，也知道仍是亲人。"
  },
  {
    word: "creative",
    pos: "形容词",
    storyEn:
      "Art homework asked us to use only paper and glue. Most students made simple houses, but Lin built a tiny bridge with stairs. The teacher smiled and said a creative mind finds new paths with old tools.",
    storyZh:
      "美术作业要求只用纸和胶。多数同学做了简单的房子，琳却用纸做了带楼梯的小桥。老师笑着说，有创意的头脑能用旧材料找到新路。"
  },
  {
    word: "crowd",
    pos: "名词",
    storyEn:
      "At the train station during holiday, the crowd moved slowly toward the gates. I held my father's hand tightly so we would not separate. A worker used a loudspeaker to guide lines. In a crowd, patience and clear signs both matter.",
    storyZh:
      "假期火车站里，人群缓慢地向检票口移动。我紧紧牵着爸爸的手以免走散。工作人员用扩音器引导排队。在人群中，耐心和清晰的指引都重要。"
  },
  {
    word: "curtain",
    pos: "名词",
    storyEn:
      "The theater went dark, and the red curtain opened slowly. Music rose and actors walked onto the stage. For two hours the audience forgot their phones. When the curtain closed, people stood and clapped until their hands hurt.",
    storyZh:
      "剧场暗下来，红幕缓缓拉开。音乐响起，演员走上舞台。两小时里观众忘了手机。幕布落下时，人们起立鼓掌，直到手发酸。"
  },
  {
    word: "custom",
    pos: "名词",
    storyEn:
      "In our town there is a custom on the first snow: neighbors share hot soup at the community hall. New families learn the rules quickly. The custom is old, but young people still enjoy the warm bowls and laughter.",
    storyZh:
      "我们镇上有个初雪习俗：邻居在社区活动中心分享热汤。新搬来的家庭很快学会规矩。习俗很老，年轻人仍喜欢热汤与笑声。"
  },
  {
    word: "dangerous",
    pos: "形容词",
    storyEn:
      "Swimming in the river looks fun, but the current can be dangerous after rain. Signs warn people not to cross the rope. Last year a brave dog saved a child who fell in. Remember: beautiful water is not always safe water.",
    storyZh:
      "在河里游泳看起来好玩，但雨后水流可能很危险。告示提醒人们不要越过绳索。去年一只勇敢的狗救起了落水的孩子。记住：好看的水不一定安全。"
  },
  {
    word: "diamond",
    pos: "名词",
    storyEn:
      "The science video showed how a diamond forms deep under the earth for millions of years. It is only carbon, but pressure makes it hard and clear. The teacher said learning is similar: time and pressure can turn simple effort into something bright.",
    storyZh:
      "科学片展示钻石如何在地下经数百万年形成。它只是碳，但高压让它坚硬透明。老师说学习也类似：时间和压力能把简单的努力变成闪亮的东西。"
  }
];

function sortWordStories(list) {
  return list.slice().sort(function (a, b) {
    return a.word.toLowerCase().localeCompare(b.word.toLowerCase(), "en");
  });
}

var WORD_STORIES_SORTED = sortWordStories(WORD_STORIES_RAW);

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderWordStoryAt(index) {
  var total = WORD_STORIES_SORTED.length;
  if (total === 0) return;
  var i = ((index % total) + total) % total;
  var item = WORD_STORIES_SORTED[i];
  var html = "";
  html +=
    '<p class="accumulate-progress" lang="zh-CN">第 ' +
    (i + 1) +
    " / " +
    total +
    " 个词（按字母顺序 · 实词）</p>";
  html +=
    '<h2 class="accumulate-word" lang="en">' +
    escapeHtml(item.word) +
    "</h2>";
  html +=
    '<p class="accumulate-pos" lang="zh-CN">词性：' +
    escapeHtml(item.pos) +
    "</p>";
  html +=
    '<div class="accumulate-story-en" lang="en">' +
    escapeHtml(item.storyEn) +
    "</div>";
  $("#accumulate-display").html(html);
  $("#accumulate-translation").text(item.storyZh);
  $("#accumulate-translation").hide();
  $("#btn-toggle-story-zh info").attr("text", "no");
  $("#btn-toggle-story-zh info").text("中文翻译");
}

$(function () {
  var idx = 0;
  renderWordStoryAt(idx);
  $("#btn-next-word-story").on("click", function () {
    idx += 1;
    if (idx >= WORD_STORIES_SORTED.length) idx = 0;
    renderWordStoryAt(idx);
  });
  $("#btn-prev-word-story").on("click", function () {
    idx -= 1;
    if (idx < 0) idx = WORD_STORIES_SORTED.length - 1;
    renderWordStoryAt(idx);
  });
  $("#btn-toggle-story-zh").on("click", function () {
    var info = $("#btn-toggle-story-zh info").attr("text");
    if (info === "no") {
      $("#accumulate-translation").slideDown(150);
      $("#btn-toggle-story-zh info").attr("text", "yes");
      $("#btn-toggle-story-zh info").text("隐藏翻译");
    } else {
      $("#accumulate-translation").slideUp(150);
      $("#btn-toggle-story-zh info").attr("text", "no");
      $("#btn-toggle-story-zh info").text("中文翻译");
    }
  });
});
