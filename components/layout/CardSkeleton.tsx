import React from "react";

const CardSkeleton = ({ number = 5 }: { number: number }) => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      {Array.from({ length: number }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-[2/2] w-full rounded-lg bg-muted"></div>
          <div className="mt-2 h-4 w-3/4 rounded bg-muted"></div>
          <div className="mt-2 h-3 w-1/2 rounded bg-muted"></div>
        </div>
      ))}
    </div>
  );
};

export default CardSkeleton;
