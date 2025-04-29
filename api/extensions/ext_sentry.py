from configs import aera_config
from aera_app import AeraApp


def init_app(app: AeraApp):
    if aera_config.SENTRY_DSN:
        import openai
        import sentry_sdk
        from langfuse import parse_error  # type: ignore
        from sentry_sdk.integrations.celery import CeleryIntegration
        from sentry_sdk.integrations.flask import FlaskIntegration
        from werkzeug.exceptions import HTTPException

        from core.model_runtime.errors.invoke import InvokeRateLimitError

        def before_send(event, hint):
            if "exc_info" in hint:
                exc_type, exc_value, tb = hint["exc_info"]
                if parse_error.defaultErrorResponse in str(exc_value):
                    return None

            return event

        sentry_sdk.init(
            dsn=aera_config.SENTRY_DSN,
            integrations=[FlaskIntegration(), CeleryIntegration()],
            ignore_errors=[
                HTTPException,
                ValueError,
                FileNotFoundError,
                openai.APIStatusError,
                InvokeRateLimitError,
                parse_error.defaultErrorResponse,
            ],
            traces_sample_rate=aera_config.SENTRY_TRACES_SAMPLE_RATE,
            profiles_sample_rate=aera_config.SENTRY_PROFILES_SAMPLE_RATE,
            environment=aera_config.DEPLOY_ENV,
            release=f"aera-{aera_config.CURRENT_VERSION}-{aera_config.COMMIT_SHA}",
            before_send=before_send,
        )
