import React from 'react'

const DetailSkeleton = () => {
  return (
    <div className="container grid gap-6 py-8 md:grid-cols-[300px_1fr] md:gap-12 lg:gap-16 px-8">
      <div className="animate-pulse">
        <div className="aspect-[2/3] w-full rounded-lg bg-muted"></div>
      </div>
      <div className="space-y-4 animate-pulse">
        <div className="h-10 w-3/4 rounded-lg bg-muted"></div>
        <div className="h-6 w-1/2 rounded-lg bg-muted"></div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-muted"></div>
          <div className="h-4 w-full rounded bg-muted"></div>
          <div className="h-4 w-3/4 rounded bg-muted"></div>
        </div>
      </div>
    </div>
  )
}

export default DetailSkeleton