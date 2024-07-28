module.exports = {
  async rewrites() {
    return [
      {
        source: "/storage/:path*",
        destination: process.env.BLOB_URL + "/:path*",
      },
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
};
