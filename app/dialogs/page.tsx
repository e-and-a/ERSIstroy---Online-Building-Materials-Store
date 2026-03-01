import { DialogListItem } from "@/components/dialogs/dialog-list-item";
import { getDemoDialogs } from "@/lib/demo-dialogs";

export default function DialogsPage() {
  const dialogs = getDemoDialogs();

  return (
    <section className="dialogs-page mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 md:px-6">
      <header className="rounded-xl border border-gray-200 bg-white p-6">
        <h1 className="text-3xl font-semibold text-gray-900">Диалоги</h1>
        <p className="mt-2 text-sm text-gray-600">
          Пример страницы с передачей имени собеседника и последнего сообщения через props.
        </p>
      </header>

      <div className="grid gap-3">
        {dialogs.map((dialog) => (
          <DialogListItem
            key={dialog.id}
            id={dialog.id}
            participantName={dialog.participantName}
            lastMessage={dialog.lastMessage}
            unreadCount={dialog.unreadCount}
          />
        ))}
      </div>
    </section>
  );
}
