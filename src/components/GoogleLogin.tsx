import Image from "next/image";

export default function GoogleLogin({
  handleClick,
}: {
  handleClick: () => void;
}) {
  return (
    <button
      onClick={handleClick}
      className="py-3 w-full rounded-[4px] shadow-md flex items-center justify-center gap-4 border-[1px] border-gray-200"
    >
      <Image src="/google.webp" alt="google" height={25} width={25} />
      <p className="text-sm font-medium">Sign in with Google</p>
    </button>
  );
}
