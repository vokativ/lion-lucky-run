import os, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

os.makedirs("media/itch", exist_ok=True)
os.makedirs("media/screenshots", exist_ok=True)

def draw_text_with_effects(draw, pos, text, font, fill_color, outline_color, outline_width=4, shadow_color=(0, 0, 0, 180), shadow_offset=(4, 4), align="center", anchor=None):
    x, y = pos
    if shadow_color:
        sx, sy = shadow_offset
        for ox in range(-outline_width, outline_width + 1):
            for oy in range(-outline_width, outline_width + 1):
                draw.text((x + sx + ox, y + sy + oy), text, font=font, fill=shadow_color, align=align, anchor=anchor)
                
    if outline_width > 0:
        for ox in range(-outline_width, outline_width + 1):
            for oy in range(-outline_width, outline_width + 1):
                if ox * ox + oy * oy <= outline_width * outline_width:
                    draw.text((x + ox, y + oy), text, font=font, fill=outline_color, align=align, anchor=anchor)
                    
    draw.text((x, y), text, font=font, fill=fill_color, align=align, anchor=anchor)

def load_cropped_sprite(path, target_height=None, target_width=None):
    img = Image.open(path).convert("RGBA")
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    if target_height:
        aspect = img.width / img.height
        w = int(target_height * aspect)
        img = img.resize((w, target_height), Image.Resampling.LANCZOS)
    elif target_width:
        aspect = img.height / img.width
        h = int(target_width * aspect)
        img = img.resize((target_width, h), Image.Resampling.LANCZOS)
    return img

