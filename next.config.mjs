/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true
    },
    images: {
        domains: ['icons8.com'], // Add the domain of your external image source here
    },
};

export default nextConfig;
