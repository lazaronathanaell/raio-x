from flask import Flask
from flask_cors import CORS
from routes.image_routes import image_routes  # Importar o blueprint corretamente

app = Flask(__name__)
CORS(app)  # Adiciona suporte a CORS para todas as rotas

app.register_blueprint(image_routes, url_prefix='/api')  # Registrar o blueprint

if __name__ == "__main__":
    app.run(debug=True)
