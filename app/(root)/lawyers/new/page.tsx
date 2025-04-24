"use client";

import LawyerForm from "@/components/forms/LawyerForm";
import { createLawyer } from "@/lib/actions/lawyer.actions";
import { CreateLawyerSchema } from "@/lib/validations";
import { LawyerRole, LawyerSpecialization } from "@/types/enums";

const NewLawyer = () => {

  return (
    <div className="container mx-auto">
      <LawyerForm
        formType="CREATE"
        schema={CreateLawyerSchema}
        defaultValues={{
          name: "",
          email: "",
          specialization: LawyerSpecialization.Other,
          role: LawyerRole.Guest,
          barNumber: "",
        }}
        onSubmit={createLawyer}
      />
    </div>
  );
};

export default NewLawyer;
