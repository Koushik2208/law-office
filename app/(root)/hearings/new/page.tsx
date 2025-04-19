"use client";

import HearingForm from "@/components/forms/HearingForm";
import { createHearing } from "@/lib/actions/hearing.actions";
import { CreateHearingSchema } from "@/lib/validations";

const NewHearing = () => {
  return (
    <div className="container mx-auto py-10">
      <HearingForm
        formType="CREATE"
        schema={CreateHearingSchema}
        defaultValues={{
          caseNumber: "",
          date: "",
          description: "",
        }}
        onSubmit={createHearing}
      />
    </div>
  );
};

export default NewHearing;
