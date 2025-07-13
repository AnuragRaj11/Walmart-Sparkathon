import os
import pandas as pd
from PIL import Image
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from torchvision import transforms, models
from torch.utils.data import Dataset, DataLoader
import torch.nn as nn
import torch
import matplotlib.pyplot as plt
import numpy as np
from torchvision.models.resnet import ResNet18_Weights

def main():
    # Paths
    IMAGE_DIR = "training_data/images"
    LABEL_CSV = "training_data/labels.csv"
    BATCH_SIZE = 16
    EPOCHS = 10
    IMAGE_SIZE = 224
    NUM_WORKERS = 0  # Set to 0 to avoid multiprocessing issues on Windows
    MODEL_SAVE_PATH = "product_model.pth"
    MIN_SAMPLES_PER_CLASS = 2

    # Step 1: Prepare Dataset
    class ProductDataset(Dataset):
        def __init__(self, df, label_encoder, transform=None):
            self.df = df
            self.transform = transform
            self.le = label_encoder

        def __len__(self):
            return len(self.df)

        def __getitem__(self, idx):
            row = self.df.iloc[idx]
            image_path = os.path.join(IMAGE_DIR, row["filename"])
            
            try:
                image = Image.open(image_path).convert("RGB")
                label = self.le.transform([row["label"]])[0]
                
                if self.transform:
                    image = self.transform(image)
                    
                return image, torch.tensor(label, dtype=torch.long)  # FIX: Ensure label is long type
            except Exception as e:
                print(f"Error loading image {image_path}: {e}")
                # Return a random image and label if there's an error
                random_idx = np.random.randint(0, len(self.df))
                return self.__getitem__(random_idx)

    # Step 2: Load and Filter Data
    df = pd.read_csv(LABEL_CSV)

    # Filter out classes with too few samples
    value_counts = df["label"].value_counts()
    valid_classes = value_counts[value_counts >= MIN_SAMPLES_PER_CLASS].index
    df = df[df["label"].isin(valid_classes)]

    if len(df) == 0:
        raise ValueError("No classes with sufficient samples for training.")

    le = LabelEncoder()
    df["encoded_label"] = le.fit_transform(df["label"])

    # Step 3: Split Data
    try:
        train_df, val_df = train_test_split(
            df, 
            test_size=0.2, 
            stratify=df["encoded_label"] if len(le.classes_) > 1 else None,
            random_state=42
        )
    except ValueError:
        print("Warning: Couldn't stratify, some classes may be too small")
        train_df, val_df = train_test_split(df, test_size=0.2, random_state=42)

    # Step 4: Transforms and DataLoader
    transform = transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    train_loader = DataLoader(
        ProductDataset(train_df, le, transform), 
        batch_size=BATCH_SIZE, 
        shuffle=True, 
        num_workers=NUM_WORKERS
    )

    val_loader = DataLoader(
        ProductDataset(val_df, le, transform), 
        batch_size=BATCH_SIZE, 
        shuffle=False, 
        num_workers=NUM_WORKERS
    )

    # Step 5: Model Setup
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    weights = ResNet18_Weights.IMAGENET1K_V1
    model = models.resnet18(weights=weights)
    model.fc = nn.Linear(model.fc.in_features, len(le.classes_))
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, 'min', patience=2)

    # Step 6: Training Loop
    best_val_loss = float('inf')
    train_losses, val_losses = [], []

    for epoch in range(EPOCHS):
        model.train()
        total_loss = 0
        
        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            
            optimizer.zero_grad()
            output = model(images)
            loss = criterion(output, labels)  # No need for .long() here since we fixed it in Dataset
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()
        
        avg_train_loss = total_loss / len(train_loader)
        train_losses.append(avg_train_loss)

        # Validation
        model.eval()
        val_loss = 0
        correct = 0
        total = 0
        
        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                loss = criterion(outputs, labels)  # No need for .long() here
                val_loss += loss.item()
                
                _, predicted = torch.max(outputs.data, 1)
                total += labels.size(0)
                correct += (predicted == labels).sum().item()
        
        avg_val_loss = val_loss / len(val_loader)
        val_losses.append(avg_val_loss)
        val_acc = 100 * correct / total
        
        scheduler.step(avg_val_loss)
        
        print(f"Epoch {epoch+1}/{EPOCHS} - Train Loss: {avg_train_loss:.4f}, Val Loss: {avg_val_loss:.4f}, Val Acc: {val_acc:.2f}%")
        
        # Save best model
        if avg_val_loss < best_val_loss:
            best_val_loss = avg_val_loss
            torch.save({
                'epoch': epoch,
                'model_state_dict': model.state_dict(),
                'optimizer_state_dict': optimizer.state_dict(),
                'loss': avg_val_loss,
                'label_encoder': le.classes_
            }, MODEL_SAVE_PATH)

    # Step 7: Plot training curves
    plt.figure(figsize=(10, 5))
    plt.plot(train_losses, label='Training Loss')
    plt.plot(val_losses, label='Validation Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    plt.title('Training and Validation Loss')
    plt.savefig('training_curve.png')
    plt.show()

    print(f"✅ Best model saved to {MODEL_SAVE_PATH}")
    print(f"✅ Label encoder classes: {le.classes_}")

if __name__ == '__main__':
    main()