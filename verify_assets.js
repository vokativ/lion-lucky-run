
const fs = require('fs');
const path = require('path');

// Ensure directories exist
const dirs = [
    'public/assets/backgrounds/mobile',
    'public/assets/backgrounds/laptop',
    'public/assets/backgrounds/4k'
];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

const backgrounds = [
    { name: 'bg_sky', color: '#87CEEB' },
    { name: 'bg_forest', color: '#228B22' },
    { name: 'bg_rainbow', color: '#FF69B4' },
    { name: 'bg_singapore', color: '#FF4500' },
    { name: 'bg_dragon', color: '#8B0000' },
    { name: 'bg_legend', color: '#4B0082' }
];

// Helper to create a simple SVG
function createSVG(width, height, color, name) {
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${color}"/>
        <text x="50%" y="50%" font-family="Arial" font-size="40" fill="white" text-anchor="middle" dominant-baseline="middle">${name}</text>
    </svg>`;
}

backgrounds.forEach(bg => {
    // Generate SVGs
    // Note: Phaser can load SVG directly, but user code expects .png. 
    // Wait, Phaser CAN load SVG. The current code in BootScene says:
    // this.load.image(bg, `assets/backgrounds/${assetFolder}/${bg}.png`);
    // I should change BootScene to load .svg if I generate SVGs, OOOOR
    // I can just change the user code to look for .svg. 
    // OR I can rename .svg to .png? No that fails.

    // Actually, simply copying the existing ones from public/assets/backgrounds to the subfolders?
    // Wait, I saw "bg_sky.png" in public/assets/backgrounds earlier! 
    // Step 205: {"name":"bg_sky.png","sizeBytes":"50787"}
    // The user code looks for `assets/backgrounds/${assetFolder}/${bg}.png`
    // So I should just COPY the existing pngs into the required subfolders if they don't exist there.
    // The previous ls showed subfolders mobile/laptop/4k.
    // Let's check if they have files.

    // Changing strategy: This script will just copy the main files into the subfolders if empty.
});
