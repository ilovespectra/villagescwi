if (!process.env.NEXT_PUBLIC_UNDERDOG_API_KEY) {
  throw new Error(
    "Please set NEXT_PUBLIC_UNDERDOG_API_KEY. You can get your API Key from https://app.underdogprotocol.com"
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
