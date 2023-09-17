/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["localhost", "api.ricogann.com"],
    },
    reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: true,
    },
};

module.exports = nextConfig;
