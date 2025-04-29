from core.hosting_configuration import HostingConfiguration

hosting_configuration = HostingConfiguration()


from aera_app import AeraApp


def init_app(app: AeraApp):
    hosting_configuration.init_app(app)
