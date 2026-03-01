"use client";

import { AgreementFormView } from "@/components/agreement/agreement-form-view";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { confirmAgreement, setAccepted } from "@/lib/store/slices/agreement-slice";

export function AgreementFormContainer() {
  const dispatch = useAppDispatch();
  const { isAccepted, isConfirmed } = useAppSelector((state) => state.agreement);

  return (
    <AgreementFormView
      isAccepted={isAccepted}
      isConfirmed={isConfirmed}
      onAcceptedChange={(checked) => dispatch(setAccepted(checked))}
      onConfirm={() => dispatch(confirmAgreement())}
    />
  );
}
