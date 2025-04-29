from core.extension.extension import Extension
from aera_app import AeraApp


def init_app(app: AeraApp):
    code_based_extension.init()


code_based_extension = Extension()
