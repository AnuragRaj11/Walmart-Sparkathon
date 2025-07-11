# backend/ai_model/detect.py

import torch
from torchvision import transforms, models
from PIL import Image
import io
from app.models.product import ProductItem

MODEL_PATH = r"C:\Users\KIIT\Desktop\Walmart-Sparkathon\AI-Powered Smart Cart\backend\ai_model\product_model.pth"
IMAGE_SIZE = 224

# Image Transform
transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

model_data = torch.load(MODEL_PATH, map_location=torch.device('cpu'), weights_only=False)
label_classes = model_data['label_encoder']
model = models.resnet18(pretrained=False)
model.fc = torch.nn.Linear(model.fc.in_features, len(label_classes))
model.load_state_dict(model_data['model_state_dict'])
model.eval()

def detect_products_from_image(image_bytes: bytes, filename: str):
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image = transform(image).unsqueeze(0)  

        with torch.no_grad():
            output = model(image)
            _, predicted = torch.max(output, 1)
            label = label_classes[predicted.item()]
        
        print(f"[INFO] Detected: {label}")
        return [ProductItem(name=label, quantity=1)]
    except Exception as e:
        print(f"[ERROR] Failed to process image {filename}: {e}")
        return []
