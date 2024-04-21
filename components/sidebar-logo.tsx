import Image from "next/image";

const SidebarLogo = () => {
  return (
    <div className="flex flex-shrink-0 items-center px-1.5">
      <Image src="/logo.svg" alt="Sidebar logo" height={60} width={60} />
      <p className="text-2xl font-semibold">fragmenta.ai</p>
    </div>
  );
};

export default SidebarLogo;
