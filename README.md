# eyecatcher

App to generate eye catch displays from pages of books.

# How to...

## Test locally

It seems that Firebase emulators doesn't know about your GCP project, so the function fails if you try to make a Vision API call. Because of this, you need to explicitly tell the function about your project:

In functions/.env.local:

```
ENVIRONMENT=dev
PROJECT_ID=[your project ID, e.g 12345678]
SERVICE_ACCOUNT_FILE=serviceAccountKey.json
```

You also need to create a serviceAccountKey.json for your emulator, and place it in functions/serviceAccountKey.json.

Then start the emulator:

```
nvm use 16
firebase emulators:start
```

The web component can't use React's `npm start` directly because I was getting CORS errors from trying to connect to Functions emulator:

```
# In /web
npm run devbuild
```

## Deploy the backend

```
firebase deploy --only functions
```

# Setup

Backend lives in firebase project: [eyecatch-generator](https://console.firebase.google.com/project/eyecatch-generator/overview).

## OpenAI Key

OpenAI key lives in firebase secrets. Follow instructions in https://firebase.google.com/docs/functions/config-env#secret-manager.

```
# OpenAI key lives in firebase secrets
firebase functions:secrets:set OPENAI_API_KEY
# Enter your key

# This can be managed in the secrets manager: https://console.cloud.google.com/security/secret-manager?referrer=search&project=eyecatch-generator
```

This is used inside functions/processImage.
