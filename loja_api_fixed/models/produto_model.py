from extensions import db

class Produto(db.Model):
    __tablename__ = 'produto'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    descricao = db.Column(db.String(500))
    preco_unit = db.Column(db.Float, nullable=False, default=0.0)
    tamanho = db.Column(db.String(50))
    qtd_estoque = db.Column(db.Integer, nullable=False, default=0)
    categoria_id = db.Column(db.Integer, db.ForeignKey('categoria.id'), nullable=True)