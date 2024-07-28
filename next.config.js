module.exports = {
  async rewrites() {
    return [
      {
        source: "/storage/:path*",
        destination: process.env.NEXT_PUBLIC_BLOB_URL + "/storage/:path*",
      },
    ];
  },
};
