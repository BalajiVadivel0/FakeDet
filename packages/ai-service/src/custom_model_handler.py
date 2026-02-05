import torch
import torch.nn as nn
import torchvision.transforms as transforms
from PIL import Image
import os

class CustomCNN(nn.Module):
    """
    Custom CNN architecture for deepfake detection.
    You can modify this architecture based on your training needs.
    """
    def __init__(self, num_classes=2):
        super(CustomCNN, self).__init__()
        
        # Feature extraction layers
        self.features = nn.Sequential(
            # First conv block
            nn.Conv2d(3, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
            
            # Second conv block
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
            
            # Third conv block
            nn.Conv2d(128, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
            
            # Fourth conv block
            nn.Conv2d(256, 512, kernel_size=3, padding=1),
            nn.BatchNorm2d(512),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
        )
        
        # Classifier
        self.classifier = nn.Sequential(
            nn.AdaptiveAvgPool2d((7, 7)),
            nn.Flatten(),
            nn.Linear(512 * 7 * 7, 4096),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5),
            nn.Linear(4096, 1024),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5),
            nn.Linear(1024, num_classes)
        )
    
    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x

class CustomModelHandler:
    def __init__(self, model_path: str, model_type: str = "custom_cnn"):
        self.model = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model_path = model_path
        self.model_type = model_type
        
        # Image preprocessing transforms
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                               std=[0.229, 0.224, 0.225])
        ])
        
        self.load_model()
    
    def load_model(self):
        """Load your custom trained model"""
        try:
            if self.model_type == "custom_cnn":
                self.model = CustomCNN(num_classes=2)
            elif self.model_type == "resnet":
                # You can add other architectures here
                from torchvision.models import resnet50
                self.model = resnet50(pretrained=False)
                self.model.fc = nn.Linear(self.model.fc.in_features, 2)
            
            # Load trained weights
            if os.path.exists(self.model_path):
                checkpoint = torch.load(self.model_path, map_location=self.device)
                
                # Handle different checkpoint formats
                if 'model_state_dict' in checkpoint:
                    self.model.load_state_dict(checkpoint['model_state_dict'])
                elif 'state_dict' in checkpoint:
                    self.model.load_state_dict(checkpoint['state_dict'])
                else:
                    self.model.load_state_dict(checkpoint)
                
                print(f"Custom model loaded from {self.model_path}")
            else:
                print(f"Warning: Model file {self.model_path} not found. Using untrained model.")
            
            self.model = self.model.to(self.device)
            self.model.eval()
            print(f"Model loaded on {self.device}")
            
        except Exception as e:
            print(f"Error loading custom model: {e}")
            raise e
    
    def predict(self, image):
        """
        Run inference on a PIL Image.
        Returns prediction results in the same format as the original handler.
        """
        if self.model is None:
            raise RuntimeError("Model not initialized")
        
        try:
            # Preprocess image
            if isinstance(image, Image.Image):
                image_tensor = self.transform(image).unsqueeze(0)
            else:
                raise ValueError("Input must be a PIL Image")
            
            image_tensor = image_tensor.to(self.device)
            
            with torch.no_grad():
                outputs = self.model(image_tensor)
                probabilities = torch.nn.functional.softmax(outputs, dim=1)
                
                # Assuming class 0 = Real, class 1 = Fake (adjust based on your training)
                real_score = probabilities[0][0].item()
                fake_score = probabilities[0][1].item()
                
                return {
                    "is_fake": fake_score > real_score,
                    "confidence": max(real_score, fake_score),
                    "distribution": {
                        "real": real_score,
                        "fake": fake_score
                    },
                    "model_type": "custom_trained"
                }
                
        except Exception as e:
            print(f"Custom model inference error: {e}")
            return {
                "is_fake": False,
                "confidence": 0.0,
                "distribution": {
                    "real": 0.0,
                    "fake": 0.0
                },
                "error": str(e),
                "model_type": "custom_trained"
            }