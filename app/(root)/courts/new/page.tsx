"use client";

import CourtForm from "@/components/forms/CourtForm";
import { createCourt } from "@/lib/actions/court.actions";
import { CreateCourtSchema } from "@/lib/validations";

const NewCourt = () => {
  return (
    <div className="container mx-auto">
      <CourtForm
        formType="CREATE"
        schema={CreateCourtSchema}
        defaultValues={{
          name: "",
          location: "",
        }}
        onSubmit={createCourt}
      />
    </div>
  );
};

export default NewCourt;
