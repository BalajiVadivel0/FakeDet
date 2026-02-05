#!/usr/bin/env python3
"""
Dataset Download and Preparation Script for Beginners

This script helps you download and prepare datasets for deepfake detection training.
It's designed for complete beginners who have never worked with ML datasets before.

Usage:
    python download_dataset.py --dataset faceforensics --quality raw
    python download_dataset.py --dataset kaggle_140k
    python download_dataset.py --dataset custom --path /path/to/your/images
"""

import os
import argparse
import requests
import zipfile
import shutil
from pathlib import Path
import json
from tqdm import tqdm
import cv2
import numpy as np
from PIL import Image

def create_directory_structure(base_path):
    """Create the required directory structure for training"""
    directories = [
        'dataset/train/real',
        'dataset/train/fake', 
        'dataset/val/real',
        'dataset/val/fake',
        'dataset/test/real',
        'dataset/test/fake'
    ]
    
    for directory in directories:
        full_path = os.path.join(base_path, directory)
        os.makedirs(full_path, exist_ok=True)
        print(f"✓ Created directory: {full_path}")

def download_file(url, filename):
    """Download a file with progress bar"""
    response = requests.get(url, stream=True)
    total_size = int(response.headers.get('content-length', 0))
    
    with open(filename, 'wb') as file, tqdm(
        desc=filename,
        total=total_size,
        unit='B',
        unit_scale=True,
        unit_divisor=1024,
    ) as progress_bar:
        for chunk in response.iter_content(chunk_size=8192):
            size = file.write(chunk)
            progress_bar.update(size)

def download_kaggle_140k_dataset(base_path):
    """
    Download the 140k Real and Fake Faces dataset from Kaggle
    
    NOTE: You need to:
    1. Create a Kaggle account
    2. Go to Account -> API -> Create New API Token
    3. Download kaggle.json and place it in ~/.kaggle/
    4. Install kaggle: pip install kaggle
    """
    print("📥 Downloading 140k Real and Fake Faces dataset from Kaggle...")
    print("\n⚠️  SETUP REQUIRED:")
    print("1. Create account at https://www.kaggle.com")
    print("2. Go to Account -> API -> Create New API Token")
    print("3. Download kaggle.json to ~/.kaggle/ directory")
    print("4. Run: pip install kaggle")
    print("5. Run: kaggle datasets download -d ciplab/real-and-fake-face-detection")
    
    # Check if kaggle is installed
    try:
        import kaggle
        print("✓ Kaggle API found")
    except ImportError:
        print("❌ Kaggle not installed. Run: pip install kaggle")
        return False
    
    # Download dataset
    try:
        os.system("kaggle datasets download -d ciplab/real-and-fake-face-detection")
        
        # Extract and organize
        with zipfile.ZipFile("real-and-fake-face-detection.zip", 'r') as zip_ref:
            zip_ref.extractall("temp_dataset")
        
        # Organize into train/val/test splits
        organize_kaggle_dataset(base_path, "temp_dataset")
        
        # Cleanup
        os.remove("real-and-fake-face-detection.zip")
        shutil.rmtree("temp_dataset")
        
        print("✅ Kaggle dataset downloaded and organized!")
        return True
        
    except Exception as e:
        print(f"❌ Error downloading Kaggle dataset: {e}")
        print("\nManual steps:")
        print("1. Go to: https://www.kaggle.com/datasets/ciplab/real-and-fake-face-detection")
        print("2. Click 'Download' button")
        print("3. Extract the zip file")
        print("4. Run: python download_dataset.py --dataset custom --path /path/to/extracted/folder")
        return False

