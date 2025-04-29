
# Aera

Follow the steps below to set up the Aera platform on your local machine.

1. Start the Docker-Compose Stack

The backend requires some middleware, including PostgreSQL, Redis, and Weaviate, which can be started together using docker-compose.

cd ../docker

cp middleware.env.example middleware.env

# Change the profile to another vector database if you're not using Weaviate

docker compose -f docker-compose.middleware.yaml --profile weaviate -p aera up -d

cd ../api

2. Copy .env.example to .env

cp .env.example .env

3. Generate a SECRET_KEY in the .env File

For Linux:

sed -i "/^SECRET_KEY=/c\SECRET_KEY=$(openssl rand -base64 42)" .env

For Mac:

secret_key=$(openssl rand -base64 42)

sed -i '' "/^SECRET_KEY=/c\\

SECRET_KEY=${secret_key}" .env

4. Create Environment

Aera API service uses

Poetry

to manage dependencies. First, you need to add the Poetry shell plugin, if you don't have it already, in order to run in a virtual environment. [Note: Poetry shell is no longer a native command, so you need to install the Poetry plugin beforehand]

poetry self add poetry-plugin-shell

Then, you can execute poetry shell to activate the environment.

5. Install Dependencies

poetry env use 3.12

poetry install

6. Run Migrate

Before the first launch, migrate the database to the latest version.

poetry run python -m flask db upgrade

7. Start Backend

poetry run python -m flask run --host 0.0.0.0 --port=5001 --debug

8. Start Aera Web Service

Follow the instructions for setting up the frontend (see below) to start the web service.

9. Set Up Your Application

Once the web service is running, visit http://localhost:3000 to begin setting up your application.

10. Handle and Debug Async Tasks

If you need to handle and debug async tasks (such as dataset importing or document indexing), start the worker service:

poetry run python -m celery -A app.celery worker -P gevent -c 1 --loglevel INFO -Q dataset,generation,mail,ops_trace,app_deletion

Testing

1. Install Dependencies for Both Backend and Test Environment

poetry install -C api --with dev

#### 2. Run Tests Locally with Mocked System Environment Variables

poetry run -P api bash dev/pytest/pytest_all_tests.sh

----------

### Frontend Setup

#### Getting Started

Before starting the web frontend service, ensure the following environment is ready:

-   Node.js >= v22.11.x
    

-   pnpm v10.x
    

First, install the dependencies:

pnpm  install

Then, configure the environment variables. Create a file named `.env.local` in the current directory and copy the contents from `.env.example`. Moaera the values of these environment variables according to your requirements:

cp .env.example .env.local

For production release, change this to `PRODUCTION`:

NEXT_PUBLIC_DEPLOY_ENV=DEVELOPMENT

The deployment edition:

NEXT_PUBLIC_EDITION=SELF_HOSTED

The base URL of the console application, which refers to the Console base URL of the web service if the console domain is different from the API or web app domain:

NEXT_PUBLIC_API_PREFIX=http://localhost:5001/console/api

The URL for the web app:

NEXT_PUBLIC_PUBLIC_API_PREFIX=http://localhost:5001/api

SENTRY configuration:

NEXT_PUBLIC_SENTRY_DSN=

Finally, run the development server:

pnpm run dev

Visit `http://localhost:3000` in your browser to see the result.

#### Deploy on Server

First, build the app for production:

pnpm run build

Then, start the server:

pnpm run start

If you want to customise the host and port:

pnpm run start --port=3001  --host=0.0.0.0

If you want to customise the number of instances launched by PM2, you can configure `PM2_INSTANCES` in the `docker-compose.yaml` or `Dockerfile`.

# Links
-   ​[X](https://x.com/AeraApp)​
-   ​[App](https://app.aera.ac/)​
-   ​[Git Repository](https://github.com/alandegree/aera)​
-   ​[Discord](https://discord.gg/aera)
