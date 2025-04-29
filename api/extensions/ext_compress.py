from configs import aera_config
from aera_app import AeraApp


def is_enabled() -> bool:
    return aera_config.API_COMPRESSION_ENABLED


def init_app(app: AeraApp):
    from flask_compress import Compress  # type: ignore

    compress = Compress()
    compress.init_app(app)
