/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["localhost", "api.ricogann.com"],
        // unoptimized: true,
    },
    reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: true,
    },
};

module.exports = nextConfig;
