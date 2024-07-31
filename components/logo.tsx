import Link from "next/link";

import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex flex-shrink-0 items-center">
      <Image
        src="/logo.svg"
        alt="logo"
        height={20}
        width={20}
        className="dark:hidden mr-2"
      />
      <Image
        src="/logo-dark.svg"
        alt="logo"
        height={20}
        width={20}
        className="hidden dark:block mr-2"
      />
      <Link href="/">
        <span className="text-lg">fragmenta /ai</span>
      </Link>
    </div>
  );
};

export default Logo;
