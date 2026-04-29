// --- 設定 ---
const SETTINGS = {
    backgroundImageSrc: 'background.png',
    giantSkinSrc: 'giant_skin.png',
    giantClothesSrc: 'giant_clothes.png',
    giantClothesFrontSrc: 'giant_clothes_front.png', 
    maskImageSrc: 'giant_mask.png',
    playerIdle01Src: 'player_idle01.png',
    playerIdle02Src: 'player_idle02.png',
    playerSlide01Src: 'player_slide01.png',
    playerSlide02Src: 'player_slide02.png',
    playerJumpSrc: 'player_jump.png',
    
    scaleFactor: 3,
    jumpPower: 5,            
    groundedJumpBoost: 2.5, 
    maxJumpDistance: 500,   
    downwardJumpBoost: 1.2, 
    airResistance: 0.94,    
    stopThreshold: 0.2,     
    
    gravity: 0.8,
    maxFallSpeed: 12,
    climbAnimationSpeed: 0.2,
    revealRadius: 80,
    hitRadius: 18,
    maxBgOffset: 500,

    messageTextX: 110,
    messageFontSize: 18,
    fixedMessageCount: 6,

    breathSpeed: 0.02, 
    breathAmount: 0.01,
    playerAnimSpeed: 20
};

const FACE_ASSETS = {
    GEKIDO: 'giant_face_gekido.png',
    IKARI: 'giant_face_ikari.png',
    KOMARI: 'giant_face_komari.png',
    NIYA: 'giant_face_niya.png',
    OI: 'giant_face_oi.png',
    OOWARAI: 'giant_face_oowarai.png',
    WARAI: 'giant_face_warai.png',
    ODOROKI: 'giant_face_odoroki.png',
    ODOROKI2: 'giant_face_odoroki2.png',
    TERE: 'giant_face_tere.png'
};
const FACE_CUTOUT = { x: 990, y: 55, size: 390 };

// --- 言語設定 ---
let currentLang = 'JP'; // 'JP' or 'EN'

// --- エンディングアセット設定 ---
const ENDING_ASSETS = {
    END1: 'ending1.png',
    END2: 'ending2.png',
    END3: 'ending3.png',
    END4: 'ending4.png',
    END5: 'ending5.png'
};

// --- 色ごとの挙動設定 ---
const COLOR_CONFIG = {
    VOID:    { loop: true,  resetOnLeave: false },
    PINK:    { loop: true,  resetOnLeave: false },
    ORANGE:  { loop: true,  resetOnLeave: false },
    BLACK:   { loop: true,  resetOnLeave: false },
    PURPLE:  { loop: true,  resetOnLeave: false },
    MAGENTA: { loop: false, endTo: 'END2', resetOnLeave: true }, 
    MAROON:  { loop: false, endTo: 'END1', resetOnLeave: true },
    GREEN:   { loop: false, endTo: 'END3', resetOnLeave: true },
    YELLOW:  { loop: false, endTo: 'END4', resetOnLeave: true },
    CYAN:    { loop: true,  resetOnLeave: false },
    BROWN:   { loop: true,  resetOnLeave: false },
    LIME:    { loop: false, endTo: 'END5', resetOnLeave: true }
};

const COLOR_THEMES = {
    VOID:    "#444444",
    PINK:    "#A04060",
    ORANGE:  "#A06000",
    BLACK:   "#222222",
    PURPLE:  "#604080",
    MAGENTA: "#800080",
    MAROON:  "#600000",
    GREEN:   "#006000",
    YELLOW:  "#807000",
    CYAN:    "#006070",
    BROWN:   "#503000",
    LIME:    "#407000"
};

let lastColorKey = 'VOID';

// --- 表情ごとの呼吸設定 ---
const FACE_BREATH_CONFIG = {
    GEKIDO:  { speed: 0.10, amount: 0.010 },
    IKARI:   { speed: 0.06, amount: 0.010 },
    KOMARI:  { speed: 0.06, amount: 0.010 },
    NIYA:    { speed: 0.02, amount: 0.010 },
    OI:      { speed: 0.02, amount: 0.010 },
    OOWARAI: { speed: 0.08, amount: 0.010 },
    WARAI:   { speed: 0.07, amount: 0.010 }, 
    ODOROKI: { speed: 0.01, amount: 0.010 }, 
    ODOROKI2: { speed: 0.01, amount: 0.010 }, 
    TERE:    { speed: 0.04, amount: 0.010 }  
};

// --- メッセージデータ ---
const FIXED_MESSAGES = [
    { JP: " ", EN: " ", face: "NIYA" },
    { JP: "人間のてめぇが\n巨人の俺様に\n挑もうって？", EN: "A tiny human like you\ndares to challenge\na giant like me?", face: "OI" },
    { JP: "いい度胸じゃねえか。\nその挑戦\n受けてやるよ！", EN: "You've got guts.\nI'll accept\nyour challenge!", face: "NIYA" },
    { JP: "俺も鬼じゃねえ。\n俺はただ\n立ってるだけだ。", EN: "I'm not a monster.\nI'll just be\nstanding here.", face: "OI" },
    { JP: "俺の頭より上まで\n登ってこれたら\n負けを認めてやるよ。", EN: "If you can climb\nabove my head,\nI'll admit defeat.", face: "NIYA" },
    { JP: "負けたら何でも\n言うこと聞いてやるぜ！\nありえねえけどな！", EN: "If I lose, I'll do\nwhatever you say!\nNot that it'll happen!", face: "WARAI" }
];

