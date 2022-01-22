# Project Apollo API

REST API for Project Apollo 🚀 integrated with machine learning to classify category for feedbacks powered by [TensorflowJS](https://www.tensorflow.org/js).

## Prerequisite

Follow instruction at [Project Apollo TensorflowJS](https://github.com/junwen-k/project-apollo-tfjs) on how to train the machine learning model which is used in this application.
Copy the trained model into this application and set env `MODEL_FEEDBACK_CATEGORY_CLASSIFIER_URL` to point to the `model.json` for the tf model.

## Installation

### Application

1. Install dependencies.

        npm i
        yarnpkg

2. Build source codes.

        npm run build
        yarn build

3. Run server.

        npm run start
        yarn start

### Database

1. Install `sqlite3` by following the [documentation](https://www.sqlite.org/quickstart.html).

2. Run database migration with [prisma](https://www.prisma.io/).

        npx prisma migrate dev --name init

## Development

By default, server will be available on localhost:3000.

1. Run development server with hot reload.

        npm run dev
        yarn dev
