import fs from 'fs';
import { spawn } from 'child_process';

const delay = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log("Launching headless Chrome...");
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new",
    "--disable-gpu",
    "--remote-debugging-port=9222",
    "--window-size=1280,720",
    "http://localhost:5001/"
  ]);

  await delay(2000);

  try {
    const tabsResp = await fetch("http://localhost:9222/json");
    const tabs = await tabsResp.json();
    const gameTab = tabs.find(t => t.url.includes("5001"));
    if (!gameTab) {
      throw new Error("Could not find game tab: " + JSON.stringify(tabs));
    }

    const ws = new WebSocket(gameTab.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        const onMessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.id === id) {
            ws.removeEventListener('message', onMessage);
            if (data.error) {
              reject(new Error(`CDP Error (${method}): ${JSON.stringify(data.error)}`));
            } else {
              resolve(data.result);
            }
          }
        };
        ws.addEventListener('message', onMessage);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    async function evaluate(fnStr) {
      const res = await send('Runtime.evaluate', {
        expression: `(${fnStr})()`,
        returnByValue: true,
        awaitPromise: true
      });
      return res.result ? res.result.value : null;
    }

    async function captureCanvas(filename) {
      const dataUrl = await evaluate(`() => {
        const canvas = document.querySelector('canvas');
        return canvas ? canvas.toDataURL('image/png') : null;
      }`);
      if (!dataUrl) throw new Error("No canvas found");
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
      fs.writeFileSync(filename, Buffer.from(base64Data, 'base64'));
      console.log(`Saved canvas screenshot: ${filename}`);
    }

    async function captureViewport(filename) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(filename, Buffer.from(res.data, 'base64'));
      console.log(`Saved viewport screenshot: ${filename}`);
    }

    await delay(1000);
    console.log("Configuring game settings...");

    // Setup LocalStorage with rich state
    await evaluate(`() => {
      localStorage.setItem('lion-lucky-run-highscore', '280');
      localStorage.setItem('lion-lucky-run-color', 'red');
      localStorage.setItem('lion-lucky-run-difficulty', 'normal');
      localStorage.setItem('lion-lucky-run-stickers', JSON.stringify([
        'sticker_lion_head',
        'sticker_lantern',
        'sticker_orange',
        'sticker_gold_ingot'
      ]));
      return true;
    }`);

    // --- 1. MENU SCENE ---
    console.log("Capturing Menu Scene with High Score...");
    await evaluate(`() => {
      window.location.reload();
    }`);
    await delay(1500);
    
    await evaluate(`() => {
      const game = window.__PHASER_GAME__;
      const scene = game.scene.getScene('MenuScene');
      if (scene) {
        scene.children.list.forEach(c => {
          if (c.text && c.text.includes('Best Score:')) {
            c.setText('🏆 Best Score: 280');
          }
        });
      }
    }`);
    await delay(300);
    await captureCanvas('media/screenshots/screenshot-menu-selection.png');

    // --- 2. GAMEPLAY SCENE ---
    console.log("Setting up and capturing Gameplay Scene...");
    await evaluate(`() => {
      const game = window.__PHASER_GAME__;
      game.scene.stop('MenuScene');
      game.scene.stop('ResultsScene');
      game.scene.start('GameScene');
    }`);
    await delay(800);

    await evaluate(`() => {
      const game = window.__PHASER_GAME__;
      const scene = game.scene.getScene('GameScene');
      
      if (scene.spawner && scene.spawner.spawnTimer) scene.spawner.spawnTimer.remove();
      if (scene.spawner && scene.spawner.obstacleTimer) scene.spawner.obstacleTimer.remove();
      if (scene.spawner && scene.spawner.getGroup()) scene.spawner.getGroup().clear(true, true);

      scene.background.setTexture('bg_sky');
      scene.score = 180;
      scene.scoreText.setText('Score: 180');
      scene.highScoreText.setText('Best: 280');
      
      scene.fortuneSystem.resetFortune();
      scene.fortuneSystem.addFortune(65);

      scene.player.setPosition(280, 360);
      scene.player.targetX = 280;
      scene.player.targetY = 360;

      const group = scene.spawner.getGroup();
      
      const orange = group.create(470, 270, 'orange');
      orange.setScale(0.2).setDepth(10);
      orange.preFX?.addGlow(0xffd700, 3, 0, false, 0.1, 15);

      const hongbao = group.create(630, 430, 'hongbao');
      hongbao.setScale(0.2).setDepth(10);
      hongbao.preFX?.addGlow(0xffd700, 3, 0, false, 0.1, 15);

      const lantern = group.create(790, 260, 'lantern');
      lantern.setScale(0.2).setDepth(10);
      lantern.preFX?.addGlow(0xffd700, 3, 0, false, 0.1, 15);

      const firecracker = group.create(950, 420, 'firecracker');
      firecracker.setScale(0.2).setDepth(10);
      firecracker.preFX?.addGlow(0xffd700, 3, 0, false, 0.1, 15);

      const ghost = group.create(1100, 290, 'ghost');
      ghost.setScale(0.13).setDepth(10);
      ghost.preFX?.addGlow(0xff2200, 3, 0, false, 0.1, 15);

      const stone = group.create(1210, 500, 'stone');
      stone.setScale(0.2).setDepth(10);
      stone.preFX?.addGlow(0xff2200, 3, 0, false, 0.1, 15);
    }`);

    await delay(600);
    await captureCanvas('media/screenshots/screenshot-gameplay-action.png');

    // --- 3. LUCKY BURST SCENE ---
    console.log("Setting up and capturing Lucky Burst Scene...");
    await evaluate(`() => {
      const game = window.__PHASER_GAME__;
      const scene = game.scene.getScene('GameScene');

      scene.background.setTexture('bg_rainbow');
      scene.score = 350;
      scene.scoreText.setText('Score: 350');
      scene.highScoreText.setText('Best: 280');
      
      scene.fortuneSystem.resetFortune();
      scene.fortuneSystem.addFortune(100);

      scene.player.setPosition(320, 360);
      scene.player.targetX = 320;
      scene.player.targetY = 360;

      scene.add.text(640, 55, '⭐ LUCKY BURST! INVINCIBLE MODE ⭐', {
        fontSize: '36px',
        color: '#ffd700',
        stroke: '#8b0000',
        strokeThickness: 6,
        fontStyle: 'bold'
      }).setOrigin(0.5).setDepth(200);

      const group = scene.spawner.getGroup();
      group.clear(true, true);

      const items = ['hongbao', 'orange', 'lantern', 'firecracker', 'orange', 'hongbao'];
      items.forEach((itemKey, idx) => {
        const item = group.create(480 + idx * 125, 330 + (idx % 2 === 0 ? -45 : 45), itemKey);
        item.setScale(0.2).setDepth(10);
        item.preFX?.addGlow(0xffd700, 3, 0, false, 0.1, 15);
      });
    }`);

    await delay(600);
    await captureCanvas('media/screenshots/screenshot-lucky-burst.png');

    // --- 4. RESULTS SCENE ---
    console.log("Setting up and capturing Results Scene...");
    await evaluate(`() => {
      const game = window.__PHASER_GAME__;
      game.scene.stop('GameScene');
      game.scene.start('ResultsScene', { score: 350 });
    }`);
    await delay(1200);
    await captureCanvas('media/screenshots/screenshot-results-stickers.png');

    // --- 5. MOBILE LANDSCAPE VIEWPORT ---
    console.log("Configuring mobile landscape emulation (844x390 @2x)...");
    await send('Emulation.setDeviceMetricsOverride', {
      width: 844,
      height: 390,
      deviceScaleFactor: 2,
      mobile: true,
      screenOrientation: { angle: 90, type: 'landscapePrimary' }
    });
    
    // Start gameplay on mobile landscape
    await evaluate(`() => {
      const game = window.__PHASER_GAME__;
      game.scene.stop('ResultsScene');
      game.scene.start('GameScene');
    }`);
    await delay(1000);

    await evaluate(`() => {
      const game = window.__PHASER_GAME__;
      const scene = game.scene.getScene('GameScene');
      
      if (scene.spawner && scene.spawner.spawnTimer) scene.spawner.spawnTimer.remove();
      if (scene.spawner && scene.spawner.obstacleTimer) scene.spawner.obstacleTimer.remove();

      scene.score = 160;
      scene.scoreText.setText('Score: 160');
      scene.highScoreText.setText('Best: 280');
      
      scene.fortuneSystem.resetFortune();
      scene.fortuneSystem.addFortune(60);

      scene.player.setPosition(270, 360);
      scene.player.targetX = 270;
      scene.player.targetY = 360;

      const group = scene.spawner.getGroup();
      group.clear(true, true);

      const orange = group.create(460, 270, 'orange');
      orange.setScale(0.2).setDepth(10);
      orange.preFX?.addGlow(0xffd700, 3, 0, false, 0.1, 15);

      const hongbao = group.create(620, 430, 'hongbao');
      hongbao.setScale(0.2).setDepth(10);
      hongbao.preFX?.addGlow(0xffd700, 3, 0, false, 0.1, 15);

      const lantern = group.create(780, 260, 'lantern');
      lantern.setScale(0.2).setDepth(10);
      lantern.preFX?.addGlow(0xffd700, 3, 0, false, 0.1, 15);

      const ghost = group.create(960, 360, 'ghost');
      ghost.setScale(0.13).setDepth(10);
      ghost.preFX?.addGlow(0xff2200, 3, 0, false, 0.1, 15);

      const stone = group.create(1100, 490, 'stone');
      stone.setScale(0.2).setDepth(10);
      stone.preFX?.addGlow(0xff2200, 3, 0, false, 0.1, 15);
    }`);
    await delay(600);
    await captureViewport('media/screenshots/screenshot-mobile-landscape.png');

    // --- 6. MOBILE PORTRAIT VIEWPORT ---
    console.log("Configuring mobile portrait emulation (390x844 @2x)...");
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
      screenOrientation: { angle: 0, type: 'portraitPrimary' }
    });
    await delay(600);
    await captureViewport('media/screenshots/screenshot-mobile-portrait.png');

    // Reset emulation
    await send('Emulation.clearDeviceMetricsOverride');

    ws.close();
    console.log("All screenshots captured successfully!");
  } finally {
    chrome.kill();
  }
}

main().catch(err => {
  console.error("Error running script:", err);
  process.exit(1);
});
