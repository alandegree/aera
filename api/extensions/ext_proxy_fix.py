from configs import aera_config
from aera_app import AeraApp


def init_app(app: AeraApp):
    if aera_config.RESPECT_XFORWARD_HEADERS_ENABLED:
        from werkzeug.middleware.proxy_fix import ProxyFix

        app.wsgi_app = ProxyFix(app.wsgi_app, x_port=1)  # type: ignore
