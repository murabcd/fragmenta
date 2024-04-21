import Image from "next/image";

export const Loading = () => {
  return (
    <div className="h-full w-full flex flex-col gap-y-4 justify-center items-center">
      <Image
        src="/logo.svg"
        alt="Logo"
        width={100}
        height={100}
        className="animate-pulse duration-700"
        priority={true}
      />
    </div>
  );
};
