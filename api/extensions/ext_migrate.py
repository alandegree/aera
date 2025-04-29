from aera_app import AeraApp


def init_app(app: AeraApp):
    import flask_migrate  # type: ignore

    from extensions.ext_database import db

    flask_migrate.Migrate(app, db)
