import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type AgreementFormViewProps = {
  isAccepted: boolean;
  isConfirmed: boolean;
  onAcceptedChange: (checked: boolean) => void;
  onConfirm: () => void;
};

export function AgreementFormView({
  isAccepted,
  isConfirmed,
  onAcceptedChange,
  onConfirm
}: AgreementFormViewProps) {
  return (
    <form
      className="agreement-form flex w-full max-w-xl flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6"
      onSubmit={(event) => {
        event.preventDefault();
        onConfirm();
      }}
    >
      <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
        <input
          id="agreementAccepted"
          type="checkbox"
          checked={isAccepted}
          onChange={(event) => onAcceptedChange(event.target.checked)}
          className="mt-1 h-4 w-4 cursor-pointer rounded border-gray-300"
        />
        <div className="space-y-1">
          <Label htmlFor="agreementAccepted" className="cursor-pointer text-sm font-semibold text-gray-900">
            Я принимаю пользовательское соглашение
          </Label>
          <p className="text-xs text-gray-600">
            Для подтверждения необходимо отметить чекбокс.
          </p>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!isAccepted}
        className="w-full bg-brand-600 text-white hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Подтвердить соглашение
      </Button>

      {isConfirmed && (
        <p className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          Соглашение подтверждено.
        </p>
      )}
    </form>
  );
}
