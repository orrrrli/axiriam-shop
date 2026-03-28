export default function NewOrderLoading(): React.ReactElement {
  return (
    <div className="w-full max-w-[80rem] mx-auto px-[3rem] py-[3rem] max-xs:px-[1.6rem]">
      {/* Header */}
      <div className="flex items-center gap-[1.6rem] mb-[3rem]">
        <div className="w-[3.6rem] h-[3.6rem] rounded-[0.8rem] bg-gray-100 animate-pulse shrink-0" />
        <div className="flex flex-col gap-[0.8rem]">
          <div className="h-[2.8rem] w-[18rem] rounded-[0.5rem] bg-gray-100 animate-pulse" />
          <div className="h-[1.6rem] w-[24rem] rounded-[0.4rem] bg-gray-100 animate-pulse" />
        </div>
      </div>

      <div className="flex flex-col gap-[2.4rem]">
        {/* Información General */}
        <div className="bg-white border border-border rounded-[1.2rem] p-[2.4rem]">
          <div className="h-[1.2rem] w-[16rem] rounded-[0.3rem] bg-gray-100 animate-pulse mb-[1.6rem]" />
          <div className="grid grid-cols-2 gap-[1.6rem]">
            {[0, 1].map((i) => (
              <div key={i} className="flex flex-col gap-[0.6rem]">
                <div className="h-[1.4rem] w-[8rem] rounded-[0.3rem] bg-gray-100 animate-pulse" />
                <div className="h-[4rem] w-full rounded-[0.4rem] bg-gray-100 animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Materiales */}
        <div className="bg-white border border-border rounded-[1.2rem] p-[2.4rem]">
          <div className="h-[1.2rem] w-[20rem] rounded-[0.3rem] bg-gray-100 animate-pulse mb-[1.6rem]" />
          <div className="flex flex-col divide-y divide-border">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="py-[1.6rem] first:pt-0 last:pb-0 flex items-center gap-[1.2rem]">
                <div className="w-[1.6rem] h-[1.6rem] rounded-[0.3rem] bg-gray-100 animate-pulse shrink-0" />
                <div className="flex flex-col gap-[0.5rem] flex-1">
                  <div className="h-[1.6rem] w-[14rem] rounded-[0.3rem] bg-gray-100 animate-pulse" />
                  <div className="h-[1.2rem] w-[10rem] rounded-[0.3rem] bg-gray-100 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-[1.2rem]">
          <div className="h-[4.4rem] w-[10rem] rounded-[0.4rem] bg-gray-100 animate-pulse" />
          <div className="h-[4.4rem] w-[14rem] rounded-[0.4rem] bg-gray-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
