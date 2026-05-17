import io
from PIL import Image

def load_image_from_bytes(image_bytes: bytes) -> Image.Image:
    """Loads an image from bytes."""
    return Image.open(io.BytesIO(image_bytes)).convert('RGB')