def organize_kaggle_dataset(base_path, temp_path):
    """Organize the Kaggle dataset into train/val/test splits"""
    print("📁 Organizing dataset into train/val/test splits...")
    
    # Find real and fake directories
    real_dir = None
    fake_dir = None
    
    for root, dirs, files in os.walk(temp_path):
        for dir_name in dirs:
            if 'real' in dir_name.lower():
                real_dir = os.path.join(root, dir_name)
            elif 'fake' in dir_name.lower():
                fake_dir = os.path.join(root, dir_name)
    
    if not real_dir or not fake_dir:
        print("❌ Could not find real and fake directories")
        return False
    
    # Split ratios
    train_ratio = 0.7
    val_ratio = 0.2
    test_ratio = 0.1
    
    # Process real images
    real_images = [f for f in os.listdir(real_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    split_and_copy_images(real_images, real_dir, base_path, 'real', train_ratio, val_ratio, test_ratio)
    
    # Process fake images
    fake_images = [f for f in os.listdir(fake_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    split_and_copy_images(fake_images, fake_dir, base_path, 'fake', train_ratio, val_ratio, test_ratio)
    
    print("✅ Dataset organized successfully!")
    return True

def split_and_copy_images(image_list, source_dir, base_path, label, train_ratio, val_ratio, test_ratio):
    """Split images into train/val/test and copy to appropriate directories"""
    np.random.shuffle(image_list)
    
    total_images = len(image_list)
    train_count = int(total_images * train_ratio)
    val_count = int(total_images * val_ratio)
    
    train_images = image_list[:train_count]
    val_images = image_list[train_count:train_count + val_count]
    test_images = image_list[train_count + val_count:]
    
    # Copy images to appropriate directories
    splits = [
        ('train', train_images),
        ('val', val_images),
        ('test', test_images)
    ]
    
    for split_name, images in splits:
        dest_dir = os.path.join(base_path, 'dataset', split_name, label)
        for img_name in tqdm(images, desc=f"Copying {label} {split_name} images"):
            src_path = os.path.join(source_dir, img_name)
            dest_path = os.path.join(dest_dir, img_name)
            shutil.copy2(src_path, dest_path)
        
        print(f"✓ Copied {len(images)} {label} images to {split_name}")

def download_sample_dataset(base_path):
    """Download a small sample dataset for quick testing"""
    print("📥 Creating sample dataset for testing...")
    
    # This creates a tiny dataset with some sample images for testing
    # In practice, you'd replace this with real dataset downloads
    
    sample_urls = {
        'real': [
            # These would be real face image URLs
            # For demo purposes, we'll create placeholder instructions
        ],
        'fake': [
            # These would be fake face image URLs
        ]
    }
    
    print("📝 Sample dataset creation instructions:")
    print("1. Find 100-200 real face images online")
    print("2. Find 100-200 fake/generated face images")
    print("3. Save them in the following structure:")
    print("   dataset/train/real/ (70% of real images)")
    print("   dataset/train/fake/ (70% of fake images)")
    print("   dataset/val/real/ (20% of real images)")
    print("   dataset/val/fake/ (20% of fake images)")
    print("   dataset/test/real/ (10% of real images)")
    print("   dataset/test/fake/ (10% of fake images)")
    
    return True

def validate_dataset(base_path):
    """Validate the dataset structure and provide statistics"""
    print("\n📊 Validating dataset...")
    
    dataset_path = os.path.join(base_path, 'dataset')
    
    if not os.path.exists(dataset_path):
        print("❌ Dataset directory not found!")
        return False
    
    stats = {}
    total_images = 0
    
    for split in ['train', 'val', 'test']:
        stats[split] = {}
        for label in ['real', 'fake']:
            path = os.path.join(dataset_path, split, label)
            if os.path.exists(path):
                count = len([f for f in os.listdir(path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
                stats[split][label] = count
                total_images += count
            else:
                stats[split][label] = 0
    
    # Print statistics
    print("\n📈 Dataset Statistics:")
    print("=" * 50)
    for split in ['train', 'val', 'test']:
        real_count = stats[split]['real']
        fake_count = stats[split]['fake']
        total_split = real_count + fake_count
        print(f"{split.upper():>5}: Real={real_count:>5}, Fake={fake_count:>5}, Total={total_split:>5}")
    
    print("=" * 50)
    print(f"TOTAL: {total_images} images")
    
    # Validation checks
    issues = []
    
    if total_images < 1000:
        issues.append("⚠️  Dataset is quite small (< 1000 images). Consider getting more data.")
    
    train_real = stats['train']['real']
    train_fake = stats['train']['fake']
    if abs(train_real - train_fake) > max(train_real, train_fake) * 0.2:
        issues.append("⚠️  Training data is imbalanced (real vs fake ratio > 20% difference)")
    
    if stats['val']['real'] < 50 or stats['val']['fake'] < 50:
        issues.append("⚠️  Validation set is very small (< 50 per class)")
    
    if issues:
        print("\n🔍 Dataset Issues:")
        for issue in issues:
            print(f"  {issue}")
    else:
        print("\n✅ Dataset looks good for training!")
    
    return True

def create_training_config(base_path, dataset_name):
    """Create a training configuration file"""
    config = {
        "dataset_name": dataset_name,
        "dataset_path": os.path.join(base_path, "dataset"),
        "model_type": "custom_cnn",
        "epochs": 50,
        "batch_size": 32,
        "learning_rate": 0.001,
        "image_size": 224,
        "num_classes": 2,
        "class_names": ["real", "fake"],
        "training_tips": [
            "Start with 10-20 epochs to see if the model is learning",
            "If validation accuracy plateaus, reduce learning rate",
            "If overfitting occurs, add more data augmentation",
            "Monitor both training and validation accuracy"
        ]
    }
    
    config_path = os.path.join(base_path, "training_config.json")
    with open(config_path, 'w') as f:
        json.dump(config, f, indent=2)
    
    print(f"✅ Training configuration saved to: {config_path}")
    return config_path

def main():
    parser = argparse.ArgumentParser(description='Download and prepare datasets for deepfake detection')
    parser.add_argument('--dataset', type=str, required=True,
                        choices=['kaggle_140k', 'sample', 'custom'],
                        help='Dataset to download')
    parser.add_argument('--path', type=str, default='.',
                        help='Base path for dataset (default: current directory)')
    parser.add_argument('--custom_path', type=str,
                        help='Path to custom dataset (for --dataset custom)')
    
    args = parser.parse_args()
    
    print("🚀 Dataset Download and Preparation Tool")
    print("=" * 50)
    
    # Create directory structure
    create_directory_structure(args.path)
    
    # Download/prepare dataset based on choice
    success = False
    
    if args.dataset == 'kaggle_140k':
        success = download_kaggle_140k_dataset(args.path)
    elif args.dataset == 'sample':
        success = download_sample_dataset(args.path)
    elif args.dataset == 'custom':
        if args.custom_path:
            print(f"📁 Processing custom dataset from: {args.custom_path}")
            # Here you would implement custom dataset processing
            print("📝 Custom dataset processing not implemented yet.")
            print("Please manually organize your images into the created directory structure.")
            success = True
        else:
            print("❌ --custom_path required for custom dataset")
            return
    
    if success:
        # Validate dataset
        validate_dataset(args.path)
        
        # Create training configuration
        create_training_config(args.path, args.dataset)
        
        print("\n🎉 Dataset preparation complete!")
        print("\nNext steps:")
        print("1. Review the dataset statistics above")
        print("2. Check the training_config.json file")
        print("3. Run: python train_custom_model.py --data_dir ./dataset")
        print("\n📚 For beginners, start with 10 epochs to test:")
        print("   python train_custom_model.py --data_dir ./dataset --epochs 10")

if __name__ == '__main__':
    main()