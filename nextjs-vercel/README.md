# Next.js Example with serverless function

Next.js example project to work with Whereby APIs as Vercel [serverless functions](https://vercel.com/docs/serverless-functions/introduction).

## Preview

Preview the example live on [StackBlitz](http://stackblitz.com/):

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/whereby/embedded-examples/tree/main/nextjs-vercel)

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/whereby/embedded-examples/tree/main/nextjs-vercel&project-name=whereby-nextjs-vercel&repository-name=whereby-nextjs-vercel)

### Environment Variables

In order to use Whereby embedded APIs and Webhook callbacks in Vercel serverless functions, we are using `WHEREBY_WEBHOOK_SECRET` and `WHEREBY_API_KEY`.

- `WHEREBY_WEBHOOK_SECRET` is the secret that you get when creating a webhook in the "Webhooks" section of the Whereby Embedded dashboard.
- `WHEREBY_API_KEY` is an API key you generate in the "API keys" section of the Whereby Embedded dashboard.

Then go to your Vercel project settings page and add them as [environment variables](https://vercel.com/docs/environment-variables)

### Allowed domains

In order to use Whereby embedded meetings in an iframe, you need to add your newly deployed project domain as [allowed domains](https://whereby.com/information/embedded-guide/#allowed-domains) on your Whereby embedded dashboard "Allowed domains" section.


## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/whereby/embedded-examples/tree/main/nextjs-vercel whereby-nextjs-vercel
# or
yarn create next-app --example https://github.com/whereby/embedded-examples/tree/main/nextjs-vercel whereby-nextjs-vercel
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/whereby/meetings](http://localhost:3000/api/whereby/meetings). This endpoint can be edited in `pages/api/whereby/meetings/index.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
