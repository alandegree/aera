from aera_app import AeraApp


def init_app(app: AeraApp):
    from events import event_handlers  # noqa: F401
