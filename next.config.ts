/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "https://soumissions-auto.ca",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
