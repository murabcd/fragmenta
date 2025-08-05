/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
			},
			{
				protocol: "https",
				hostname: "avatar.vercel.sh",
			},
			{
				protocol: "https",
				hostname: "brilliant-cobra-27.convex.cloud",
			},
			{
				protocol: "https",
				hostname: "giddy-ladybug-159.convex.cloud",
			},
		],
	},
};

export default nextConfig;
