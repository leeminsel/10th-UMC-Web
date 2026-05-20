const CommentSkeleton = () => (
  <div className="flex gap-3 p-3 animate-pulse">
    <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
    <div className="flex-1 flex flex-col gap-2">
      <div className="h-3 bg-gray-200 rounded w-24" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-3/4" />
    </div>
  </div>
);

export default CommentSkeleton;