const COLOR_MESSAGES = {
    VOID: [
        { JP: "登るんなら足からだぜ。\nほんのちょびっと\n臭いかもしれねえがな！", EN: "Start from the feet.\nThey might be a\nlittle smelly, though!", face: "OI" },
        { JP: "いつまでそんなとこに\nいる気だ？", EN: "How long do you\nplan to stay there?", face: "NIYA" },
        { JP: "怖気づいたか？\nいまさら降参なんて\n認めねえぞ！！", EN: "Getting scared?\nI won't accept\na surrender now!!", face: "WARAI" },
        { JP: "さあ勇気を見せてみろ！", EN: "Show me your courage!", face: "NIYA" }
    ],
    PINK: [
        { JP: "うひっ\n少しくすぐったいな。", EN: "Uhi!\nThat's a little\nticklish.", face: "KOMARI" },
        { JP: "どうだ？\n柔道家の足は硬いだろ？", EN: "How's that?\nA judoka's legs\nare tough, right?", face: "NIYA" },
        { JP: "すね毛に捕まって\n登ってみろよ！", EN: "Try climbing by\ngrabbing my leg hair!", face: "NIYA" },
        { JP: "…クサくねえよな？", EN: "...It doesn't smell,\ndoes it?", face: "IKARI" }
    ],
    ORANGE: [
        { JP: "俺、毛深い方だからな～\nそのへんは人間からしたら\nまさにジャングルだよな！", EN: "I'm pretty hairy.\nTo a human, this\nmust be a jungle!", face: "NIYA" },
        { JP: "いてっ！\nあんまり毛を引っ張るなよ！", EN: "Ouch!\nDon't pull my\nhair so hard!", face: "KOMARI" },
        { JP: "そこは毛深くて\n登りやすいんじゃないか？", EN: "Is it easier to\nclimb where it's hairy?", face: "NIYA" },
        { JP: "俺の毛の中で\n迷子になるなよ！", EN: "Don't get lost\nin my hair!", face: "WARAI" }
    ],
    BLACK: [
        { JP: "ふ…服の中を登られるとは\n予想外だったぜ…", EN: "Wh-climbing inside\nmy clothes...\nI didn't expect this...", face: "ODOROKI2" },
        { JP: "くすぐったいところは\nあんまさわるなよ！", EN: "Don't touch the\nticklish spots!", face: "KOMARI" },
        { JP: "お前は大丈夫かよ？\n服の中は匂いが\nこもってるんじゃないか？", EN: "Are you okay?\nIsn't it smelly\ninside here?", face: "OI" },
        { JP: "けっこう汗かいてるからな～。\nサウナみたいだろ？", EN: "I'm sweating a lot.\nFeels like a sauna,\ndoesn't it?", face: "WARAI" },
        { JP: "服の下でもぞもぞと…\nつい、ひっぱたきそう…", EN: "Squirming under my\nclothes... I might\njust swat you...", face: "IKARI" },
        { JP: "気持ち悪くないのか？\n俺みてえなのの\n服の中なんか…", EN: "Doesn't it gross\nyou out? Being inside\na guy like me...", face: "ODOROKI" },
        { JP: "……汗まみれの\n男の体を這うなんて、\n俺絶対イヤだけどな。", EN: "...Crawling on a\nsweaty man's body...\nI'd never do that.", face: "NIYA" },
        { JP: "なんかだんだん\n恥ずかしくなってきたな…", EN: "Actually, I'm\nstarting to feel\na bit embarrassed...", face: "TERE" },
        { JP: "こんな勝負になるなんて\n思ってなかったんだが…", EN: "I never thought the\nmatch would turn\nout like this...", face: "KOMARI" }
    ],
    MAROON: [
        { JP: "うひっ！\nそこはヤバいって！", EN: "Uhi! Not there!\nThat's dangerous!", face: "KOMARI" },
        { JP: "く…くくく…\nそ…そっちに回り込むなよ！！\nお前も気持ち悪いだろ！", EN: "Hehe... stop!\nDon't go around there!\nThat's gross for you too!", face: "IKARI" },
        { JP: "うへへっ…！\nくすぐってぇ～！！", EN: "Uhehe...!\nIt tickles so much!!", face: "KOMARI" },
        { JP: "も、戻れ！\nそ…そこから離れろよ！\nがははっ！", EN: "G-get back!\nGet away from there!\nBwahaha!", face: "OOWARAI" },
        { JP: "てめぇっ…ふはは…\nいいかげんに…っ\nしろぉ…！！", EN: "You...! Hahaha...\nThat's enough...!\nStop it!!", face: "GEKIDO" },
        { JP: "ぎゃはははは！！\nはぁ…はぁ…はは！！\nよせ！もう…だめ…", EN: "Gyahahaha!!\nHah... hah... haha!!\nStop! I can't... take it!", face: "WARAI" },
        { JP: "ひゃははは！！！！\nひーっ！！！！", EN: "Hyahahaha!!!!\nHeee!!!!", face: "OOWARAI" }
    ],
    PURPLE: [
        { JP: "…！！", EN: "...!!", face: "ODOROKI" },
        { JP: "…っ！！！", EN: "...!!!", face: "KOMARI" },
        { JP: "お前…\nあんまりそこは…", EN: "You... not\nthat area...", face: "KOMARI" },
        { JP: "そ…そこから移動したほうが\nいいぞ…！", EN: "Y-you should probably\nmove away from there!", face: "IKARI" },
        { JP: "てめぇ、そこがどこか\n分かってんのか！？", EN: "Hey, do you even\nrealize where you are!?", face: "GEKIDO" }
    ],
    MAGENTA: [
        { JP: "ちょっ…！！！", EN: "Wait...!!!", face: "ODOROKI2" },
        { JP: "てめぇ、わかってて\nやってやがんのか…！？", EN: "Are you doing this\non purpose...!?", face: "IKARI" },
        { JP: "い、いいか！\nやめとくなら\n今だぞ！", EN: "Listen! If you're\ngonna stop, do it now!", face: "GEKIDO" },
        { JP: "っ…！\n俺、ガマンしねえぞ…？！", EN: "...!\nI'm not gonna hold back...!", face: "KOMARI" },
        { JP: "よ、よーし…\nそっちがその気なら…！", EN: "Alright... if\nthat's how you want it!", face: "IKARI" }
    ],
    GREEN: [
        { JP: "んっ…っと…\nお, お前…！！", EN: "Ngh... hey,\nyou...!!", face: "ODOROKI2" },
        { JP: "………\n", EN: ".........", face: "ODOROKI" },
        { JP: "…お前…\nそこさわんなよ", EN: "...Hey...\nDon't touch there.", face: "TERE" },
        { JP: "ふざけてんのか？\nやっていいことと\n悪いことがあるぜ！", EN: "Are you kidding?\nThere are lines\nyou don't cross!", face: "KOMARI" },
        { JP: "いい加減に怒るぞ…！", EN: "I'm really getting\nangry now...!", face: "GEKIDO" },
        { JP: "…いいか, 最後の忠告だぞ！", EN: "...Listen, this is\nyour last warning!", face: "IKARI" },
        { JP: "３…２…１…", EN: "3... 2... 1...", face: "OI" }
    ],
    YELLOW: [
        { JP: "あひっ！", EN: "Ahi!", face: "ODOROKI2" },
        { JP: "ちょ、そこは…っ！！！", EN: "Wait, that's...!!!", face: "KOMARI" },
        { JP: "ぐひひっ！\nや、やばいって！！！！！", EN: "Guhehe! Stop,\nthis is bad!!!!!", face: "OOWARAI" }
    ],
    CYAN: [
        { JP: "やるなあ！\nこんなところまで\n登ってくるなんて…", EN: "Not bad!\nI can't believe you\nclimbed this far...", face: "ODOROKI" },
        { JP: "ここまできて滑り落ちるなよ！\nこの高さじゃ一瞬でオダブツだろ？", EN: "Don't fall now!\nAt this height,\nyou're history.", face: "OI" },
        { JP: "正直ここまでやるとは\n思わなかったぜ。", EN: "To be honest,\nI didn't think\nyou'd make it.", face: "NIYA" },
        { JP: "ゴールは頭の上だぞ！\nあと一息だ！", EN: "The goal is above\nmy head! Almost there!", face: "WARAI" }
    ],
    BROWN: [
        { JP: "お、おい！\nなんてとこ掴んでんだ？", EN: "Hey, what are you\ngrabbing onto?", face: "OI" },
        { JP: "そんなとこ登られたら\n反射的に手が\n出ちまいそうだ…", EN: "If you climb there,\nmy hand might move\nreflexively...", face: "KOMARI" },
        { JP: "むずむずする…\nなんか恥ずかしいぜ…", EN: "It's ticklish...\nand a bit\nembarrassing...", face: "TERE" },
        { JP: "ゴールは頭の上だぞ！\nいつまでそんなとこに\n張り付いてやがる！", EN: "The goal is higher!\nHow long do you plan\nto cling there!", face: "IKARI" }
    ],
    LIME: [
        { JP: "おいおい…\nとうとうやりやがったな！", EN: "Whoa... you\nfinally did it!", face: "OI" },
        { JP: "こりゃあ認めざるを得ないな。\n人間にしてはやるじゃねえか。", EN: "I have to admit it.\nYou're pretty good\nfor a human.", face: "NIYA" },
        { JP: "約束は守らねえとな。\n俺にしてほしいこと\n何でも言ってみな！", EN: "I keep my word.\nTell me what you\nwant me to do!", face: "WARAI" },
        { JP: "なになに………？\n…ふむふむ……", EN: "Wait, what...?\n...Hmm, I see...", face: "OI" },
        { JP: "……なんだと？\nそ…それは\nマジで言ってんのか？", EN: "...What?\nHey, are you\nserious?", face: "IKARI" },
        { JP: "……仕方ねえな。\n多少おおざっぱでも\n文句言うなよ？", EN: "...Fine. Don't\ncomplain if I'm\na bit rough.", face: "TERE" }
    ]
};

