from PIL import Image
import os

def create_test_image():
    # Create a simple 100x100 RGB image (red)
    img = Image.new('RGB', (100, 100), color = 'red')
    
    # Ensure uploads dir exists
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
        
    img.save('uploads/test_image.jpg')
    print("Created uploads/test_image.jpg")

if __name__ == "__main__":
    create_test_image()
