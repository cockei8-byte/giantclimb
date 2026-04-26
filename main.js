// --- 設定、状態、アセット管理は以前のものを維持 ---
// --- 設定 ---
const SETTINGS = {
    // 画像ソースを変更
    giantSkinSrc: 'giant_skin.png',       // 素肌
    giantClothesSrc: 'giant_clothes.png', // 衣服（透過あり）
    maskImageSrc: 'giant_mask.png',       // 当たり判定用（そのまま）
    
    // その他のアセットは維持
    faceImageSrc: 'face.png',
    arrowImageSrc: 'arrow.png',
    playerIdleSrc: 'player_idle.png',
    playerSlideSrc: 'player_slide.png',
    playerJumpSrc: 'player_jump.png',
    playerFallSrc: 'player_fall.png',
    
    // ゲームパラメータ
    scaleFactor: 3,
    climbSpeed: 250,
    slideSpeed: 0.8,
    fallSpeed: 15,
    ease: 0.1,
    arrowRange: Math.PI * 0.8,
    arrowRotationSpeed: 0.05,
    
    // ★追加：服が透ける円の半径（VIRTUAL_WIDTH基準）
    revealRadius: 60 
};

const VIRTUAL_WIDTH = 360;
const VIRTUAL_HEIGHT = 640;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const maskCanvas = document.createElement('canvas');
const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });

let gameState = {
    playerScreenX: 0, playerScreenY: 0, mapX: 0, mapY: 0,
    targetMapX: 0, targetMapY: 0, arrowAngle: Math.PI / 2, arrowDir: 1,
    score: 0, currentMsg: "ふふ、どこまで登れるかな？",
    isGrounded: true, isOnGiant: true, isJumping: false, jumpTimer: 0
};

const assets = {};
const assetSources = {
    giantSkin: SETTINGS.giantSkinSrc,       // 名前変更
    giantClothes: SETTINGS.giantClothesSrc, // 追加
    mask: SETTINGS.maskImageSrc,
    face: SETTINGS.faceImageSrc,
    arrow: SETTINGS.arrowImageSrc,
    pIdle: SETTINGS.playerIdleSrc,
    pSlide: SETTINGS.playerSlideSrc,
    pJump: SETTINGS.playerJumpSrc,
    pFall: SETTINGS.playerFallSrc
};

// --- 関数定義 ---

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
    gameState.playerScreenX = VIRTUAL_WIDTH / 2;
    gameState.playerScreenY = VIRTUAL_HEIGHT * 0.7;
    const startX = (drawW / 2) - gameState.playerScreenX;
    const startY = drawH - gameState.playerScreenY;
    gameState.mapX = startX; gameState.mapY = startY;
    gameState.targetMapX = startX; gameState.targetMapY = startY;
}

function updateMessage(score) {
    if (score < 10) gameState.currentMsg = "ふふ、どこまで登れるかな？";
    else if (score < 100) gameState.currentMsg = "くすぐったいよ、やめておくれ。";
    else if (score < 300) gameState.currentMsg = "おや、そんなところまで。";
    else gameState.currentMsg = "......君、しつこいね。";
}

function draw() {
    ctx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

    const imgRatio = assets.giantSkin.width / assets.giantSkin.height; // giantSkin基準
    const drawW = VIRTUAL_WIDTH * SETTINGS.scaleFactor;
    const drawH = drawW / imgRatio;

    // ---------------------------------------------------------
    // レイヤー1：巨人の素肌（最奥）
    // ---------------------------------------------------------
    ctx.drawImage(assets.giantSkin, -gameState.mapX, -gameState.mapY, drawW, drawH);

    // ---------------------------------------------------------
    // レイヤー2：矢印 (キャラクターの奥)
    // ---------------------------------------------------------
    ctx.save();
    ctx.translate(gameState.playerScreenX, gameState.playerScreenY - 40);
    ctx.rotate(-gameState.arrowAngle + Math.PI/2);
    ctx.drawImage(assets.arrow, -30, -100, 60, 100);
    ctx.restore();

    // ---------------------------------------------------------
    // レイヤー3：プレイヤー
    // ---------------------------------------------------------
    let playerImg = assets.pIdle;
    if (gameState.isJumping) playerImg = assets.pJump;
    else if (!gameState.isGrounded) playerImg = gameState.isOnGiant ? assets.pSlide : assets.pFall;

    const pSize = 100;
    ctx.save();
    ctx.translate(gameState.playerScreenX, gameState.playerScreenY - pSize/2);
    if (gameState.isJumping) {
        gameState.jumpTimer += 0.3;
        ctx.rotate(-gameState.jumpTimer);
    }
    ctx.drawImage(playerImg, -pSize/2, -pSize/2, pSize, pSize);
    ctx.restore();

    // ---------------------------------------------------------
    // レイヤー4：巨人の衣服（最前面） ＋ ★マスク処理
    // ---------------------------------------------------------
    ctx.save(); // 服描画レイヤー用の状態保存

    // ★重要：クリッピング（切り抜き）パスを作成
    ctx.beginPath();
    // 画面全体を覆う四角形を描画
    ctx.rect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
    
    // 主人公を中心とした円を描画。
    // 最後の引数 'true' は反時計回りを意味し、これが「外側の四角形」と組み合わさることで、
    // 円の部分だけを「くり抜く（パスから除外する）」効果を生みます。
    ctx.arc(gameState.playerScreenX, gameState.playerScreenY - pSize/2, SETTINGS.revealRadius, 0, Math.PI * 2, true);
    
    // これをクリッピングパスとして設定。以降の描画はこのパスの中（くり抜かれた円の外）だけに限定される。
    ctx.clip(); 

    // 服を描画。円の部分だけが自動的に描画されないため、「服が透けて下の肌とキャラが見える」状態になる。
    ctx.drawImage(assets.giantClothes, -gameState.mapX, -gameState.mapY, drawW, drawH);

    ctx.restore(); // クリッピング状態を解除（これをしないとメッセージボックスもくり抜かれる）

    // ---------------------------------------------------------
    // レイヤー5：メッセージボックス（Canvas統一版のもの）
    // ---------------------------------------------------------
    // ...（以前のメッセージボックス描画コードをここに記述。顔画像、テキスト含む）...
    
    // 参考（以前のコード）：
    const boxH = 120;
    const boxY = VIRTUAL_HEIGHT - boxH - 20;
    const boxX = 20;
    const boxW = VIRTUAL_WIDTH - 40;
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.beginPath(); ctx.roundRect(boxX, boxY, boxW, boxH, 15); ctx.fill();
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
    ctx.drawImage(assets.face, boxX - 10, boxY - 20, 130, 130);
    ctx.fillStyle = "#fff"; ctx.font = "bold 18px sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
    const textX = boxX + 110; ctx.fillText(gameState.currentMsg, textX, boxY + boxH/2, boxW - 130);
}