const ENDING_MESSAGES = {
    END1: [
        { JP: "どわぁ！！！", EN: "Dowaah!!!", face: "ODOROKI" },
        { JP: "あははっ！\nははっ…はは…！\nもう許して…", EN: "Ahaha! Hahaha...!\nStop it already...", face: "OOWARAI" },
        { JP: "お, お前の勝ちだ！ \nはー…はー…", EN: "Alright, you win!\nHah... hah...", face: "OOWARAI" },
        { JP: "はーぁ…\n街が…\nこりゃひっでぇな…", EN: "Sigh...\nThe town... is a\ntotal mess now...", face: "TERE" },
        { JP: "え…？\n俺のせいじゃねえだろ…？", EN: "Eh...?\nIt's not my fault,\nright?", face: "KOMARI" },
        { JP: "【ENDING 1：くすぐったがり】", EN: "[ENDING 1: Ticklish Giant]", face: "KOMARI" }
    ],
    END2: [
        { JP: "その気にさせたのは\nお前だからな…？", EN: "You've got me\nexcited now...", face: "IKARI" },
        { JP: "…何？\n最初からこうする\nつもりで…？", EN: "What!? Was this\nyour plan from\nthe start...?", face: "ODOROKI" },
        { JP: "がはは！\n小人のくせに\n度胸あるじゃねえか！", EN: "Bwahaha! You've\ngot guts for a\nlittle human!", face: "WARAI" },
        { JP: "後悔するなよ？\n巨人はそう簡単に\n満足しねえからな…", EN: "Don't regret it.\nGiants aren't\neasily satisfied...", face: "NIYA" },
        { JP: "【ENDING 2：お持ち帰り】", EN: "[ENDING 2: Take Home]", face: "NIYA" }
    ],
    END3: [
        { JP: "おらっ！", EN: "Take that!", face: "GEKIDO" },
        { JP: "ったくよぉ～\n俺にそんなとこいじられる\n趣味はねえっての！", EN: "Good grief...\nI'm not into having\nthat touched!", face: "IKARI" },
        { JP: "こんなことのために\n勝負挑んで来たのか？\nとんだ変態野郎だぜ…。", EN: "Challenging me just\nfor something like\nthat... You pervert.", face: "OI" },
        { JP: "…ん！？\nなんかお前乳首に\n硬いもん突き立てて…？", EN: "...Wait!? Are you\npoking something\nhard at my nipple...?", face: "ODOROKI2" },
        { JP: "てめぇ…！！\n興奮してんじゃねぇええ！！！", EN: "You...!!\nDon't get all\nexcited on me!!!", face: "GEKIDO" },
        { JP: "【ENDING 3：ブチギレ】", EN: "[ENDING 3: Furious Giant]", face: "GEKIDO" }
    ],
    END4: [
        { JP: "ぐふっ…！！\nぎゃはははははは！！", EN: "Guhu...!!\nGyahahahaha!!", face: "OOWARAI" },
        { JP: "あっ、やっべ！！！", EN: "Ah, crap!!!", face: "ODOROKI" },
        { JP: "あー, やっちまった…\n完全に潰れてら…", EN: "Ah, I did it...\nTotally crushed...", face: "KOMARI" },
        { JP: "動かないって約束したのに…\n悪ぃことしたなあ…。", EN: "I promised not to\nmove... I feel\nbad about this.", face: "IKARI" },
        { JP: "こりゃ俺の負けだな, \n成仏しろよ、人間…", EN: "I guess this is\nmy loss, human.", face: "TERE" },
        { JP: "【ENDING 4：事故】", EN: "[ENDING 4: Accident]", face: "TERE" }
    ],
    END5: [
        { JP: "（ぶちゅっ）", EN: "(Smack/Kiss)", face: "TERE" },
        { JP: "おら, これでいいか？\nったく…\n何なんだお前は…", EN: "There, happy now?\nSheesh... what\nare you anyway...", face: "IKARI" },
        { JP: "え？\n俺のことが好き…？", EN: "Eh?\nYou like me...?", face: "ODOROKI" },
        { JP: "人間のお前がか？\nバカも休み休み言えよ！", EN: "A human like you?\nStop talking nonsense!", face: "WARAI" },
        { JP: "まあ、人間のことも\nちょっとは見直した\nけどな…", EN: "Well, I guess I've\nchanged my mind\na bit about humans...", face: "OI" },
        { JP: "…いいぜ。\n気が向いたら\nまた遊んでやるよ。\n", EN: "...Fine.\nI'll play with you\nagain if I feel like it.", face: "NIYA" },
        { JP: "【ENDING 5：勝利のキス】", EN: "[ENDING 5: Victory Kiss]", face: "NIYA" }
    ]
};

