import sys
import os
from PIL import Image
from src.model_handler import ModelHandler

def test_model():
    print("Initializing ModelHandler...")
    # This should trigger model download
    handler = ModelHandler() 
    
    print("Creating dummy image...")
    # Create a simple red image
    image = Image.new('RGB', (224, 224), color = 'red')
    
    print("Running prediction...")
    try:
        result = handler.predict(image)
        print("Prediction Result:", result)
        
        if "confidence" in result and "is_fake" in result:
             print("SUCCESS: Model produced valid output structure.")
        else:
             print("FAILURE: Output structure unexpected.")
             
    except Exception as e:
        print(f"FAILURE: Prediction raised exception: {e}")

if __name__ == "__main__":
    test_model()
