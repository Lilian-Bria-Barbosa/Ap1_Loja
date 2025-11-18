from routes.produto_route import produto_bp
from routes.categoria_route import categoria_bp
from routes.entrada_route import entrada_bp
from routes.saida_route import saida_bp
from routes.venda_route import venda_bp
from routes.item_route import item_bp
from routes.cliente_route import cliente_bp
from routes.funcionario_route import funcionario_bp
from routes.relatorio_route import relatorio_bp


def register_blueprints(app):
    app.register_blueprint(produto_bp, url_prefix='/api/produtos')
    app.register_blueprint(categoria_bp, url_prefix='/api/categorias')
    app.register_blueprint(entrada_bp, url_prefix='/api')
    app.register_blueprint(saida_bp, url_prefix='/api')
    app.register_blueprint(venda_bp, url_prefix='/api')
    app.register_blueprint(item_bp, url_prefix='/api')
    app.register_blueprint(cliente_bp, url_prefix='/api/clientes')
    app.register_blueprint(funcionario_bp, url_prefix='/api/funcionarios')
    app.register_blueprint(relatorio_bp, url_prefix='/api')
   
