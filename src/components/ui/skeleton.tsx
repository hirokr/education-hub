"use client";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin ${className}`}
      {...props}
    />
  );
}
