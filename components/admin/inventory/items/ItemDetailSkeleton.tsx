export default function ItemDetailSkeleton(): React.ReactElement {
  return (
    <div className="w-full max-w-[96rem] mx-auto px-[3rem] py-[3rem] max-xs:px-[1.6rem]">
      {/* Back + Header */}
      <div className="flex items-center gap-[1.6rem] mb-[3rem]">
        <div className="w-[3.6rem] h-[3.6rem] rounded-[0.8rem] bg-gray-100 animate-pulse shrink-0" />
        <div className="flex-1 flex flex-col gap-[0.8rem]">
          <div className="flex items-center gap-[1rem] flex-wrap">
            <div className="h-[2.6rem] w-[22rem] rounded-[0.5rem] bg-gray-100 animate-pulse" />
            <div className="h-[2rem] w-[8rem] rounded-full bg-gray-100 animate-pulse" />
            <div className="h-[2rem] w-[10rem] rounded-full bg-gray-100 animate-pulse" />
          </div>
          <div className="h-[1.6rem] w-[18rem] rounded-[0.4rem] bg-gray-100 animate-pulse" />
        </div>
        <div className="h-[3.6rem] w-[10rem] rounded-[0.6rem] bg-gray-100 animate-pulse shrink-0" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-[1fr_2fr] gap-[2.4rem] max-xs:grid-cols-1">
        {/* Left: Photo + Tags */}
        <div className="flex flex-col gap-[2rem]">
          <div className="aspect-square w-full rounded-[1.2rem] bg-gray-100 animate-pulse" />

          <div className="bg-white border border-gray-100 rounded-[1.2rem] p-[2rem]">
            <div className="h-[1.6rem] w-[9rem] rounded-[0.4rem] bg-gray-100 animate-pulse mb-[1.4rem]" />
            <div className="flex flex-wrap gap-[0.6rem]">
              <div className="h-[2.8rem] w-[8rem] rounded-full bg-gray-100 animate-pulse" />
              <div className="h-[2.8rem] w-[10rem] rounded-full bg-gray-100 animate-pulse" />
              <div className="h-[2.8rem] w-[6rem] rounded-full bg-gray-100 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col gap-[2rem]">
          {/* 4 info cards */}
          <div className="grid grid-cols-2 gap-[1.2rem] max-xs:grid-cols-1">
            {([0, 1, 2, 3] as const).map((i) => (
              <div
                key={i}
                className="flex items-start gap-[1.2rem] p-[1.6rem] bg-white border border-gray-100 rounded-[1rem]"
              >
                <div className="w-[3.6rem] h-[3.6rem] rounded-[0.8rem] bg-gray-100 animate-pulse shrink-0" />
                <div className="flex flex-col gap-[0.6rem] flex-1 pt-[0.2rem]">
                  <div className="h-[1.2rem] w-[7rem] rounded-[0.3rem] bg-gray-100 animate-pulse" />
                  <div className="h-[1.8rem] w-[4rem] rounded-[0.3rem] bg-gray-100 animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="bg-white border border-gray-100 rounded-[1.2rem] p-[2rem]">
            <div className="h-[1.6rem] w-[6rem] rounded-[0.4rem] bg-gray-100 animate-pulse mb-[1.2rem]" />
            <div className="flex flex-col gap-[0.8rem]">
              <div className="h-[1.4rem] w-full rounded-[0.3rem] bg-gray-100 animate-pulse" />
              <div className="h-[1.4rem] w-[85%] rounded-[0.3rem] bg-gray-100 animate-pulse" />
              <div className="h-[1.4rem] w-[60%] rounded-[0.3rem] bg-gray-100 animate-pulse" />
            </div>
          </div>

          {/* 2 date cards */}
          <div className="grid grid-cols-2 gap-[1.2rem] max-xs:grid-cols-1">
            {([0, 1] as const).map((i) => (
              <div
                key={i}
                className="flex items-start gap-[1.2rem] p-[1.6rem] bg-white border border-gray-100 rounded-[1rem]"
              >
                <div className="w-[3.6rem] h-[3.6rem] rounded-[0.8rem] bg-gray-100 animate-pulse shrink-0" />
                <div className="flex flex-col gap-[0.6rem] flex-1 pt-[0.2rem]">
                  <div className="h-[1.2rem] w-[5rem] rounded-[0.3rem] bg-gray-100 animate-pulse" />
                  <div className="h-[1.8rem] w-[11rem] rounded-[0.3rem] bg-gray-100 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
