"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import HearingForm from "@/components/forms/HearingForm";
import { getHearingById, updateHearing } from "@/lib/actions/hearing.actions";
import { UpdateHearingSchema } from "@/lib/validations";
import logger from "@/lib/logger";

const HearingUpdatePage = () => {
  const params = useParams();
  const [hearingData, setHearingData] = useState<Hearing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHearing = async () => {
      try {
        const result = await getHearingById({ id: params.id as string });
        if (result.success && result.data) {
          setHearingData(result.data);
        }
      } catch (error) {
        logger.error("Error fetching hearing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHearing();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!hearingData) {
    return <div>Hearing not found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <HearingForm
        formType="UPDATE"
        schema={UpdateHearingSchema}
        defaultValues={{
          id: hearingData._id,
          caseNumber: hearingData.caseId.caseNumber,
          date: hearingData.date,
          description: hearingData.description,
        }}
        onSubmit={updateHearing}
      />
    </div>
  );
};

export default HearingUpdatePage;
