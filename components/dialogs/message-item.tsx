type MessageItemProps = {
  author: string;
  text: string;
  sentAt: string;
  isOwn: boolean;
};

export function MessageItem({ author, text, sentAt, isOwn }: MessageItemProps) {
  return (
    <article
      className={`message-item max-w-[85%] rounded-xl border p-3 text-sm ${
        isOwn
          ? "ml-auto border-brand-300 bg-brand-50 text-gray-900"
          : "mr-auto border-gray-200 bg-white text-gray-800"
      }`}
    >
      <div className="mb-1 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{author}</span>
        <span className="text-xs text-gray-400">{sentAt}</span>
      </div>
      <p>{text}</p>
    </article>
  );
}
