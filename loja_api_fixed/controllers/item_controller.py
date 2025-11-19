from models.item_model import ItemMovimento

def listar_itens():
    return ItemMovimento.query.all()

def get_item(iid):
    return ItemMovimento.query.get(iid)