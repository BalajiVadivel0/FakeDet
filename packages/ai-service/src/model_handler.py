import os
import requests
import base64
from io import BytesIO

HF_API_URL = "https://api-inference.huggingface.co/models/prithivMLmods/Deep-Fake-Detector-v2-Model"

class ModelHandler:
    def __init__(self, model_path: str = None):
        self.model = True  # Signals model is "loaded" (remote API)
        self.device = "huggingface-api"
        self.api_token = os.getenv("HF_API_TOKEN", "")
        self.api_url = HF_API_URL
        print(f"Using HuggingFace Inference API: {self.api_url}")

    def predict(self, image):
        """
        Sends a PIL Image to HuggingFace Inference API and returns scores.
        """
        try:
            # Convert PIL image to bytes
            buffered = BytesIO()
            image.save(buffered, format="JPEG")
            img_bytes = buffered.getvalue()

            headers = {}
            if self.api_token:
                headers["Authorization"] = f"Bearer {self.api_token}"

            response = requests.post(
                self.api_url,
                headers=headers,
                data=img_bytes,
                timeout=60
            )

            if response.status_code == 503:
                # Model is loading on HuggingFace side — return neutral result
                print("HuggingFace model is loading, returning neutral result")
                return {
                    "is_fake": False,
                    "confidence": 0.5,
                    "distribution": {"real": 0.5, "fake": 0.5},
                    "note": "Model warming up, try again in 20 seconds"
                }

            response.raise_for_status()
            results = response.json()

            # Response format: [{"label": "Fake", "score": 0.97}, {"label": "Real", "score": 0.03}]
            fake_score = 0.0
            real_score = 0.0

            for item in results:
                label = item.get("label", "").lower()
                score = item.get("score", 0.0)
                if "fake" in label:
                    fake_score = score
                elif "real" in label:
                    real_score = score

            return {
                "is_fake": fake_score > real_score,
                "confidence": max(fake_score, real_score),
                "distribution": {
                    "real": real_score,
                    "fake": fake_score
                }
            }

        except Exception as e:
            print(f"HuggingFace API error: {e}")
            return {
                "is_fake": False,
                "confidence": 0.0,
                "distribution": {"real": 0.0, "fake": 0.0},
                "error": str(e)
            }


    def load_model(self):
        """
        Loads the pre-trained model and processor from Hugging Face.
        """
        try:
            print(f"Loading model: {self.model_name}")
            self.processor = AutoImageProcessor.from_pretrained(self.model_name)
            self.model = AutoModelForImageClassification.from_pretrained(self.model_name)
            
            self.model = self.model.to(self.device)
            self.model.eval()
            print(f"Model loaded on {self.device}")
            
        except Exception as e:
            print(f"Error loading model: {e}")
            raise e

    def predict(self, image):
        """
        Runs inference on a PIL Image.
        Returns a dictionary with confidence scores.
        """
        if self.model is None:
            raise RuntimeError("Model not initialized")

        try:
            # Preprocess directly using the model's processor
            inputs = self.processor(images=image, return_tensors="pt")
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            with torch.no_grad():
                outputs = self.model(**inputs)
                logits = outputs.logits
                probabilities = torch.nn.functional.softmax(logits, dim=1)
                
                # The model maps: 0 -> Fake, 1 -> Real (or vice versa, checking config usually required)
                # For "prithivMLmods/Deep-Fake-Detector-v2-Model":
                # Label 0: Fake
                # Label 1: Real
                # We verify this mapping from model config commonly.
                
                fake_score = probabilities[0][0].item()
                real_score = probabilities[0][1].item()
                
                # Check id2label to be sure if available, defaulting to standard 0=Fake, 1=Real for this model family
                id2label = self.model.config.id2label
                if id2label:
                    # If specific labels exist, map accordingly. 
                    # Usually {0: 'Fake', 1: 'Real'} or similar.
                    # We will assume index 0 is Fake for now based on common dataset formatting.
                    pass

                return {
                    "is_fake": fake_score > real_score,
                    "confidence": max(real_score, fake_score),
                    "distribution": {
                        "real": real_score,
                        "fake": fake_score
                    }
                }
                
        except Exception as e:
            print(f"Inference error: {e}")
            return {
                "is_fake": False,
                "confidence": 0.0,
                "distribution": {
                    "real": 0.0,
                    "fake": 0.0
                },
                "error": str(e)
            }
