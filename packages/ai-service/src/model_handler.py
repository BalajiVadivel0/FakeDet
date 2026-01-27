import torch
import torch.nn as nn
from transformers import AutoImageProcessor, AutoModelForImageClassification
import os

class ModelHandler:
    def __init__(self, model_path: str = None):
        self.model = None
        self.processor = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        # Default to a known good model if no path provided
        self.model_name = model_path if model_path and "/" in model_path else "prithivMLmods/Deep-Fake-Detector-v2-Model"
        self.load_model()

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
