from extensions import db

class Cliente(db.Model):
    __tablename__ = 'cliente'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    telefone = db.Column(db.String(50))
    email = db.Column(db.String(200))
    cpf = db.Column(db.String(20), unique=True)