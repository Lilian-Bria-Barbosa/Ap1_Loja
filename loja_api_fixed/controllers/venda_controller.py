from extensions import db
from models.venda_model import Venda
from models.item_model import ItemMovimento
from models.produto_model import Produto
from models.saida_model import SaidaEstoque
from datetime import datetime

def registrar_venda(data):
    itens = data.get('itens')
    if not itens or not isinstance(itens, list) or len(itens) == 0:
        return ({"error":"itens obrigatórios"}, 400)
    cliente_id = data.get('cliente_id')
    funcionario_id = data.get('funcionario_id')
    venda = Venda(cliente_id=cliente_id, funcionario_id=funcionario_id, data=datetime.utcnow(), valor=0.0)
    db.session.add(venda)
    db.session.flush()

    total = 0.0
    saida = SaidaEstoque(tipo='venda')
    db.session.add(saida)
    db.session.flush()

    for it in itens:
        pid = it.get('produto_id')
        qtd = it.get('qtd')
        preco_unit = it.get('preco_unit')
        if pid is None or qtd is None or preco_unit is None:
            db.session.rollback()
            return ({"error":"produto_id, qtd e preco_unit são obrigatórios para cada item"}, 400)
        produto = Produto.query.get(pid)
        if not produto:
            db.session.rollback()
            return ({"error":f"Produto {pid} não encontrado"}, 404)
        try:
            qtd = int(qtd)
            preco_unit = float(preco_unit)
        except:
            db.session.rollback()
            return ({"error":"qtd ou preco_unit inválido"}, 400)
        if qtd <= 0:
            db.session.rollback()
            return ({"error":"qtd deve ser > 0"}, 400)
        if produto.qtd_estoque is None or produto.qtd_estoque < qtd:
            db.session.rollback()
            return ({"error":f"estoque insuficiente para o produto {produto.id} (tem {produto.qtd_estoque})"}, 400)
        subtotal = qtd * preco_unit
        item = ItemMovimento(produto_id=pid, qtd=qtd, preco_unit=preco_unit, subtotal=subtotal, saida_id=saida.id)
        db.session.add(item)
        produto.qtd_estoque = produto.qtd_estoque - qtd
        total += subtotal

    venda.valor = total
    db.session.commit()
    return ({"id": venda.id, "valor_total": total, "data": venda.data.isoformat(), "saida_id": saida.id}, 201)