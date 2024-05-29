import Link from "next/link";

import Image from "next/image";

const SidebarLogo = () => {
  return (
    <div className="flex flex-shrink-0 items-center mt-2 px-1.5">
      <Image src="/logo.svg" alt="Sidebar logo" height={60} width={60} />
      <Link href="#">
        <span className="text-lg font-semibold">fragmenta.ai</span>
      </Link>
    </div>
  );
};

export default SidebarLogo;
