from extensions import db
from datetime import datetime

class SaidaEstoque(db.Model):
    __tablename__ = 'saida_estoque'
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.DateTime, default=datetime.utcnow)
    tipo = db.Column(db.String(50))
    itens = db.relationship('ItemMovimento', backref='saida', lazy=True, cascade='all, delete-orphan')