/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["localhost", "ricogann.com"],
    },
    reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: true,
    },
};

module.exports = nextConfig;
