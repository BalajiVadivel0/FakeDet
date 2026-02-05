#!/usr/bin/env python3
"""
Quick Start Training Script for Complete Beginners

This script helps you get started with ML training in the easiest way possible.
It will guide you through each step and explain what's happening.

Usage:
    python quick_start_training.py
"""

import os
import sys
import json
from pathlib import Path

def print_header(title):
    """Print a nice header"""
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def print_step(step_num, title, description):
    """Print a step with description"""
    print(f"\n🔸 Step {step_num}: {title}")
    print(f"   {description}")

def check_requirements():
    """Check if all required packages are installed"""
    print_header("CHECKING REQUIREMENTS")
    
    required_packages = [
        ('torch', 'PyTorch for deep learning'),
        ('torchvision', 'PyTorch vision utilities'),
        ('PIL', 'Image processing'),
        ('tqdm', 'Progress bars'),
        ('requests', 'HTTP requests')
    ]
    
    missing_packages = []
    
    for package, description in required_packages:
        try:
            __import__(package)
            print(f"✅ {package} - {description}")
        except ImportError:
            print(f"❌ {package} - {description} (MISSING)")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n⚠️  Missing packages: {', '.join(missing_packages)}")
        print("Run: pip install torch torchvision pillow tqdm requests")
        return False
    
    print("\n✅ All requirements satisfied!")
    return True

def create_minimal_dataset():
    """Create a minimal dataset for learning"""
    print_header("CREATING MINIMAL LEARNING DATASET")
    
    print("📁 Creating directory structure...")
    
    # Create directories
    dirs = [
        'dataset/train/real',
        'dataset/train/fake',
        'dataset/val/real', 
        'dataset/val/fake'
    ]
    
    for dir_path in dirs:
        os.makedirs(dir_path, exist_ok=True)
        print(f"   ✓ Created: {dir_path}")
    
    print("\n📝 NEXT: You need to add images to these folders:")
    print("\n   For REAL images (put in both train/real and val/real):")
    print("   • Take photos of real people (with permission)")
    print("   • Download from free stock photo sites")
    print("   • Use celebrity photos from Google Images")
    print("   • Need at least 50-100 images")
    
    print("\n   For FAKE images (put in both train/fake and val/fake):")
    print("   • Visit thispersondoesnotexist.com and save images")
    print("   • Use AI face generators")
    print("   • Download deepfake examples")
    print("   • Need at least 50-100 images")
    
    print("\n   IMPORTANT:")
    print("   • Put 80% of images in 'train' folders")
    print("   • Put 20% of images in 'val' folders")
    print("   • Images should be .jpg or .png format")
    print("   • Try to make images similar size (faces clearly visible)")
    
    return True

def create_beginner_config():
    """Create a beginner-friendly training configuration"""
    print_header("CREATING BEGINNER TRAINING CONFIG")
    
    config = {
        "beginner_mode": True,
        "epochs": 10,  # Start small
        "batch_size": 8,  # Small batch size for limited memory
        "learning_rate": 0.001,
        "model_type": "custom_cnn",
        "image_size": 224,
        "explanation": {
            "epochs": "How many times the model sees all your data. Start with 10.",
            "batch_size": "How many images processed at once. 8 is safe for most computers.",
            "learning_rate": "How fast the model learns. 0.001 is a good starting point.",
            "model_type": "The architecture. custom_cnn is simple and good for learning."
        },
        "beginner_tips": [
            "Start with 10 epochs to see if everything works",
            "If accuracy reaches 70%+, you're doing great!",
            "If loss stops decreasing, the model has learned what it can",
            "Don't worry if it's not perfect - learning is the goal!"
        ]
    }
    
    with open('beginner_config.json', 'w') as f:
        json.dump(config, f, indent=2)
    
    print("✅ Created beginner_config.json")
    print("\n📖 This config file explains each setting:")
    for key, value in config["explanation"].items():
        print(f"   • {key}: {value}")
    
    return True

