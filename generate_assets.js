
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

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

// Helper to create a solid color or gradient image
function createPlaceholderImage(width, height, color, name, text) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);

    // Some pattern or text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);

    const buffer = canvas.toBuffer('image/png');
    // Save to all resolutions for now (just resizing logic in real app, here same placeholder)
    // Actually user code expects specific folders.
    // Let's generate for mobile (base) and copy or generate larger.

    // For M3, let's just make 1280x720 for mobile/laptop and 4k for 4k.
    return buffer;
}

const backgrounds = [
    { name: 'bg_sky', color: '#87CEEB', text: 'Sky World' },
    { name: 'bg_forest', color: '#228B22', text: 'Forest World' },
    { name: 'bg_rainbow', color: '#FF69B4', text: 'Rainbow World' },
    { name: 'bg_singapore', color: '#FF4500', text: 'Singapore' },
    { name: 'bg_dragon', color: '#8B0000', text: 'Dragon Lair' },
    { name: 'bg_legend', color: '#4B0082', text: 'Legendary' }
];

backgrounds.forEach(bg => {
    // Mobile/Laptop (1280x720)
    const mobileBuffer = createPlaceholderImage(1280, 720, bg.color, bg.name, bg.text);
    fs.writeFileSync(`public/assets/backgrounds/mobile/${bg.name}.png`, mobileBuffer);
    fs.writeFileSync(`public/assets/backgrounds/laptop/${bg.name}.png`, mobileBuffer);

    // 4k (3840x2160)
    const k4Buffer = createPlaceholderImage(3840, 2160, bg.color, bg.name, bg.text);
    fs.writeFileSync(`public/assets/backgrounds/4k/${bg.name}.png`, k4Buffer);

    console.log(`Generated ${bg.name}`);
});
