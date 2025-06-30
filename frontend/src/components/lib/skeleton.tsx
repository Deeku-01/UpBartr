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

export function SkeletonCardReq() {
  return (
   <div className="min-h-screen w-full color-gray-300 p-4 ">
      <Skeleton className="h-[200px] w-full rounded-xl" />
                <br></br>
      <Skeleton className="h-[200px] w-full rounded-xl" />
    </div>
  )
}

export function smallprofileDisplay(){
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
    </div>
  )
}
