# eyecatcher

App to generate eye catch displays from pages of books.

# How to...

## Test locally

```
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