// --- グローバル管理 ---
let gameStarted = false;
let gameState = {
    vy: 0, vx: 0, playerScreenX: 0, playerScreenY: 0, mapX: 0, mapY: 0,
    score: 0, isGrounded: true, climbAnimTimer: 0, breathTimer: 0,
    isFlying: false, messageReserved: false, messagesShown: 0,
    isGameOver: false,
    currentEndingKey: null,
    playerAnimTimer: 0,
    endingMessageIndex: 0,
    fadeTimer: 0,
    fadePhase: 'NONE',
    pendingEndingKey: null,
    pendingColorKey: 'VOID'
};

const FADE_SPEED = 0.02;
let messageIndices = { BLACK: 0, GREEN: 0, YELLOW: 0, PURPLE: 0, CYAN: 0, ORANGE: 0, PINK: 0, BROWN: 0, MAROON: 0, VOID: 0, MAGENTA: 0, LIME: 0 };

const VIRTUAL_WIDTH = 360;
const VIRTUAL_HEIGHT = 640;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const maskCanvas = document.createElement('canvas');
let maskCtx = null; 

let typeWriter = {
    fullText: "", displayText: "", index: 0, speed: 2, timer: 0, 
    currentFaceKey: "NIYA", color: "#000000", showGauge: false, currentColorKey: 'VOID',
    originalMsgObj: null
};

