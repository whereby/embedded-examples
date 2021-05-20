# Whereby Example

This is an example project to show how to use the
[Whereby Embedded API](https://whereby.dev/) to embed a Whereby room
in your own app/website.

To run this project follow these steps:

1. Follow [this guide](https://web.dev/how-to-use-local-https/#setup) to create a certificate for `embedded-example.com` and move the resulting files (which should be named `embedded-example.com-key.pem` and `embedded-example.com.pem`) to `certificates/`.
2. Add `127.0.0.1 embedded-example.com` as a new line to your `/etc/hosts` file (`sudo vi /etc/hosts`). This is so you can have local HTTPS.
3. Go to your Whereby Embedded dashboard and allow the `https://embedded-example.com:3000` domain.
4. Create a `.env` file and add your Whereby Embedded `API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`.
5. Run `yarn`.
6. Run `yarn start`.
7. Open https://embedded-example.com:3000 in your browser.
