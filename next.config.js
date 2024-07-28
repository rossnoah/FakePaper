module.exports = {
  async rewrites() {
    return [
      {
        source: "/storage/:path*",
        destination: process.env.BLOB_URL + "/:path*",
      },
    ];
  },
};
