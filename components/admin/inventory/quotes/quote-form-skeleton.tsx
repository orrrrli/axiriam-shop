function SkeletonSection({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <div className="bg-white border border-border rounded-[0.8rem] p-[2.4rem]">
      {children}
    </div>
  );
}

function SkeletonField(): React.ReactElement {
  return (
    <div className="flex flex-col gap-[0.8rem]">
      <div className="h-[1.2rem] w-[9rem] rounded-[0.3rem] bg-gray-100 animate-pulse" />
      <div className="h-[4.2rem] w-full rounded-none bg-gray-100 animate-pulse" />
    </div>
  );
}

export default function QuoteFormSkeleton(): React.ReactElement {
  return (
    <div className="w-full max-w-[80rem] mx-auto px-[3rem] py-[3rem] max-xs:px-[1.6rem]">

      {/* Back navigation */}
      <div className="h-[1.4rem] w-[18rem] rounded-[0.4rem] bg-gray-100 animate-pulse mb-[2.4rem]" />

      {/* Page title */}
      <div className="mb-[3rem]">
        <div className="h-[3rem] w-[22rem] rounded-[0.5rem] bg-gray-100 animate-pulse" />
      </div>

      <div className="flex flex-col gap-[2.4rem]">

        {/* Client info */}
        <SkeletonSection>
          <div className="h-[1.8rem] w-[20rem] rounded-[0.4rem] bg-gray-100 animate-pulse mb-[2rem]" />
          <div className="grid grid-cols-2 gap-x-[3.2rem] gap-y-[2rem]">
            <SkeletonField />
            <SkeletonField />
            <SkeletonField />
            <SkeletonField />
          </div>
        </SkeletonSection>

        {/* Quote settings */}
        <SkeletonSection>
          <div className="h-[1.8rem] w-[26rem] rounded-[0.4rem] bg-gray-100 animate-pulse mb-[2rem]" />
          <div className="grid grid-cols-3 gap-x-[3.2rem] gap-y-[2rem] mb-[2rem]">
            <SkeletonField />
            <SkeletonField />
            <SkeletonField />
          </div>
          <div className="flex flex-col gap-[1.2rem]">
            <div className="flex items-center gap-[0.8rem]">
              <div className="w-[1.6rem] h-[1.6rem] rounded-[0.3rem] bg-gray-100 animate-pulse" />
              <div className="h-[1.4rem] w-[22rem] rounded-[0.3rem] bg-gray-100 animate-pulse" />
            </div>
            <div className="flex items-center gap-[2rem]">
              <div className="h-[1.2rem] w-[7rem] rounded-[0.3rem] bg-gray-100 animate-pulse" />
              <div className="flex items-center gap-[0.6rem]">
                <div className="w-[1.6rem] h-[1.6rem] rounded-full bg-gray-100 animate-pulse" />
                <div className="h-[1.3rem] w-[3rem] rounded-[0.3rem] bg-gray-100 animate-pulse" />
              </div>
              <div className="flex items-center gap-[0.6rem]">
                <div className="w-[1.6rem] h-[1.6rem] rounded-full bg-gray-100 animate-pulse" />
                <div className="h-[1.3rem] w-[3rem] rounded-[0.3rem] bg-gray-100 animate-pulse" />
              </div>
            </div>
          </div>
        </SkeletonSection>

        {/* Items section */}
        <SkeletonSection>
          <div className="flex items-center justify-between mb-[1.6rem]">
            <div className="h-[1.8rem] w-[9rem] rounded-[0.4rem] bg-gray-100 animate-pulse" />
            <div className="h-[1.6rem] w-[14rem] rounded-[0.4rem] bg-gray-100 animate-pulse" />
          </div>
          <div className="border border-dashed border-gray-200 rounded-[0.4rem] py-[2.4rem] flex items-center justify-center">
            <div className="h-[1.4rem] w-[28rem] rounded-[0.3rem] bg-gray-100 animate-pulse" />
          </div>
        </SkeletonSection>

        {/* Extras section */}
        <SkeletonSection>
          <div className="flex items-center justify-between mb-[1.6rem]">
            <div className="h-[1.8rem] w-[22rem] rounded-[0.4rem] bg-gray-100 animate-pulse" />
            <div className="h-[1.6rem] w-[12rem] rounded-[0.4rem] bg-gray-100 animate-pulse" />
          </div>
          <div className="border border-dashed border-gray-200 rounded-[0.4rem] py-[2.4rem] flex items-center justify-center">
            <div className="h-[1.4rem] w-[32rem] rounded-[0.3rem] bg-gray-100 animate-pulse" />
          </div>
        </SkeletonSection>

        {/* Notes + Totals */}
        <div className="grid grid-cols-2 gap-[2.4rem]">
          <SkeletonSection>
            <div className="h-[1.8rem] w-[7rem] rounded-[0.4rem] bg-gray-100 animate-pulse mb-[1.6rem]" />
            <div className="h-[16rem] w-full rounded-none bg-gray-100 animate-pulse" />
          </SkeletonSection>
          <SkeletonSection>
            <div className="h-[1.8rem] w-[9rem] rounded-[0.4rem] bg-gray-100 animate-pulse mb-[1.6rem]" />
            <div className="flex flex-col gap-[1.4rem]">
              {([0, 1, 2] as const).map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-[1.4rem] w-[8rem] rounded-[0.3rem] bg-gray-100 animate-pulse" />
                  <div className="h-[1.4rem] w-[7rem] rounded-[0.3rem] bg-gray-100 animate-pulse" />
                </div>
              ))}
              <div className="border-t border-border pt-[1.4rem] flex justify-between">
                <div className="h-[1.8rem] w-[6rem] rounded-[0.4rem] bg-gray-100 animate-pulse" />
                <div className="h-[2.4rem] w-[10rem] rounded-[0.4rem] bg-gray-100 animate-pulse" />
              </div>
            </div>
          </SkeletonSection>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-[1.2rem] pb-[1.6rem]">
          <div className="h-[4rem] w-[10rem] rounded-[0.6rem] bg-gray-100 animate-pulse" />
          <div className="h-[4rem] w-[16rem] rounded-[0.6rem] bg-gray-100 animate-pulse" />
        </div>

      </div>
    </div>
  );
}
