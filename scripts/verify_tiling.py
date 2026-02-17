import sys
from PIL import Image
import numpy as np

def check_seamless(image_path, threshold=5):
    try:
        img = Image.open(image_path)
        img_arr = np.array(img)
        
        # Get left and right columns
        left_col = img_arr[:, 0]
        right_col = img_arr[:, -1]
        
        # Calculate mean absolute difference
        diff = np.mean(np.abs(left_col - right_col))
        
        print(f"Checking {image_path}...")
        print(f"Mean pixel difference between left and right edges: {diff:.2f}")
        
        if diff < threshold:
            print("✅ SEAMLESS (PASSED)")
            return True
        else:
            print("❌ NOT SEAMLESS (FAILED)")
            return False
            
    except Exception as e:
        print(f"Error processing {image_path}: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 verify_tiling.py <image_path> [image_path ...]")
        sys.exit(1)
        
    failed = False
    for path in sys.argv[1:]:
        if not check_seamless(path):
            failed = True
            
    if failed:
        sys.exit(1)
