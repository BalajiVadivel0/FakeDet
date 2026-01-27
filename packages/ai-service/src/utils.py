import io
from PIL import Image
import torch
from torchvision import transforms

def load_image_from_bytes(image_bytes: bytes) -> Image.Image:
    """Loads an image from bytes."""
    return Image.open(io.BytesIO(image_bytes)).convert('RGB')

def preprocess_image(image: Image.Image):
    """
    Preprocesses the image for the model.
    Resizes to 224x224, converts to tensor, and normalizes.
    """
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    
    # Add batch dimension
    return transform(image).unsqueeze(0)
