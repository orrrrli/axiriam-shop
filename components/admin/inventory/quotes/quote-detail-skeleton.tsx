function SkeletonInfoRow(): React.ReactElement {
  return (
    <div className="flex items-center gap-[1rem]">
      <div className="w-[1.6rem] h-[1.6rem] rounded-full bg-gray-100 animate-pulse shrink-0" />
      <div className="h-[1.4rem] w-[7rem] rounded-[0.3rem] bg-gray-100 animate-pulse" />
      <div className="h-[1.4rem] w-[13rem] rounded-[0.3rem] bg-gray-100 animate-pulse" />
    </div>
  );
}

function SkeletonTableRow(): React.ReactElement {
  return (
    <div className="flex items-center px-[1.6rem] py-[1.2rem] border-t border-gray-100 gap-[1.6rem]">
      <div className="h-[1.4rem] flex-1 rounded-[0.3rem] bg-gray-100 animate-pulse" />
      <div className="h-[1.4rem] w-[3rem] rounded-[0.3rem] bg-gray-100 animate-pulse" />
      <div className="h-[1.4rem] w-[6rem] rounded-[0.3rem] bg-gray-100 animate-pulse" />
      <div className="h-[1.4rem] w-[4rem] rounded-[0.3rem] bg-gray-100 animate-pulse" />
      <div className="h-[1.4rem] w-[7rem] rounded-[0.3rem] bg-gray-100 animate-pulse" />
    </div>
  );
}

export default function QuoteDetailSkeleton(): React.ReactElement {
  return (
    <div className="w-full max-w-[80rem] mx-auto px-[3rem] py-[3rem] max-xs:px-[1.6rem]">

      {/* Back navigation */}
      <div className="h-[1.4rem] w-[18rem] rounded-[0.4rem] bg-gray-100 animate-pulse mb-[2.4rem]" />

      {/* Header */}
      <div className="flex items-start justify-between mb-[3rem] flex-wrap gap-[1.6rem]">
        <div className="flex flex-col gap-[0.8rem]">
          <div className="flex items-center gap-[1.2rem]">
            <div className="h-[3rem] w-[14rem] rounded-[0.5rem] bg-gray-100 animate-pulse" />
            <div className="h-[2.2rem] w-[8rem] rounded-full bg-gray-100 animate-pulse" />
          </div>
          <div className="h-[1.4rem] w-[16rem] rounded-[0.4rem] bg-gray-100 animate-pulse" />
        </div>
        <div className="flex items-center gap-[1rem]">
          <div className="h-[3.6rem] w-[9rem] rounded-[0.6rem] bg-gray-100 animate-pulse" />
          <div className="h-[3.6rem] w-[7.5rem] rounded-[0.6rem] bg-gray-100 animate-pulse" />
        </div>
      </div>

      {/* Client info + Quote details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[2.4rem] mb-[3rem]">
        <div className="border border-gray-100 p-[2rem]">
          <div className="h-[1.8rem] w-[20rem] rounded-[0.4rem] bg-gray-100 animate-pulse mb-[1.6rem]" />
          <div className="flex flex-col gap-[1.2rem]">
            <SkeletonInfoRow />
            <SkeletonInfoRow />
            <SkeletonInfoRow />
            <SkeletonInfoRow />
          </div>
        </div>
        <div className="border border-gray-100 p-[2rem]">
          <div className="h-[1.8rem] w-[22rem] rounded-[0.4rem] bg-gray-100 animate-pulse mb-[1.6rem]" />
          <div className="flex flex-col gap-[1.2rem]">
            <SkeletonInfoRow />
            <SkeletonInfoRow />
            <SkeletonInfoRow />
          </div>
        </div>
      </div>

      {/* Items table */}
      <div className="mb-[3rem]">
        <div className="h-[1.8rem] w-[10rem] rounded-[0.4rem] bg-gray-100 animate-pulse mb-[1.2rem]" />
        <div className="border border-gray-100 overflow-hidden">
          <div className="flex items-center px-[1.6rem] py-[1rem] bg-gray-50 gap-[1.6rem]">
            <div className="h-[1.2rem] flex-1 rounded-[0.3rem] bg-gray-200 animate-pulse" />
            <div className="h-[1.2rem] w-[3rem] rounded-[0.3rem] bg-gray-200 animate-pulse" />
            <div className="h-[1.2rem] w-[6rem] rounded-[0.3rem] bg-gray-200 animate-pulse" />
            <div className="h-[1.2rem] w-[4rem] rounded-[0.3rem] bg-gray-200 animate-pulse" />
            <div className="h-[1.2rem] w-[7rem] rounded-[0.3rem] bg-gray-200 animate-pulse" />
          </div>
          <SkeletonTableRow />
          <SkeletonTableRow />
          <SkeletonTableRow />
        </div>
      </div>

      {/* Notes + Totals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[2.4rem]">
        <div className="border border-gray-100 p-[2rem]">
          <div className="h-[1.8rem] w-[7rem] rounded-[0.4rem] bg-gray-100 animate-pulse mb-[1rem]" />
          <div className="flex flex-col gap-[0.8rem]">
            <div className="h-[1.4rem] w-full rounded-[0.3rem] bg-gray-100 animate-pulse" />
            <div className="h-[1.4rem] w-[80%] rounded-[0.3rem] bg-gray-100 animate-pulse" />
            <div className="h-[1.4rem] w-[60%] rounded-[0.3rem] bg-gray-100 animate-pulse" />
          </div>
        </div>
        <div className="border border-gray-100 p-[2rem]">
          <div className="h-[1.8rem] w-[9rem] rounded-[0.4rem] bg-gray-100 animate-pulse mb-[1.2rem]" />
          <div className="flex flex-col gap-[0.8rem]">
            {([0, 1, 2] as const).map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-[1.4rem] w-[8rem] rounded-[0.3rem] bg-gray-100 animate-pulse" />
                <div className="h-[1.4rem] w-[7rem] rounded-[0.3rem] bg-gray-100 animate-pulse" />
              </div>
            ))}
            <div className="border-t border-gray-100 pt-[1rem] flex justify-between">
              <div className="h-[1.8rem] w-[6rem] rounded-[0.4rem] bg-gray-100 animate-pulse" />
              <div className="h-[1.8rem] w-[9rem] rounded-[0.4rem] bg-gray-100 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
