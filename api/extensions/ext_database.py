from aera_app import AeraApp
from models import db


def init_app(app: AeraApp):
    db.init_app(app)
