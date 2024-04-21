import Image from "next/image";

const SidebarLogo = () => {
  return (
    <div className="flex flex-shrink-0 items-center px-1.5">
      <Image src="/logo.svg" alt="Sidebar logo" height={40} width={40} />
      <p className="text-xl font-bold">fragmenta.ai</p>
    </div>
  );
};

export default SidebarLogo;
