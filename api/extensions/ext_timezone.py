import os
import time

from aera_app import AeraApp


def init_app(app: AeraApp):
    os.environ["TZ"] = "UTC"
    # windows platform not support tzset
    if hasattr(time, "tzset"):
        time.tzset()
