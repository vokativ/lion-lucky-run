#!/bin/zsh

# Configuration
SOURCE_DIR="/Users/nemanja/.gemini/antigravity/brain/d25c3a59-f7cb-4698-9853-027c726ccb25"
TARGET_BASE="public/assets/backgrounds"

# Updated Asset List with new "seamless" generation timestamps
# Note: I'll use the latest ones found in the directory for each category
declare -A ASSETS
ASSETS["bg_sky"]=$(ls -t $SOURCE_DIR/bg_sky_seamless_*.png | head -1)
ASSETS["bg_forest"]=$(ls -t $SOURCE_DIR/bg_forest_seamless_*.png | head -1)
ASSETS["bg_rainbow"]=$(ls -t $SOURCE_DIR/bg_rainbow_seamless_*.png | head -1)
ASSETS["bg_singapore"]=$(ls -t $SOURCE_DIR/bg_singapore_seamless_*.png | head -1)
ASSETS["bg_dragon"]=$(ls -t $SOURCE_DIR/bg_dragon_seamless_*.png | head -1)
ASSETS["bg_legend"]=$(ls -t $SOURCE_DIR/bg_legend_seamless_*.png | head -1)

# High-quality upscaling function
upscale() {
    local src=$1
    local out=$2
    local width=$3
    local height=$4
    
    echo "Upscaling to ${width}x${height}..."
    # Using Lanczos for sharp resampling and unsharp mask to recover detail in cartoon edges
    magick "$src" -filter Lanczos -resize "${width}x${height}^" -gravity center -extent "${width}x${height}" -unsharp 0x1 "$out"
}

for NAME in "${(k)ASSETS[@]}"; do
    SRC="${ASSETS[$NAME]}"
    if [[ -z "$SRC" ]]; then
        echo "Warning: No source found for $NAME, skipping."
        continue
    fi
    
    echo "Processing $NAME from $SRC..."
    
    # 4K Variant
    upscale "$SRC" "$TARGET_BASE/4k/${NAME}.png" 3840 2160
    
    # Laptop Variant
    upscale "$SRC" "$TARGET_BASE/laptop/${NAME}.png" 2880 1800
    
    # Mobile Variant
    upscale "$SRC" "$TARGET_BASE/mobile/${NAME}.png" 2532 1170
done

echo "High-quality asset regeneration complete!"