const assets = {};
const assetSources = {
    titleLogoImg: 'title.png', // タイトルロゴ画像を追加
    background: SETTINGS.backgroundImageSrc,
    giantSkin: SETTINGS.giantSkinSrc,
    giantClothes: SETTINGS.giantClothesSrc,
    giantClothesFront: SETTINGS.giantClothesFrontSrc,
    mask: SETTINGS.maskImageSrc,
    pIdle01: SETTINGS.playerIdle01Src,
    pIdle02: SETTINGS.playerIdle02Src,
    pSlide01: SETTINGS.playerSlide01Src,
    pSlide02: SETTINGS.playerSlide02Src,
    pJump: SETTINGS.playerJumpSrc,
    giant_face_gekido: FACE_ASSETS.GEKIDO,
    giant_face_ikari: FACE_ASSETS.IKARI,
    giant_face_komari: FACE_ASSETS.KOMARI,
    giant_face_niya: FACE_ASSETS.NIYA,
    giant_face_oi: FACE_ASSETS.OI,
    giant_face_oowarai: FACE_ASSETS.OOWARAI,
    giant_face_warai: FACE_ASSETS.WARAI,
    giant_face_odoroki: FACE_ASSETS.ODOROKI,
    giant_face_odoroki2: FACE_ASSETS.ODOROKI2,
    giant_face_tere: FACE_ASSETS.TERE,
    END1: ENDING_ASSETS.END1,
    END2: ENDING_ASSETS.END2,
    END3: ENDING_ASSETS.END3,
    END4: ENDING_ASSETS.END4,
    END5: ENDING_ASSETS.END5
};

const TERRAIN = { VOID: 0, SKIN: 1, WALL: 2, PLATFORM: 3 };

function initCanvas() {
    const container = document.getElementById('gameContainer');
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const scale = (rect.width * dpr) / VIRTUAL_WIDTH;
    ctx.scale(scale, scale);
}

function resetGame() {
    const imgRatio = assets.giantSkin.width / assets.giantSkin.height;
    const drawW = VIRTUAL_WIDTH * SETTINGS.scaleFactor;
    const drawH = drawW / imgRatio;
    gameState.playerScreenX = VIRTUAL_WIDTH / 2.0;
    gameState.playerScreenY = VIRTUAL_HEIGHT * 0.7;
    const startX = (drawW / 1.85) - gameState.playerScreenX;
    const startY = drawH - gameState.playerScreenY;
    gameState.mapX = startX; gameState.mapY = startY;
    gameState.vx = 0; gameState.vy = 0; gameState.isFlying = false;
    gameState.messagesShown = 0; gameState.breathTimer = 0;
    startMessage(FIXED_MESSAGES[0]);
    gameState.messagesShown = 1;
}

function startMessage(msgObj, colorKey = 'VOID') {
    const text = msgObj[currentLang];
    if (typeWriter.fullText === text) return; 
    typeWriter.originalMsgObj = msgObj;
    typeWriter.fullText = text;
    typeWriter.currentFaceKey = msgObj.face;
    typeWriter.color = COLOR_THEMES[colorKey] || "#000000";
    const config = COLOR_CONFIG[colorKey];
    typeWriter.showGauge = (config && config.loop === false);
    typeWriter.currentColorKey = colorKey; 
    typeWriter.displayText = "";
    typeWriter.index = 0;
    typeWriter.timer = 0;
}

function toggleLanguage() {
    currentLang = (currentLang === 'JP') ? 'EN' : 'JP';
    if (typeWriter.originalMsgObj) {
        typeWriter.fullText = typeWriter.originalMsgObj[currentLang];
        typeWriter.displayText = typeWriter.fullText; 
        typeWriter.index = typeWriter.fullText.length;
    }
}

function updateTyping() {
    if (typeWriter.index < typeWriter.fullText.length) {
        typeWriter.timer++;
        if (typeWriter.timer >= typeWriter.speed) {
            typeWriter.index++;
            typeWriter.displayText = typeWriter.fullText.substring(0, typeWriter.index);
            typeWriter.timer = 0;
        }
    }
}

function getTerrainAt(tx, ty, ox = 0, oy = 0) {
    const drawW = VIRTUAL_WIDTH * SETTINGS.scaleFactor;
    if (!assets.mask.width || !maskCtx) return { type: TERRAIN.VOID };
    const scale = assets.mask.width / drawW;
    const checkX = Math.floor((tx + gameState.playerScreenX + ox) * scale);
    const checkY = Math.floor((ty + gameState.playerScreenY + oy) * scale);
    
    if (checkX < 0 || checkX >= assets.mask.width || checkY < 0 || checkY >= assets.mask.height) return { type: TERRAIN.VOID, colorKey: 'VOID' };
    
    const pixel = maskCtx.getImageData(checkX, checkY, 1, 1).data;
    const r = pixel[0], g = pixel[1], b = pixel[2];
    const check = (targetR, targetG, targetB) => Math.abs(r - targetR) <= 10 && Math.abs(g - targetG) <= 10 && Math.abs(b - targetB) <= 10;

    if (check(255, 0, 255)) return { type: TERRAIN.VOID, colorKey: 'MAGENTA' };
    if (check(191, 255, 0)) return { type: TERRAIN.VOID, colorKey: 'LIME' }; 
    if (check(255, 255, 255)) return { type: TERRAIN.VOID, colorKey: 'VOID' };
    if (check(255, 0, 0)) return { type: TERRAIN.WALL };
    if (check(0, 0, 255)) return { type: TERRAIN.PLATFORM };
    if (check(0, 255, 0)) return { type: TERRAIN.SKIN, colorKey: 'GREEN' };
    if (check(255, 255, 0)) return { type: TERRAIN.SKIN, colorKey: 'YELLOW' };
    if (check(128, 0, 128)) return { type: TERRAIN.SKIN, colorKey: 'PURPLE' };
    if (check(0, 255, 255)) return { type: TERRAIN.SKIN, colorKey: 'CYAN' };
    if (check(0, 0, 0)) return { type: TERRAIN.SKIN, colorKey: 'BLACK' };
    if (check(255, 165, 0)) return { type: TERRAIN.SKIN, colorKey: 'ORANGE' };
    if (check(255, 192, 203)) return { type: TERRAIN.SKIN, colorKey: 'PINK' };
    if (check(139, 69, 19)) return { type: TERRAIN.SKIN, colorKey: 'BROWN' };
    if (check(128, 0, 0)) return { type: TERRAIN.SKIN, colorKey: 'MAROON' };

    return { type: TERRAIN.VOID, colorKey: 'VOID' };
}

