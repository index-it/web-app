/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    if (process.env.NODE_ENV === "production") {
      return [
        {
          source: '/',
          destination: '/under-construction',
          permanent: false,
        },
        {
          source: '/lists',
          destination: '/under-construction',
          permanent: false,
        },
        {
          source: '/tasks',
          destination: '/under-construction',
          permanent: false,
        },
        {
          source: '/lists/:path*',
          destination: '/under-construction',
          permanent: false,
        },
        {
          source: '/tasks/:path*',
          destination: '/under-construction',
          permanent: false,
        },
      ]
    } else {
      return [];
    }
  },
};

export default nextConfig;