def check_dataset():
    """Check if dataset is ready for training"""
    print_header("CHECKING YOUR DATASET")
    
    dataset_path = Path("dataset")
    if not dataset_path.exists():
        print("❌ Dataset directory not found!")
        print("   Run this script again to create the directory structure.")
        return False
    
    # Check each directory
    dirs_to_check = [
        ('dataset/train/real', 'Training real images'),
        ('dataset/train/fake', 'Training fake images'),
        ('dataset/val/real', 'Validation real images'),
        ('dataset/val/fake', 'Validation fake images')
    ]
    
    total_images = 0
    all_good = True
    
    for dir_path, description in dirs_to_check:
        path = Path(dir_path)
        if path.exists():
            images = list(path.glob('*.jpg')) + list(path.glob('*.jpeg')) + list(path.glob('*.png'))
            count = len(images)
            total_images += count
            
            if count > 0:
                print(f"✅ {description}: {count} images")
            else:
                print(f"❌ {description}: No images found!")
                all_good = False
        else:
            print(f"❌ {description}: Directory not found!")
            all_good = False
    
    print(f"\n📊 Total images: {total_images}")
    
    if total_images < 100:
        print("⚠️  You have very few images. Training might not work well.")
        print("   Try to get at least 50 real and 50 fake images.")
        all_good = False
    elif total_images < 500:
        print("⚠️  Small dataset. Results might be limited but good for learning!")
    else:
        print("✅ Good amount of data for training!")
    
    return all_good

def generate_training_command():
    """Generate the training command for the user"""
    print_header("READY TO TRAIN!")
    
    print("🚀 Your training command:")
    print("\n" + "="*50)
    print("python train_custom_model.py \\")
    print("    --data_dir ./dataset \\")
    print("    --epochs 10 \\")
    print("    --batch_size 8 \\")
    print("    --model_type custom_cnn \\")
    print("    --lr 0.001")
    print("="*50)
    
    print("\n📖 What this means:")
    print("   • --data_dir ./dataset: Use the images you prepared")
    print("   • --epochs 10: Train for 10 rounds (good for beginners)")
    print("   • --batch_size 8: Process 8 images at a time (safe for most computers)")
    print("   • --model_type custom_cnn: Use our beginner-friendly model")
    print("   • --lr 0.001: Learning rate (how fast the model learns)")
    
    print("\n⏱️  Expected time: 10-30 minutes (depending on your computer)")
    print("💾 Your trained model will be saved in the 'models' folder")
    
    print("\n🎯 What to expect:")
    print("   • You'll see progress bars and accuracy numbers")
    print("   • Accuracy should gradually increase")
    print("   • Don't worry if it's not perfect - you're learning!")

def main():
    """Main function to guide beginners through the process"""
    print("🎓 BEGINNER'S ML TRAINING GUIDE")
    print("Welcome to your first machine learning training experience!")
    print("This script will guide you through each step.")
    
    # Step 1: Check requirements
    print_step(1, "Check Requirements", "Making sure you have everything installed")
    if not check_requirements():
        print("\n❌ Please install missing packages first!")
        return
    
    # Step 2: Create dataset structure
    print_step(2, "Create Dataset Structure", "Setting up folders for your images")
    create_minimal_dataset()
    
    # Step 3: Create config
    print_step(3, "Create Training Config", "Setting up beginner-friendly training parameters")
    create_beginner_config()
    
    # Step 4: Check if dataset is ready
    print_step(4, "Check Dataset", "Verifying you have images ready for training")
    dataset_ready = check_dataset()
    
    if dataset_ready:
        # Step 5: Generate training command
        print_step(5, "Start Training", "Everything is ready!")
        generate_training_command()
        
        print("\n🎉 YOU'RE READY TO TRAIN YOUR FIRST MODEL!")
        print("\nJust copy and paste the command above to start training.")
        
    else:
        print("\n📝 NEXT STEPS:")
        print("1. Add images to the dataset folders (see instructions above)")
        print("2. Run this script again to check your dataset")
        print("3. When everything looks good, you'll get your training command!")
    
    print("\n💡 REMEMBER:")
    print("   • This is your first model - it doesn't need to be perfect!")
    print("   • The goal is to learn the process")
    print("   • Even 60-70% accuracy is great for a first attempt")
    print("   • You can always improve it later!")
    
    print("\n🆘 If you get stuck:")
    print("   • Check the BEGINNER_ML_TRAINING_GUIDE.md file")
    print("   • Start with fewer images if you have problems")
    print("   • Remember: everyone starts somewhere!")

if __name__ == '__main__':
    main()