function checkCircleTerrain(tx, ty) {
    const radius = SETTINGS.hitRadius;
    const points = [{x: 0, y: 0}, {x: 0, y: -radius}, {x: 0, y: radius}, {x: -radius, y: 0}, {x: radius, y: 0}];
    let bestMatch = { type: TERRAIN.VOID, colorKey: 'VOID' };
    for (let p of points) {
        const res = getTerrainAt(tx, ty, p.x, p.y);
        if (res.type === TERRAIN.WALL) return res;
        if (res.type > bestMatch.type) bestMatch = res;
        if (res.colorKey) bestMatch.colorKey = res.colorKey;
    }
    return bestMatch;
}

function update() {
    if (!gameStarted) return;

    if (gameState.isGameOver) {
        updateTyping();
        return; 
    }

    const drawW = VIRTUAL_WIDTH * SETTINGS.scaleFactor;
    const drawH = drawW / (assets.giantSkin.width / assets.giantSkin.height);
    const terrainRes = checkCircleTerrain(gameState.mapX, gameState.mapY);
    const speed = Math.sqrt(gameState.vx ** 2 + gameState.vy ** 2);

    const breathConfig = FACE_BREATH_CONFIG[typeWriter.currentFaceKey] || FACE_BREATH_CONFIG.NIYA;
    gameState.breathTimer += breathConfig.speed;

    if (gameState.isFlying && !gameState.messageReserved && speed < 2.0) {
        if (gameState.messagesShown < SETTINGS.fixedMessageCount) {
            const msgObj = FIXED_MESSAGES[gameState.messagesShown];
            if (msgObj) { 
                startMessage(msgObj, 'VOID'); 
                gameState.messagesShown++; 
                gameState.messageReserved = true;
            }
        } else if (terrainRes.colorKey) {
            const key = terrainRes.colorKey;
            const config = COLOR_CONFIG[key] || { loop: true, resetOnLeave: false };
            if (key !== lastColorKey) {
                const lastConfig = COLOR_CONFIG[lastColorKey];
                if (lastConfig && lastConfig.resetOnLeave) messageIndices[lastColorKey] = 0;
                lastColorKey = key;
            }
            const messages = COLOR_MESSAGES[key];
            if (messages && messages.length > 0) {
                let idx = messageIndices[key] || 0;
                if (idx < messages.length) {
                    startMessage(messages[idx], key);
                    messageIndices[key] = idx + 1;
                    gameState.messageReserved = true;
                } else if (config.loop) {
                    messageIndices[key] = 0;
                    startMessage(messages[0], key);
                    messageIndices[key] = 1;
                    gameState.messageReserved = true;
                } else if (config.endTo) {
                    gameState.isGameOver = true;
                    gameState.currentEndingKey = config.endTo;
                    gameState.endingMessageIndex = 0;
                    const endMsgs = ENDING_MESSAGES[config.endTo];
                    if (endMsgs && endMsgs[0]) startMessage(endMsgs[0], key);
                }
            }
        }
    }

    if (gameState.isFlying) {
        gameState.vx *= SETTINGS.airResistance;
        gameState.vy *= SETTINGS.airResistance;
        if (terrainRes.type === TERRAIN.VOID) gameState.vy += SETTINGS.gravity;
        if (speed < SETTINGS.stopThreshold && terrainRes.type !== TERRAIN.VOID) {
            gameState.vx = 0; gameState.vy = 0; gameState.isFlying = false;
        }
    } else if (terrainRes.type === TERRAIN.VOID) {
        gameState.isFlying = true;
    }

    if (gameState.vy !== 0) {
        const stepsY = Math.ceil(Math.abs(gameState.vy));
        const stepSizeY = gameState.vy / stepsY;
        for (let i = 0; i < stepsY; i++) {
            const next = checkCircleTerrain(gameState.mapX, gameState.mapY + stepSizeY);
            if (next.type !== TERRAIN.WALL) {
                gameState.mapY += stepSizeY;
                if (gameState.vy > 0 && next.type === TERRAIN.PLATFORM) {
                    gameState.vx = 0; gameState.vy = 0; gameState.isFlying = false; break;
                }
            } else { gameState.vy = 0; break; }
        }
    }
    if (gameState.vx !== 0) {
        const stepsX = Math.ceil(Math.abs(gameState.vx));
        const stepSizeX = gameState.vx / stepsX;
        for (let i = 0; i < stepsX; i++) {
            if (checkCircleTerrain(gameState.mapX + stepSizeX, gameState.mapY).type !== TERRAIN.WALL) {
                gameState.mapX += stepSizeX;
            } else { gameState.vx = 0; break; }
        }
    }

    const maxY = drawH - gameState.playerScreenY - SETTINGS.hitRadius;
    if (gameState.mapY >= maxY - 1) {
        gameState.mapY = maxY;
        if (gameState.vy > 0) { gameState.vy = 0; gameState.vx = 0; gameState.isFlying = false; }
    }
    gameState.mapX = Math.max(0, Math.min(drawW - VIRTUAL_WIDTH, gameState.mapX));
    gameState.mapY = Math.max(-gameState.playerScreenY + SETTINGS.hitRadius, Math.min(maxY, gameState.mapY));

    const final = checkCircleTerrain(gameState.mapX, gameState.mapY);
    if (final.type === TERRAIN.SKIN && (gameState.isFlying || speed > SETTINGS.stopThreshold)) {
        gameState.climbAnimTimer += SETTINGS.climbAnimationSpeed;
    } else { gameState.climbAnimTimer = 0; }

    updateTyping();
    gameState.score = Math.max(0, Math.floor((drawH - gameState.mapY - gameState.playerScreenY) / 10));
    scoreEl.innerText = gameState.score;
}

