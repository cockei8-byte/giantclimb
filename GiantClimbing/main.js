// --- 設定、状態、アセット管理は以前のものを維持 ---
const SETTINGS = {
    giantImageSrc: 'giant.png', maskImageSrc: 'giant_mask.png',
    faceImageSrc: 'face.png', arrowImageSrc: 'arrow.png',
    playerIdleSrc: 'player_idle.png', playerSlideSrc: 'player_slide.png',
    playerJumpSrc: 'player_jump.png', playerFallSrc: 'player_fall.png',
    scaleFactor: 3, climbSpeed: 250, slideSpeed: 0.8, fallSpeed: 15,
    ease: 0.1, arrowRange: Math.PI * 0.8, arrowRotationSpeed: 0.05
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
    giant: SETTINGS.giantImageSrc, mask: SETTINGS.maskImageSrc,
    face: SETTINGS.faceImageSrc, arrow: SETTINGS.arrowImageSrc,
    pIdle: SETTINGS.playerIdleSrc, pSlide: SETTINGS.playerSlideSrc,
    pJump: SETTINGS.playerJumpSrc, pFall: SETTINGS.playerFallSrc
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
    const imgRatio = assets.giant.width / assets.giant.height;
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
    const imgRatio = assets.giant.width / assets.giant.height;
    const drawW = VIRTUAL_WIDTH * SETTINGS.scaleFactor;
    const drawH = drawW / imgRatio;

    // 1. 背景
    ctx.drawImage(assets.giant, -gameState.mapX, -gameState.mapY, drawW, drawH);

    // 2. 矢印 (キャラクターの奥)
    ctx.save();
    ctx.translate(gameState.playerScreenX, gameState.playerScreenY - 40);
    ctx.rotate(-gameState.arrowAngle + Math.PI/2);
    ctx.drawImage(assets.arrow, -30, -100, 60, 100);
    ctx.restore();

    // 3. プレイヤー (ジャンプ中は反時計回りに高速回転)
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

    // 4. メッセージボックス一式の描画 (最前面に一括管理)
    const boxH = 120;
    const boxY = VIRTUAL_HEIGHT - boxH - 20;
    const boxX = 20;
    const boxW = VIRTUAL_WIDTH - 40;

    // 半透明の背景
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 15);
    ctx.fill();
    // 枠線
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 顔画像 (ボックスの左端からはみ出すように配置)
    const faceSize = 130;
    ctx.drawImage(assets.face, boxX - 10, boxY - 20, faceSize, faceSize);

    // テキスト (顔画像と被らない位置から開始)
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    // テキストを折り返し表示（簡易版）
    const textX = boxX + 110;
    ctx.fillText(gameState.currentMsg, textX, boxY + boxH/2, boxW - 130);
}

// 共通のupdate、gameLoop、handleInputなどはそのまま継続
function update() {
    const imgRatio = assets.giant.width / assets.giant.height;
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