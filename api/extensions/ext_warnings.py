from aera_app import AeraApp


def init_app(app: AeraApp):
    import warnings

    warnings.simplefilter("ignore", ResourceWarning)