function draw() {
    if (!gameStarted) return;
    ctx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
    ctx.fillStyle = "#314249"; 
    ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

    if (gameState.isGameOver) {
        const endImg = assets[gameState.currentEndingKey];
        if (endImg) ctx.drawImage(endImg, 0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
        else { ctx.fillStyle = "#000"; ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT); }
    } else {
        const imgRatio = assets.giantSkin.width / assets.giantSkin.height;
        const drawW = VIRTUAL_WIDTH * SETTINGS.scaleFactor;
        const drawH = drawW / imgRatio;
        const minY = -gameState.playerScreenY + SETTINGS.hitRadius;
        const maxY = drawH - gameState.playerScreenY - SETTINGS.hitRadius;
        const heightRatio = 1 - (gameState.mapY - minY) / (maxY - minY);
        const bgOffset = heightRatio * SETTINGS.maxBgOffset;
        const bgDrawH = drawW / (assets.background.width / assets.background.height);
        
        ctx.drawImage(assets.background, -gameState.mapX, -gameState.mapY + (drawH - bgDrawH) - bgOffset, drawW, bgDrawH);
        const breathScale = 1 + Math.sin(gameState.breathTimer) * SETTINGS.breathAmount;
        
        ctx.save();
        ctx.translate(gameState.playerScreenX, gameState.playerScreenY);
        ctx.scale(1, breathScale);
        ctx.translate(-gameState.playerScreenX, -gameState.playerScreenY);
        ctx.drawImage(assets.giantSkin, -gameState.mapX, -gameState.mapY, drawW, drawH);
        const faceKey = `giant_face_${typeWriter.currentFaceKey.toLowerCase()}`;
        if (assets[faceKey]) ctx.drawImage(assets[faceKey], -gameState.mapX, -gameState.mapY, drawW, drawH);
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
        ctx.arc(gameState.playerScreenX, gameState.playerScreenY, SETTINGS.revealRadius, 0, Math.PI * 2, true);
        ctx.clip(); 
        ctx.translate(gameState.playerScreenX, gameState.playerScreenY);
        ctx.scale(1, breathScale);
        ctx.translate(-gameState.playerScreenX, -gameState.playerScreenY);
        ctx.drawImage(assets.giantClothes, -gameState.mapX, -gameState.mapY, drawW, drawH);
        ctx.restore();

        gameState.playerAnimTimer++;
        const animFrame = Math.floor(gameState.playerAnimTimer / SETTINGS.playerAnimSpeed) % 2;
        const suffix = animFrame === 0 ? "01" : "02";
        const res = checkCircleTerrain(gameState.mapX, gameState.mapY);
        const speed = Math.sqrt(gameState.vx ** 2 + gameState.vy ** 2);
        let playerImg; let useClimbAnim = false;
        
        if (res.type === TERRAIN.PLATFORM || gameState.mapY >= maxY - 0.5) playerImg = assets[`pIdle${suffix}`];
        else if (res.type === TERRAIN.SKIN) {
            playerImg = assets[`pSlide${suffix}`];
            if (gameState.isFlying || speed > SETTINGS.stopThreshold) useClimbAnim = true;
        } else {
            playerImg = (gameState.isFlying && speed > SETTINGS.stopThreshold) ? assets.pJump : assets[`pSlide${suffix}`];
        }

        ctx.save();
        ctx.translate(gameState.playerScreenX, gameState.playerScreenY);
        if (useClimbAnim) { ctx.scale(Math.cos(gameState.climbAnimTimer) > 0 ? -1 : 1, 1); }
        ctx.drawImage(playerImg, -25, -25, 50, 50);
        ctx.restore();

        if (assets.giantClothesFront) {
            ctx.save();
            ctx.translate(gameState.playerScreenX, gameState.playerScreenY);
            ctx.scale(1, breathScale);
            ctx.translate(-gameState.playerScreenX, -gameState.playerScreenY);
            ctx.drawImage(assets.giantClothesFront, -gameState.mapX, -gameState.mapY, drawW, drawH);
            ctx.restore();
        }
    }

    const boxH = 120, boxY = VIRTUAL_HEIGHT - boxH - 20, boxX = 20, boxW = VIRTUAL_WIDTH - 40;
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)"; 
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(boxX, boxY, boxW, boxH, 15); else ctx.rect(boxX, boxY, boxW, boxH);
    ctx.fill();

    const currentFaceImg = assets[`giant_face_${typeWriter.currentFaceKey.toLowerCase()}`];
    if (currentFaceImg) ctx.drawImage(currentFaceImg, FACE_CUTOUT.x, FACE_CUTOUT.y, FACE_CUTOUT.size, FACE_CUTOUT.size, boxX + 10, boxY + (boxH - 100) / 2, 100, 100);
    
    if (!gameState.isGameOver && typeWriter.showGauge) {
        const key = typeWriter.currentColorKey;
        const messages = COLOR_MESSAGES[key];
        if (messages) {
            const progress = Math.min((messageIndices[key] || 0) / messages.length, 1.0);
            ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; ctx.fillRect(boxX + 20, boxY + boxH - 15, boxW - 40, 6);
            ctx.fillStyle = typeWriter.color || "#000"; ctx.fillRect(boxX + 20, boxY + boxH - 15, (boxW - 40) * progress, 6);
        }
    }

    ctx.font = `bold ${SETTINGS.messageFontSize}px sans-serif`; ctx.textAlign = "left"; ctx.textBaseline = "top";
    ctx.fillStyle = typeWriter.color || "#000000"; 
    const lines = typeWriter.displayText.split('\n');
    lines.forEach((line, i) => {
        const measure = ctx.measureText(line); ctx.save();
        ctx.translate(boxX + SETTINGS.messageTextX, boxY + 25 + (i * SETTINGS.messageFontSize * 1.3));
        if (measure.width > boxW - (SETTINGS.messageTextX + 20)) ctx.scale((boxW - (SETTINGS.messageTextX + 20)) / measure.width, 1);
        ctx.shadowColor = "#FFFFFF"; ctx.shadowBlur = 0; ctx.shadowOffsetX = 1; ctx.shadowOffsetY = 1;
        ctx.fillText(line, 0, 0); ctx.restore();
    });
}

