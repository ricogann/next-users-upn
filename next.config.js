/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    images: {
        domains: ["localhost", "api.ricogann.com"],
        unoptimized: true,
    },
    reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: true,
    },
    trailingSlash: true,
};

module.exports = nextConfig;
