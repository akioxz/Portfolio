export default function DashboardLoading() {
  return (
    <div className="p-4 sm:p-8 w-full max-w-screen-xl animate-pulse">
      <div className="flex items-center justify-between pb-6 mb-2">
        <div className="h-7 w-32 bg-slate/10 rounded"></div>
        <div className="h-5 w-16 bg-slate/10 rounded"></div>
      </div>
      <div className="flex flex-col">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="grid grid-cols-12 gap-4 items-center w-full py-4 border-b border-slate/10">
            <div className="col-span-10 md:col-span-4">
              <div className="h-5 w-3/4 bg-slate/10 rounded block"></div>
            </div>
            <div className="hidden md:block md:col-span-6">
              <div className="h-4 w-1/2 bg-slate/5 rounded block"></div>
            </div>
            <div className="col-span-2 flex items-center justify-end gap-2">
              <div className="h-4 w-4 bg-slate/10 rounded"></div>
              <div className="h-4 w-4 bg-slate/10 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
