/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["localhost"],
    },
    reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: true,
    },
};

module.exports = nextConfig;
