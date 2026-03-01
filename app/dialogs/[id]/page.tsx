import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageItem } from "@/components/dialogs/message-item";
import { getDemoDialogById, getDemoMessagesByDialogId } from "@/lib/demo-dialogs";

type DialogDetailsPageProps = {
  params: {
    id: string;
  };
};

export default function DialogDetailsPage({ params }: DialogDetailsPageProps) {
  const dialog = getDemoDialogById(params.id);

  if (!dialog) {
    notFound();
  }

  const messages = getDemoMessagesByDialogId(dialog.id);

  return (
    <section className="dialog-details-page mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 md:px-6">
      <header className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">
          <Link href="/dialogs" className="hover:text-brand-700">
            Диалоги
          </Link>{" "}
          / {dialog.participantName}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900">{dialog.participantName}</h1>
        <p className="mt-2 text-sm text-gray-600">
          Сообщения ниже рендерятся через компонент `MessageItem` с props: author, text, sentAt, isOwn.
        </p>
      </header>

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            author={message.author}
            text={message.text}
            sentAt={message.sentAt}
            isOwn={message.isOwn}
          />
        ))}
      </div>
    </section>
  );
}