// 共通のupdate、gameLoop、handleInputなどはそのまま継続
function update() {
    const imgRatio = assets.giantSkin.width / assets.giantSkin.height;
    const drawW = VIRTUAL_WIDTH * SETTINGS.scaleFactor;
    const drawH = drawW / imgRatio;

    gameState.mapX += (gameState.targetMapX - gameState.mapX) * SETTINGS.ease;
    gameState.mapY += (gameState.targetMapY - gameState.mapY) * SETTINGS.ease;
    gameState.isJumping = gameState.targetMapY < gameState.mapY - 2;

    gameState.isOnGiant = checkOnGiant();
    const gravity = gameState.isOnGiant ? SETTINGS.slideSpeed : SETTINGS.fallSpeed;
    gameState.mapY += gravity;
    gameState.targetMapY += gravity;

    const maxY = drawH - gameState.playerScreenY;
    if (gameState.mapY >= maxY) {
        gameState.mapY = maxY; gameState.targetMapY = maxY;
        gameState.isGrounded = true;
    } else {
        gameState.isGrounded = false;
    }

    gameState.arrowAngle += SETTINGS.arrowRotationSpeed * gameState.arrowDir;
    if (Math.abs(gameState.arrowAngle - Math.PI/2) > SETTINGS.arrowRange/2) gameState.arrowDir *= -1;

    gameState.score = Math.max(0, Math.floor((drawH - gameState.mapY - gameState.playerScreenY) / 10));
    scoreEl.innerText = gameState.score;
    updateMessage(gameState.score);
}

function checkOnGiant() {
    const pixelX = gameState.mapX + gameState.playerScreenX;
    const pixelY = gameState.mapY + gameState.playerScreenY;
    const drawW = VIRTUAL_WIDTH * SETTINGS.scaleFactor;
    const scale = assets.mask.width / drawW;
    const checkX = pixelX * scale; const checkY = pixelY * scale;
    if (checkX < 0 || checkX > assets.mask.width || checkY < 0 || checkY > assets.mask.height) return false;
    const pixel = maskCtx.getImageData(checkX, checkY, 1, 1).data;
    return pixel[0] < 128;
}

function gameLoop() { update(); draw(); requestAnimationFrame(gameLoop); }

function handleInput(e) {
    if (e.type === 'touchstart') e.preventDefault();
    gameState.targetMapX += Math.cos(gameState.arrowAngle) * SETTINGS.climbSpeed;
    gameState.targetMapY -= Math.sin(gameState.arrowAngle) * SETTINGS.climbSpeed;
    gameState.jumpTimer = 0;
    const drawW = VIRTUAL_WIDTH * SETTINGS.scaleFactor;
    gameState.targetMapX = Math.max(0, Math.min(drawW - VIRTUAL_WIDTH, gameState.targetMapX));
}

function initGame() {
    initCanvas();
    maskCanvas.width = assets.mask.width; maskCanvas.height = assets.mask.height;
    maskCtx.drawImage(assets.mask, 0, 0);
    resetGame(); gameLoop();
}

let loadedCount = 0;
const totalAssets = Object.keys(assetSources).length;
for (let key in assetSources) {
    assets[key] = new Image();
    assets[key].onload = () => { if (++loadedCount === totalAssets) initGame(); };
    assets[key].src = assetSources[key];
}

canvas.addEventListener('mousedown', handleInput);
canvas.addEventListener('touchstart', handleInput, {passive: false});
window.addEventListener('resize', initCanvas);
