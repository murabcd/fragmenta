import Link from "next/link";

import Image from "next/image";

const Logo = () => {
	return (
		<div className="flex flex-shrink-0 items-center">
			<Link href="/" className="flex items-center">
				<Image
					src="/logo.svg"
					alt="logo"
					height={32}
					width={32}
					className="dark:hidden mr-2"
				/>
				<Image
					src="/logo-dark.svg"
					alt="logo"
					height={32}
					width={32}
					className="hidden dark:block mr-2"
				/>

				<span className="text-lg leading-none">Fragmenta</span>
			</Link>
		</div>
	);
};

export default Logo;
