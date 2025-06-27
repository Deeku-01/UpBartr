import { Skeleton } from "@/components/ui/skeleton"
export default function SkeletonCard() {
  return (
    <div>
    <div className="flex flex-col space-y-3">
      <div className="flex flex-row space-y-2 gap-4">
        <Skeleton className="h-12 w-12 rounded-full" /> 
        <div className="flex flex-col space-y-1">
            <Skeleton className="h-6 w-[450px]" />
            <Skeleton className="h-4 w-[400px]" />
        </div>
      </div>
       <Skeleton className="h-[125px] w-[250px] rounded-xl" />
    </div>
    <br></br>
    <br></br>
    </div>
  )
}
