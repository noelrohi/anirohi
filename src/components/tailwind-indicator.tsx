export function TailwindIndicator() {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed bottom-1 left-1 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 p-3 font-mono text-white text-xs">
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:block 2xl:hidden lg:hidden md:hidden xl:hidden">
        sm
      </div>
      <div className="hidden md:block 2xl:hidden lg:hidden xl:hidden">md</div>
      <div className="hidden lg:block 2xl:hidden xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  );
}
