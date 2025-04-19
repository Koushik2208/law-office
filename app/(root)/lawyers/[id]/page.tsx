"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LawyerForm from "@/components/forms/LawyerForm";
import { getLawyerById, updateLawyer } from "@/lib/actions/lawyer.actions";
import { UpdateLawyerSchema } from "@/lib/validations";
import { LawyerRole, LawyerSpecialization } from "@/types/enums";
import logger from "@/lib/logger";

const LawyerUpdatePage = () => {
  const params = useParams();
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        const result = await getLawyerById({ id: params.id as string });
        if (result.success && result.data) {
          setLawyer(result.data);
        }
      } catch (error) {
        logger.error("Error fetching lawyer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyer();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!lawyer) {
    return <div>Lawyer not found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <LawyerForm
        formType="UPDATE"
        schema={UpdateLawyerSchema}
        defaultValues={{
          id: lawyer._id.toString(),
          name: lawyer.name,
          email: lawyer.email || "",
          specialization: lawyer.specialization as LawyerSpecialization,
          role: lawyer.role as LawyerRole,
          barNumber: lawyer.barNumber || "",
        }}
        onSubmit={updateLawyer}
      />
    </div>
  );
};

export default LawyerUpdatePage;
