import Image from "next/image";

export const Loading = () => {
  return (
    <div className="h-full w-full flex flex-col gap-y-4 justify-center items-center">
      <Image
        src="/logo.svg"
        alt="Logo"
        width={30}
        height={30}
        className="animate-pulse duration-700 dark:hidden"
        priority
      />
      <Image
        src="/logo-dark.svg"
        alt="Logo"
        width={30}
        height={30}
        className="animate-pulse duration-700 hidden dark:block"
        priority
      />
    </div>
  );
};
