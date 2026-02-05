# Custom Model Training Guide

This guide explains how to train and integrate your own deepfake detection model into the system.

## 🎯 **Training Options**

### **Option 1: Train from Scratch**
Train a completely new model with your own dataset.

### **Option 2: Fine-tune Existing Model**
Fine-tune a pretrained model (ResNet, EfficientNet, etc.) on your dataset.

### **Option 3: Transfer Learning**
Use a pretrained model and adapt it for deepfake detection.

## 📊 **Dataset Requirements**

### **Dataset Structure**
```
dataset/
├── train/
│   ├── real/
│   │   ├── real_image_001.jpg
│   │   ├── real_image_002.jpg
│   │   └── ...
│   └── fake/
│       ├── fake_image_001.jpg
│       ├── fake_image_002.jpg
│       └── ...
└── val/
    ├── real/
    │   ├── real_val_001.jpg
    │   └── ...
    └── fake/
        ├── fake_val_001.jpg
        └── ...
```

### **Recommended Datasets**
1. **FaceForensics++** - High-quality face manipulation dataset
2. **Celeb-DF** - Celebrity deepfake dataset
3. **DFDC (Deepfake Detection Challenge)** - Facebook's deepfake dataset
4. **DeeperForensics-1.0** - Large-scale deepfake dataset
5. **Your own dataset** - Custom collected data

### **Dataset Guidelines**
- **Minimum**: 10,000 images per class (real/fake)
- **Recommended**: 50,000+ images per class
- **Image quality**: High resolution (224x224 minimum)
- **Diversity**: Various lighting, angles, ethnicities, ages
- **Balance**: Equal number of real and fake samples

## 🚀 **Training Your Model**

### **Step 1: Prepare Environment**
```bash
cd packages/ai-service
pip install -r requirements.txt

# Additional training dependencies
pip install matplotlib seaborn scikit-learn
```

### **Step 2: Prepare Dataset**
```bash
# Create dataset directory
mkdir -p dataset/train/real dataset/train/fake
mkdir -p dataset/val/real dataset/val/fake

# Copy your images to appropriate directories
# Real images -> dataset/train/real/ and dataset/val/real/
# Fake images -> dataset/train/fake/ and dataset/val/fake/
```

### **Step 3: Train the Model**
```bash
# Basic training with custom CNN
python train_custom_model.py \
    --data_dir ./dataset \
    --epochs 50 \
    --batch_size 32 \
    --lr 0.001 \
    --model_type custom_cnn

# Training with ResNet50 (transfer learning)
python train_custom_model.py \
    --data_dir ./dataset \
    --epochs 30 \
    --batch_size 16 \
    --lr 0.0001 \
    --model_type resnet50

# Resume training from checkpoint
python train_custom_model.py \
    --data_dir ./dataset \
    --epochs 100 \
    --resume ./models/checkpoint_epoch_20.pth
```

### **Step 4: Configure the System**
Update your `.env` file:
```env
MODEL_TYPE=custom
MODEL_PATH=./models/best_model_custom_cnn_20240205_143022.pth
CUSTOM_MODEL_TYPE=custom_cnn
```

### **Step 5: Test Your Model**
```bash
# Restart the AI service
python app.py

# Test health endpoint
curl http://localhost:5000/health

# Test inference with an image
curl -X POST -F "image=@test_image.jpg" http://localhost:5000/inference/analyze-frame
```

## 🏗️ **Model Architectures**

### **Custom CNN Architecture**
- 4 convolutional blocks with batch normalization
- Adaptive average pooling
- Fully connected layers with dropout
- Optimized for deepfake detection

### **ResNet50 Architecture**
- Pretrained on ImageNet
- Modified final layer for binary classification
- Transfer learning approach
- Good for smaller datasets

### **Adding Your Own Architecture**
Modify `custom_model_handler.py`:

```python
class YourCustomModel(nn.Module):
    def __init__(self, num_classes=2):
        super(YourCustomModel, self).__init__()
        # Your architecture here
        
    def forward(self, x):
        # Your forward pass here
        return x

# In CustomModelHandler.__init__():
elif self.model_type == "your_model":
    self.model = YourCustomModel(num_classes=2)
```

## 📈 **Training Tips**

