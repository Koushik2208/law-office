"use client";

import CaseForm from "@/components/forms/CaseForm";
import { createCase } from "@/lib/actions/case.actions";
import { CreateCaseSchema } from "@/lib/validations";
import { CaseStatus } from "@/types/enums";

const NewCase = () => {
  return (
    <div className="container mx-auto py-10">
      <CaseForm
        formType="CREATE"
        schema={CreateCaseSchema}
        defaultValues={{
          caseNumber: "",
          title: "",
          clientName: "",
          lawyerId: "",
          courtId: "",
          status: CaseStatus.Pending,
        }}
        onSubmit={createCase}
      />
    </div>
  );
};

export default NewCase;


