import os
import uuid
from flask import Blueprint, request, jsonify
from dao.modelClassifierYolov8_dao import ModelClassifierYolov8DAO

image_routes = Blueprint('image_routes', __name__)

# Definir o caminho para imagens temporárias e pastas de validação
base_path = 'raiox-API/'
temp_path = os.path.join(base_path, 'temp_image/')
os.makedirs(temp_path, exist_ok=True)

# Instanciar o classificador
classifier = ModelClassifierYolov8DAO()

@image_routes.route('/classify', methods=['POST'])
def classify_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    temp_file_path = None
    try:
        # Gerar um nome de arquivo único e salvar temporariamente
        unique_filename = str(uuid.uuid4())
        file_extension = os.path.splitext(file.filename)[1]
        temp_file_path = os.path.join(temp_path, f"{unique_filename}{file_extension}")
        file.save(temp_file_path)
        print(temp_file_path)
        print(f"Arquivo salvo temporariamente em: {temp_file_path}")
        
        # Classificar a imagem
        outcome, execution_time = classifier.classify_image(temp_file_path)
        print(f"Resultado da classificação: {outcome}")
        print(f"Tempo de execução: {execution_time} segundos")

    except Exception as e:
        print(f"Erro encontrado: {e}")
        return jsonify({'error': str(e)}), 500
    
    finally:
        # Verificar se o arquivo temporário ainda existe e removê-lo
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            print(f"Arquivo temporário removido: {temp_file_path}")
        
    # Retornar o resultado e o tempo de execução
    return jsonify({'result': outcome, 'execution_time': execution_time})
