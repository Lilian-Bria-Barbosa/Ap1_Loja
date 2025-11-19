from extensions import db

class ItemMovimento(db.Model):
    __tablename__ = 'item_movimento'
    id = db.Column(db.Integer, primary_key=True)
    produto_id = db.Column(db.Integer, db.ForeignKey('produto.id'), nullable=False)
    qtd = db.Column(db.Integer, nullable=False)
    preco_unit = db.Column(db.Float, nullable=False)
    subtotal = db.Column(db.Float, nullable=False)
    entrada_id = db.Column(db.Integer, db.ForeignKey('entrada_estoque.id'), nullable=True)
    saida_id = db.Column(db.Integer, db.ForeignKey('saida_estoque.id'), nullable=True)

    produto = db.relationship('Produto')