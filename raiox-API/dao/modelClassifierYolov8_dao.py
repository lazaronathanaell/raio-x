import time
from ultralytics import YOLO

class ModelClassifierYolov8DAO:
    def __init__(self, model_path='C:/src/projeto_pendor/yolo/raio-x/raiox-API/model/trained_model_329.pt'):
        self.model = YOLO(model_path, task='detect')

    def classify_image(self, image_path):
        print(image_path)
        start_time = time.time()
        results = self.model.predict(source=image_path, save=True)
        end_time = time.time()
        
        class_in_confidences = []
        names = ['CNH FRENTE', 'CNH VERSO', 'RG FRENTE', 'RG VERSO', 'CPF']

        for result in results:
            for box in result.boxes:
                confidence = box.conf.item()
                if confidence >= 0.8:
                    class_in_confidences.append({
                        'class': names[int(box.cls.item())],
                        'confidence': confidence
                    })

        execution_time = end_time - start_time

        return class_in_confidences, execution_time