### **Hyperparameter Tuning**
- **Learning Rate**: Start with 0.001, reduce if loss plateaus
- **Batch Size**: 16-32 for most GPUs, adjust based on memory
- **Epochs**: 50-100 depending on dataset size
- **Optimizer**: Adam works well, try SGD with momentum

### **Data Augmentation**
The training script includes:
- Random horizontal flip
- Random rotation (±10 degrees)
- Color jitter (brightness, contrast, saturation)
- Normalization with ImageNet statistics

### **Regularization**
- Dropout (0.5) in fully connected layers
- Batch normalization in convolutional layers
- Learning rate scheduling (step decay)

### **Monitoring Training**
- Watch for overfitting (validation accuracy plateaus)
- Use early stopping if validation loss increases
- Save checkpoints regularly
- Monitor training/validation loss curves

## 🔧 **Advanced Features**

### **Ensemble Models**
Combine multiple models for better accuracy:

```python
class EnsembleModelHandler:
    def __init__(self, model_paths):
        self.models = []
        for path in model_paths:
            handler = CustomModelHandler(path)
            self.models.append(handler)
    
    def predict(self, image):
        predictions = []
        for model in self.models:
            pred = model.predict(image)
            predictions.append(pred)
        
        # Average predictions
        avg_confidence = sum(p['confidence'] for p in predictions) / len(predictions)
        # ... ensemble logic
```

### **Model Quantization**
Reduce model size for faster inference:

```python
# Post-training quantization
model_quantized = torch.quantization.quantize_dynamic(
    model, {nn.Linear}, dtype=torch.qint8
)
```

### **ONNX Export**
Export for cross-platform deployment:

```python
torch.onnx.export(
    model, 
    dummy_input, 
    "deepfake_detector.onnx",
    export_params=True,
    opset_version=11
)
```

## 📊 **Evaluation Metrics**

The system tracks:
- **Accuracy**: Overall classification accuracy
- **Precision**: True positives / (True positives + False positives)
- **Recall**: True positives / (True positives + False negatives)
- **F1-Score**: Harmonic mean of precision and recall
- **AUC-ROC**: Area under the ROC curve

## 🚀 **Production Deployment**

### **Model Optimization**
1. **Pruning**: Remove unnecessary weights
2. **Quantization**: Reduce precision (FP32 → INT8)
3. **Knowledge Distillation**: Train smaller student model
4. **TensorRT**: NVIDIA GPU optimization

### **A/B Testing**
Deploy multiple models and compare performance:

```python
# In app.py
model_a = CustomModelHandler("model_a.pth")
model_b = CustomModelHandler("model_b.pth")

# Route traffic based on user ID or random selection
if user_id % 2 == 0:
    result = model_a.predict(image)
else:
    result = model_b.predict(image)
```

## 🔍 **Troubleshooting**

### **Common Issues**
1. **CUDA out of memory**: Reduce batch size
2. **Model not loading**: Check file path and format
3. **Poor accuracy**: More data, better augmentation, hyperparameter tuning
4. **Slow inference**: Model quantization, smaller architecture

### **Performance Optimization**
- Use GPU if available
- Batch multiple images together
- Cache model in memory
- Use mixed precision training (FP16)

## 📚 **Resources**

### **Papers**
- "FaceForensics++: Learning to Detect Manipulated Facial Images"
- "The DeepFake Detection Challenge (DFDC) Dataset"
- "DeeperForensics-1.0: A Large-Scale Dataset for Real-World Face Forgery Detection"

### **Datasets**
- [FaceForensics++](https://github.com/ondyari/FaceForensics)
- [Celeb-DF](https://github.com/yuezunli/celeb-deepfakeforensics)
- [DFDC](https://www.kaggle.com/c/deepfake-detection-challenge)

### **Tools**
- [Weights & Biases](https://wandb.ai/) - Experiment tracking
- [TensorBoard](https://www.tensorflow.org/tensorboard) - Visualization
- [Optuna](https://optuna.org/) - Hyperparameter optimization

## 🎯 **Next Steps**

1. **Collect/prepare your dataset**
2. **Run the training script**
3. **Evaluate model performance**
4. **Integrate into the system**
5. **Test with real data**
6. **Deploy and monitor**

Your custom model will integrate seamlessly with the existing forensic analysis and real-time processing pipeline!