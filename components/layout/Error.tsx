import React from "react";

const Error = ({ error }: { error: string }) => {
  return (
    <div className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <p className="text-muted-foreground"></p>
      <p className="text-sm text-muted-foreground">
        {error || "An unexpected error occurred. Please try again later."}
      </p>
    </div>
  );
};

export default Error;
