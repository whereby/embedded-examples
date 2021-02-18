# Whereby Example

To run this project follow these steps:

1. Follow [this guide](https://web.dev/how-to-use-local-https/#setup) to create a certificate for `embedded-example.com` and pass its `key/cert` paths in `api/src/index.js` and `app/server.js`.
2. Add `127.0.0.1 embedded-example.com` as a new line to your `/etc/hosts` file (`sudo vi /etc/hosts`). This is so you can have local HTTPS.
3. Go to your Whereby Embedded dashboard and allow the `https://embedded-example.com:3000` domain.
4. Create a `.env` file and add your Whereby Embedded `API_KEY={}`.
5. Run `npm run install-deps`.
6. Run `npm start`.
7. Open https://embedded-example.com:3000 in your browser.
