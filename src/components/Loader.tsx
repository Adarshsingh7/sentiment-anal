import { Skeleton } from "@/components/ui/skeleton";

export default function Loader() {
  return (
    <div className="w-full p-4 flex items-center justify-between shadow-md rounded-lg bg-white">
      <div className="w-full flex items-center justify-between p-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex gap-3 items-center">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