# -------------------------------------------------------------
# 1. BUILD ITCH.IO COVER IMAGE (630x500 & 1260x1000 @2x)
# -------------------------------------------------------------
def build_itch_cover():
    print("Generating Itch.io Cover Image (1260x1000 @2x)...")
    W, H = 1260, 1000
    
    bg = load_cropped_sprite("public/assets/backgrounds/4k/bg_rainbow.png", target_width=W)
    bg = bg.resize((W, H), Image.Resampling.LANCZOS)
    
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d_overlay = ImageDraw.Draw(overlay)
    
    for y in range(320):
        alpha = int(190 * (1 - y / 320.0))
        d_overlay.rectangle([(0, y), (W, y + 1)], fill=(139, 0, 0, alpha))
        
    for y in range(H - 240, H):
        alpha = int(220 * ((y - (H - 240)) / 240.0))
        d_overlay.rectangle([(0, y), (W, y + 1)], fill=(20, 10, 30, alpha))
        
    bg = Image.alpha_composite(bg, overlay)
    
    # Load sprites
    lion = load_cropped_sprite("public/assets/sprites/lion.png", target_height=360)
    lion_golden = load_cropped_sprite("public/assets/sprites/lion_golden.png", target_height=260)
    
    orange = load_cropped_sprite("public/assets/sprites/orange.png", target_height=170)
    hongbao = load_cropped_sprite("public/assets/sprites/hongbao.png", target_height=200)
    lantern = load_cropped_sprite("public/assets/sprites/lantern.png", target_height=220)
    firecracker = load_cropped_sprite("public/assets/sprites/firecracker.png", target_height=190)
    ghost = load_cropped_sprite("public/assets/sprites/ghost.png", target_height=170)
    stone = load_cropped_sprite("public/assets/sprites/stone.png", target_height=150)
    
    # Place main Red Lion on left-center
    bg.paste(lion, (140, 360), lion)
    
    # Place Golden Lion on right-center (bursting aura)
    bg.paste(lion_golden, (900, 420), lion_golden)
    
    # Floating festive items around
    bg.paste(lantern.rotate(12, expand=True), (560, 290), lantern.rotate(12, expand=True))
    bg.paste(hongbao.rotate(-15, expand=True), (520, 520), hongbao.rotate(-15, expand=True))
    bg.paste(orange.rotate(10, expand=True), (720, 440), orange.rotate(10, expand=True))
    bg.paste(firecracker.rotate(-20, expand=True), (740, 640), firecracker.rotate(-20, expand=True))
    
    bg.paste(ghost.rotate(10, expand=True), (1060, 260), ghost.rotate(10, expand=True))
    bg.paste(stone.rotate(-10, expand=True), (380, 650), stone.rotate(-10, expand=True))
    bg.paste(lantern.rotate(-10, expand=True), (40, 200), lantern.rotate(-10, expand=True))
    
    draw = ImageDraw.Draw(bg)
    font_title = ImageFont.truetype("/System/Library/Fonts/Supplemental/Impact.ttf", 114)
    font_sub = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 36)
    font_badge = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 26)
    
    draw_text_with_effects(
        draw, (W // 2, 95),
        "LION LUCKY RUN",
        font_title,
        fill_color="#FFE600",
        outline_color="#8B0000",
        outline_width=10,
        shadow_color=(0, 0, 0, 230),
        shadow_offset=(6, 8),
        anchor="mm"
    )
    
    draw_text_with_effects(
        draw, (W // 2, 175),
        "A LUNAR NEW YEAR ENDLESS RUNNER",
        font_sub,
        fill_color="#FFFFFF",
        outline_color="#8B0000",
        outline_width=5,
        shadow_color=(0, 0, 0, 200),
        shadow_offset=(4, 4),
        anchor="mm"
    )
    
    badge_bg_rect = [(W // 2 - 460, H - 95), (W // 2 + 460, H - 35)]
    draw.rounded_rectangle(badge_bg_rect, radius=20, fill=(0, 0, 0, 210), outline="#FFD700", width=3)
    draw.text((W // 2, H - 65), "PLAY IN BROWSER  •  TOUCH & KEYBOARD  •  100% FREE", font=font_badge, fill="#FFD700", anchor="mm")
    
    bg_2x = bg.convert("RGB")
    bg_2x.save("media/itch/itch-cover-2x.png", "PNG", quality=95)
    
    bg_1x = bg_2x.resize((630, 500), Image.Resampling.LANCZOS)
    bg_1x.save("media/itch/itch-cover.png", "PNG", quality=95)
    print("Saved media/itch/itch-cover.png (630x500) and itch-cover-2x.png (1260x1000)")

# -------------------------------------------------------------
# 2. BUILD ITCH.IO BANNER (960x400 & 1920x800 @2x)
# -------------------------------------------------------------
def build_itch_banner():
    print("Generating Itch.io Banner Header (1920x800 @2x)...")
    W, H = 1920, 800
    
    bg = load_cropped_sprite("public/assets/backgrounds/4k/bg_dragon.png", target_width=W)
    bg = bg.resize((W, H), Image.Resampling.LANCZOS)
    
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d_overlay = ImageDraw.Draw(overlay)
    
    d_overlay.rectangle([(0, 0), (W, H)], fill=(20, 5, 5, 80))
    for y in range(280):
        alpha = int(160 * (1 - y / 280.0))
        d_overlay.rectangle([(0, y), (W, y + 1)], fill=(139, 0, 0, alpha))
        
    bg = Image.alpha_composite(bg, overlay)
    
    # 4 Lions Parade across bottom
    lion_blue = load_cropped_sprite("public/assets/sprites/lion_blue.png", target_height=260)
    lion_jade = load_cropped_sprite("public/assets/sprites/lion_jade.png", target_height=260)
    lion_red = load_cropped_sprite("public/assets/sprites/lion.png", target_height=310)
    lion_golden = load_cropped_sprite("public/assets/sprites/lion_golden.png", target_height=310)
    
    bg.paste(lion_blue, (100, 450), lion_blue)
    bg.paste(lion_jade, (400, 440), lion_jade)
    bg.paste(lion_red, (700, 400), lion_red)
    bg.paste(lion_golden, (1500, 400), lion_golden)
    
    lantern = load_cropped_sprite("public/assets/sprites/lantern.png", target_height=180)
    hongbao = load_cropped_sprite("public/assets/sprites/hongbao.png", target_height=180)
    orange = load_cropped_sprite("public/assets/sprites/orange.png", target_height=160)
    firecracker = load_cropped_sprite("public/assets/sprites/firecracker.png", target_height=170)
    
    bg.paste(lantern, (1030, 360), lantern)
    bg.paste(hongbao, (1160, 470), hongbao)
    bg.paste(orange, (1280, 440), orange)
    bg.paste(firecracker, (1380, 500), firecracker)
    
    draw = ImageDraw.Draw(bg)
    font_title = ImageFont.truetype("/System/Library/Fonts/Supplemental/Impact.ttf", 116)
    font_sub = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 38)
    
    draw_text_with_effects(
        draw, (W // 2, 115),
        "LION TRAIN LUCKY RUN",
        font_title,
        fill_color="#FFE600",
        outline_color="#8B0000",
        outline_width=9,
        shadow_color=(0, 0, 0, 230),
        shadow_offset=(6, 6),
        anchor="mm"
    )
    
    draw_text_with_effects(
        draw, (W // 2, 210),
        "Endless Runner  •  Lunar New Year Festivities  •  Procedural Web Audio",
        font_sub,
        fill_color="#FFFFFF",
        outline_color="#660000",
        outline_width=5,
        shadow_color=(0, 0, 0, 200),
        shadow_offset=(4, 4),
        anchor="mm"
    )
    
    bg_2x = bg.convert("RGB")
    bg_2x.save("media/itch/itch-banner-2x.png", "PNG", quality=95)
    
    bg_1x = bg_2x.resize((960, 400), Image.Resampling.LANCZOS)
    bg_1x.save("media/itch/itch-banner.png", "PNG", quality=95)
    print("Saved media/itch/itch-banner.png (960x400) and itch-banner-2x.png (1920x800)")

# -------------------------------------------------------------
# 3. BUILD ITCH.IO AVATAR / ICON (500x500)
# -------------------------------------------------------------
def build_itch_avatar():
    print("Generating Itch.io Avatar / Game Icon (500x500)...")
    W, H = 500, 500
    
    bg = Image.new("RGBA", (W, H), (139, 0, 0, 255))
    d_bg = ImageDraw.Draw(bg)
    
    for r in range(250, 0, -1):
        ratio = r / 250.0
        red = int(170 + 85 * (1 - ratio))
        green = int(15 + 35 * (1 - ratio))
        blue = int(15 + 20 * (1 - ratio))
        d_bg.ellipse([(250 - r, 250 - r), (250 + r, 250 + r)], fill=(red, green, blue, 255))
        
    d_bg.ellipse([(14, 14), (486, 486)], outline="#FFD700", width=12)
    d_bg.ellipse([(24, 24), (476, 476)], outline="#FFE600", width=4)
    
    lion = load_cropped_sprite("public/assets/sprites/lion.png", target_height=330)
    bg.paste(lion, ((W - lion.width) // 2, 45), lion)
    
    d_bg.rounded_rectangle([(65, 385), (435, 455)], radius=18, fill=(0, 0, 0, 210), outline="#FFD700", width=3)
    
    font_avatar = ImageFont.truetype("/System/Library/Fonts/Supplemental/Impact.ttf", 36)
    draw_text_with_effects(
        d_bg, (250, 420),
        "LUCKY RUN",
        font_avatar,
        fill_color="#FFE600",
        outline_color="#8B0000",
        outline_width=4,
        shadow_color=(0, 0, 0, 220),
        shadow_offset=(2, 2),
        anchor="mm"
    )
    
    bg.convert("RGB").save("media/itch/itch-avatar.png", "PNG")
    bg.convert("RGB").save("media/screenshots/icon.png", "PNG")
    print("Saved media/itch/itch-avatar.png and media/screenshots/icon.png (500x500)")

# -------------------------------------------------------------
# 4. BUILD RESPONSIVE DEVICE SHOWCASE (1600x900)
# -------------------------------------------------------------
def build_responsive_showcase():
    print("Generating Responsive Device Showcase (1600x900)...")
    W, H = 1600, 900
    
    canvas = Image.new("RGBA", (W, H), (18, 22, 30, 255))
    d = ImageDraw.Draw(canvas)
    
    font_head = ImageFont.truetype("/System/Library/Fonts/Supplemental/Impact.ttf", 54)
    font_sub = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 24)
    font_label = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 26)
    font_desc = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 18)
    
    draw_text_with_effects(
        d, (W // 2, 55),
        "CROSS-PLATFORM & FULLY RESPONSIVE",
        font_head,
        fill_color="#FFE600",
        outline_color="#8B0000",
        outline_width=5,
        shadow_color=(0, 0, 0, 220),
        shadow_offset=(4, 4),
        anchor="mm"
    )
    
    d.text((W // 2, 102), "Smooth 60 FPS gameplay on Desktop, Chromebooks, Tablets, and Smartphones", font=font_sub, fill="#C0D0E0", anchor="mm")
    
    # 1. Desktop Mockup (Left Side)
    desk_x, desk_y = 70, 150
    desk_w, desk_h = 920, 540
    
    d.rounded_rectangle([(desk_x, desk_y), (desk_x + desk_w, desk_y + desk_h)], radius=14, fill=(35, 40, 50, 255), outline=(70, 80, 100, 255), width=2)
    d.rounded_rectangle([(desk_x, desk_y), (desk_x + desk_w, desk_y + 40)], radius=14, fill=(45, 52, 65, 255))
    d.rectangle([(desk_x, desk_y + 25), (desk_x + desk_w, desk_y + 40)], fill=(45, 52, 65, 255))
    
    d.ellipse([(desk_x + 18, desk_y + 14), (desk_x + 30, desk_y + 26)], fill="#FF5F56")
    d.ellipse([(desk_x + 38, desk_y + 14), (desk_x + 50, desk_y + 26)], fill="#FFBD2E")
    d.ellipse([(desk_x + 58, desk_y + 14), (desk_x + 70, desk_y + 26)], fill="#27C93F")
    
    d.rounded_rectangle([(desk_x + 100, desk_y + 8), (desk_x + desk_w - 30, desk_y + 32)], radius=8, fill=(25, 30, 40, 255))
    d.text((desk_x + 120, desk_y + 20), "https://vokativ.itch.io/lion-lucky-run", font=font_desc, fill="#A0B0C0", anchor="lm")
    
    gameplay_shot = Image.open("media/screenshots/screenshot-gameplay-action.png").convert("RGBA")
    gameplay_scaled = gameplay_shot.resize((desk_w - 8, desk_h - 48), Image.Resampling.LANCZOS)
    canvas.paste(gameplay_scaled, (desk_x + 4, desk_y + 44))
    
    d.text((desk_x + desk_w // 2, desk_y + desk_h + 35), "Desktop / Web Browser (16:9 Landscape)", font=font_label, fill="#FFFFFF", anchor="mm")
    d.text((desk_x + desk_w // 2, desk_y + desk_h + 70), "Arrow Keys / WASD Controls  •  Fullscreen Support  •  1280x720 Native Canvas", font=font_desc, fill="#9FB5CC", anchor="mm")
    
    # 2. Mobile Mockup (Right Side)
    mob_x, mob_y = 1080, 140
    mob_w, mob_h = 340, 680
    
    phone_body = Image.new("RGBA", (mob_w, mob_h), (25, 25, 30, 255))
    d_phone = ImageDraw.Draw(phone_body)
    
    d_phone.rounded_rectangle([(0, 0), (mob_w - 1, mob_h - 1)], radius=45, fill=(20, 20, 25, 255), outline=(90, 95, 110, 255), width=4)
    
    screen_x, screen_y = 12, 14
    screen_w, screen_h = mob_w - 24, mob_h - 28
    
    mob_screen = Image.new("RGBA", (screen_w, screen_h), (135, 206, 235, 255))
    
    gameplay_mob = gameplay_shot.resize((screen_w, int(screen_w * 720 / 1280)), Image.Resampling.LANCZOS)
    mob_screen.paste(gameplay_mob, (0, (screen_h - gameplay_mob.height) // 2))
    
    d_mob_screen = ImageDraw.Draw(mob_screen)
    d_mob_screen.rounded_rectangle([(30, screen_h - 110), (screen_w - 30, screen_h - 55)], radius=15, fill=(0, 0, 0, 180), outline="#FFD700", width=2)
    d_mob_screen.text((screen_w // 2, screen_h - 82), "TOUCH & DRAG TO STEER", font=ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 16), fill="#FFD700", anchor="mm")
    
    phone_body.paste(mob_screen, (screen_x, screen_y))
    
    d_phone.rounded_rectangle([(mob_w // 2 - 45, screen_y + 8), (mob_w // 2 + 45, screen_y + 26)], radius=9, fill=(0, 0, 0, 255))
    d_phone.rounded_rectangle([(mob_w // 2 - 50, screen_y + screen_h - 10), (mob_w // 2 + 50, screen_y + screen_h - 6)], radius=3, fill=(255, 255, 255, 200))
    
    canvas.paste(phone_body, (mob_x, mob_y), phone_body)
    
    d.text((mob_x + mob_w // 2, mob_y + mob_h + 35), "Mobile / Tablet (Touch Responsive)", font=font_label, fill="#FFFFFF", anchor="mm")
    d.text((mob_x + mob_w // 2, mob_y + mob_h + 70), "Smooth Drag-to-Follow Touch  •  Responsive Auto-Scale", font=font_desc, fill="#9FB5CC", anchor="mm")
    
    canvas.convert("RGB").save("media/screenshots/showcase-responsive-devices.png", "PNG", quality=95)
    canvas.convert("RGB").save("media/itch/itch-showcase-responsive.png", "PNG", quality=95)
    print("Saved media/screenshots/showcase-responsive-devices.png (1600x900)")

if __name__ == "__main__":
    build_itch_cover()
    build_itch_banner()
    build_itch_avatar()
    build_responsive_showcase()
    print("All marketing assets generated successfully!")
