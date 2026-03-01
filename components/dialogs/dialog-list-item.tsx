import Link from "next/link";

type DialogListItemProps = {
  id: string;
  participantName: string;
  lastMessage: string;
  unreadCount: number;
};

export function DialogListItem({
  id,
  participantName,
  lastMessage,
  unreadCount
}: DialogListItemProps) {
  return (
    <Link
      href={`/dialogs/${id}`}
      className="dialog-list-item flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-brand-300"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-gray-900">{participantName}</p>
        <p className="truncate text-sm text-gray-600">{lastMessage}</p>
      </div>
      {unreadCount > 0 && (
        <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white">
          {unreadCount}
        </span>
      )}
    </Link>
  );
}
