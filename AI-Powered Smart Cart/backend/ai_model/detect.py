from ultralytics import YOLO
import cv2
import numpy as np
from collections import Counter
from app.models.product import ProductItem

""" model = YOLO("backend/ai_model/walmart_best.pt")

def detect_products_from_image(image_bytes: bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    results = model(img)
    detections = []
    for r in results:
        for c in r.boxes.cls:
            class_name = model.names[int(c)]
            detections.append(class_name)
    count = Counter(detections)
    return [ProductItem(name=name, quantity=qty) for name, qty in count.items()] """
def detect_products_from_image(image_bytes: bytes):
    return [
        ProductItem(name="oreo_pack", quantity=1),
        ProductItem(name="coke_can", quantity=2)
    ]