# Villages Gallery

Bootstrapped with the [Underdog Next JS Gallery](https://github.com/UnderdogProtocol/underdog-nextjs-gallery)

Visit [Underdog](https://www.underdogprotocol.com/) to learn more.

## Villages CWI

The VillagesDAO Clean Water Initiative represents a partnership between Aerial IoT, Cryptochicks NFT Community, and LavaDAO. Our goal is to establish wireless connectivity, earning opportunities, and water monitoring for impacted communities around the globe. Our first SORMN has been deployed near Navi Mumbai, and our teams of women leaders are spearheading operations on the ground. Contribute to our cause by purchasing an NFT or simply donating. Follow us on [twitter](https://twitter.com/villagesdao) to learn more.

## Quick Start

  - Get setup on [Underdog](https://www.underdogprotocol.com/) to get your Underdog keys. 
  - Get setup on [Sphere](https://spherepay.co/) to get your Sphere keys. 
  - Get setup on [Stripe](https://stripe.com/) to get your Stripe keys.

### Rename and configure your `.env` file.

Rename `.env.template` to `.env` and replace the values with your acquired keys. For your front-end, deployments on Vercel will need variables to start with `NEXT_PUBLIC_` in order for your UI to call them. Import this `.env` file to your Vercel Environment Variables in Settings. 

1. Install dependencies

```
yarn
```

2. Run the development server

```
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Webhook Setup

You can run the setup script to automatically generate webhooks on both Underdog and Sphere.

```
yarn run setup
```

Note: you'll need to have your Underdog API key and Sphere API key, set your network, and set the app URL in your environment variables.

Otherwise, you can use the interface to manually create webhooks.

### Underdog

1. Go to [https://app.underdogprotocol.com/webhooks](https://app.underdogprotocol.com/webhooks)

2. Click **Add Webhook**

3. Set URL to `${APP_URL}/api/underdog/webhooks` and select `project.create`

### Sphere

1. Go to [https://spherepay.co/dashboard/developers/webhooks](https://spherepay.co/dashboard/developers/webhooks)

2. Click **Create Webhook**

3. Set URL to `${APP_URL}/api/sphere/webhooks` and select `Payment Successful`

## Environment Variables

| Variable | Description | Example
| --- | --- | --- |
| `APP_URL` | The URL of the app used to redirect after a successful payment on the Sphere checkout page | [https://gallery.underdogprotocol.com](https://gallery.underdogprotocol.com) |
| `NEXT_PUBLIC_APP_NAME` | The name of the app used in the header | Underdog Gallery |
| `NEXT_PUBLIC_NETWORK` | Either MAINNET for Solana mainnet-beta or DEVNET for Solana devnet  | DEVNET |
| `UNDERDOG_API_KEY` | Key to authenticate your Underdog requests generated from [https://app.underdogprotocol.com/apikeys](https://app.underdogprotocol.com/apikeys) | 1cc491851db99d.aasdfasdf342423524531242 |
| `SPHERE_API_KEY` | Key to authenticate your Sphere requests generated from [https://spherepay.co/dashboard/developers/api-keys](https://spherepay.co/dashboard/developers/api-keys) | secret_aasdfasdf342423524531242 |
| `SPHERE_WEBHOOK_SECRET` | Secret to validate webhook requests sent from Sphere | secret_123dsafdsafadsf |

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FUnderdogProtocol%2Funderdog-nextjs-gallery&env=UNDERDOG_API_KEY,SPHERE_API_KEY,APP_URL,NEXT_PUBLIC_APP_NAME,NEXT_PUBLIC_NETWORK,SPHERE_WEBHOOK_SECRET&envDescription=You%20can%20grab%20your%20Underdog%20API%20Key&envLink=https%3A%2F%2Fapp.underdogprotocol.com)
