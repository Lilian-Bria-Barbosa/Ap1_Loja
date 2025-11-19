from extensions import db
from datetime import datetime

class EntradaEstoque(db.Model):
    __tablename__ = 'entrada_estoque'
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.DateTime, default=datetime.utcnow)
    fornecedor = db.Column(db.String(200))
    itens = db.relationship('ItemMovimento', backref='entrada', lazy=True, cascade='all, delete-orphan')