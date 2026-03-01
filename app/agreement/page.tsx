import { AgreementFormContainer } from "@/components/agreement/agreement-form-container";

export default function AgreementPage() {
  return (
    <section className="agreement-page mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 md:px-6">
      <header className="rounded-xl border border-gray-200 bg-white p-6">
        <h1 className="text-3xl font-semibold text-gray-900">Форма принятия соглашения</h1>
        <p className="mt-2 text-sm text-gray-600">
          Redux управляет состоянием чекбокса и активацией кнопки подтверждения.
        </p>
      </header>

      <AgreementFormContainer />
    </section>
  );
}