function handleInput(e) {
    if (e.type === 'touchstart') e.preventDefault();
    if (!gameStarted) return;

    if (gameState.isGameOver) {
        if (typeWriter.index < typeWriter.fullText.length) {
            typeWriter.index = typeWriter.fullText.length;
            typeWriter.displayText = typeWriter.fullText;
            return;
        }
        const currentEndMsgs = ENDING_MESSAGES[gameState.currentEndingKey];
        if (currentEndMsgs) {
            gameState.endingMessageIndex++;
            if (gameState.endingMessageIndex < currentEndMsgs.length) {
                const nextMsg = currentEndMsgs[gameState.endingMessageIndex];
                const savedColor = typeWriter.color; 
                startMessage(nextMsg);
                typeWriter.color = savedColor;
            }
        }
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const clientX = (e.type === 'touchstart') ? e.touches[0].clientX : e.clientX;
    const clientY = (e.type === 'touchstart') ? e.touches[0].clientY : e.clientY;
    const touchX = (clientX - rect.left) * (VIRTUAL_WIDTH / rect.width);
    const touchY = (clientY - rect.top) * (VIRTUAL_HEIGHT / rect.height);
    const dx = touchX - gameState.playerScreenX;
    const dy = touchY - gameState.playerScreenY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const drawW = VIRTUAL_WIDTH * SETTINGS.scaleFactor;
    const drawH = drawW / (assets.giantSkin.width / assets.giantSkin.height);
    const currentTerrain = checkCircleTerrain(gameState.mapX, gameState.mapY);
    const isAtBottom = gameState.mapY >= (drawH - gameState.playerScreenY - SETTINGS.hitRadius - 2);
    
    if (isAtBottom && dy > 0) return;
    
    let distanceFactor = Math.min(distance / SETTINGS.maxJumpDistance, 1.0);
    distanceFactor = 0.2 + (distanceFactor * 0.8);
    const angle = Math.atan2(dy, dx);
    let power = SETTINGS.jumpPower * distanceFactor;
    if (currentTerrain.type === TERRAIN.PLATFORM || isAtBottom) power *= SETTINGS.groundedJumpBoost;
    if (dy > 0) power *= SETTINGS.downwardJumpBoost;
    
    gameState.vx = Math.cos(angle) * power;
    gameState.vy = Math.sin(angle) * power;
    gameState.isFlying = true;
    gameState.messageReserved = false; 
}

function gameLoop() { update(); draw(); requestAnimationFrame(gameLoop); }

function initGame() {
    initCanvas();
    maskCanvas.width = assets.mask.width; 
    maskCanvas.height = assets.mask.height;
    maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
    maskCtx.drawImage(assets.mask, 0, 0);
    
    document.getElementById('ui').style.display = 'block';
    resetGame(); 
    gameLoop();
}

let loadedCount = 0;
const totalAssets = Object.keys(assetSources).length;

for (let key in assetSources) {
    assets[key] = new Image();
    assets[key].onload = () => {
        loadedCount++;
        if (loadedCount === totalAssets) {
            document.getElementById('loadingMessage').style.display = 'none';
            const clickEl = document.getElementById('clickToStart');
            clickEl.style.display = 'block';

            document.getElementById('startScreen').addEventListener('click', function() {
                if (!gameStarted) {
                    this.style.opacity = '0';
                    setTimeout(() => this.style.display = 'none', 500);
                    gameStarted = true;
                    initGame();
                }
            });
        }
    };
    assets[key].src = assetSources[key];
}

function fullReset() {
    gameState = {
        vy: 0, vx: 0, playerScreenX: 0, playerScreenY: 0, mapX: 0, mapY: 0,
        score: 0, isGrounded: true, climbAnimTimer: 0, breathTimer: 0,
        isFlying: false, messageReserved: false, messagesShown: 0,
        isGameOver: false,
        currentEndingKey: null,
        playerAnimTimer: 0,
        endingMessageIndex: 0,
        fadeTimer: 0,
        fadePhase: 'NONE',
        pendingEndingKey: null,
        pendingColorKey: 'VOID'
    };
    for (let key in messageIndices) { messageIndices[key] = 0; }
    lastColorKey = 'VOID';
    typeWriter = {
        fullText: "", displayText: "", index: 0, speed: 2, timer: 0, 
        currentFaceKey: "NIYA", color: "#000000", showGauge: false, currentColorKey: 'VOID', originalMsgObj: null
    };
    resetGame();
}

canvas.addEventListener('mousedown', handleInput);
canvas.addEventListener('touchstart', handleInput, {passive: false});
window.addEventListener('resize', initCanvas);