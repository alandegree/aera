from configs import aera_config
from aera_app import AeraApp


def init_app(app: AeraApp):
    app.secret_key = aera_config.SECRET_KEY
