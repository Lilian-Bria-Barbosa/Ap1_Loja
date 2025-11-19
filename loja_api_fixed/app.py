from flask import Flask, jsonify
from flask_cors import CORS
from extensions import db, ma


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///loja.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    ma.init_app(app)

    with app.app_context():
        from models import (
            produto_model,
            categoria_model,
            funcionario_model,
            cliente_model,
            entrada_model,
            saida_model,
            item_model,
            venda_model,
        )
        db.create_all()

    from routes import register_blueprints
    register_blueprints(app)

    try:
        from flask_swagger_ui import get_swaggerui_blueprint
    except Exception:
        get_swaggerui_blueprint = None

    import json
    from flask import jsonify

    def build_openapi_spec():
        paths = {}
        for rule in app.url_map.iter_rules():
            if rule.endpoint == 'static' or rule.rule.startswith('/static'):
                continue
            view = app.view_functions.get(rule.endpoint)
            if view is None:
                continue
            doc = (view.__doc__ or '').strip()
            first_part = rule.rule.strip('/').split('/')
            tag = first_part[0].capitalize() if first_part and first_part[0] else 'Default'
            methods = {}
            for m in rule.methods - {'HEAD', 'OPTIONS'}:
                methods[m.lower()] = {
                    'summary': doc.splitlines()[0] if doc else '',
                    'description': doc,
                    'tags': [tag],
                    'responses': {'200': {'description': 'Success'}},
                }
            paths[rule.rule] = methods
        spec = {
            'openapi': '3.0.0',
            'info': {'title': 'Loja API', 'version': '1.0'},
            'paths': paths,
        }
        return spec

    @app.route('/swagger.json')
    def swagger_json():
        spec = build_openapi_spec()
        return jsonify(spec)

    if get_swaggerui_blueprint is not None:
        SWAGGER_URL = '/docs'
        API_URL = '/swagger.json'
        swaggerui_blueprint = get_swaggerui_blueprint(
            SWAGGER_URL, API_URL, config={'app_name': 'Loja API'}
        )
        app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

    @app.route('/')
    def index():
        """Descrição: index — /

        Descreva aqui o propósito desta rota.
        """
        return jsonify({'message': 'Loja API - rodando'})

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
