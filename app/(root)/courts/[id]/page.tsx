"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CourtForm from "@/components/forms/CourtForm";
import { getCourtById, updateCourt } from "@/lib/actions/court.actions";
import { UpdateCourtSchema } from "@/lib/validations";
import logger from "@/lib/logger";

const CourtUpdatePage = () => {
  const params = useParams();
  const [courtData, setCourtData] = useState<Court | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourt = async () => {
      try {
        const result = await getCourtById({ id: params.id as string });
        if (result.success && result.data) {
          setCourtData(result.data);
        }
      } catch (error) {
        logger.error("Error fetching court:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourt();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!courtData) {
    return <div>Court not found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <CourtForm
        formType="UPDATE"
        schema={UpdateCourtSchema}
        defaultValues={{
          id: courtData._id.toString(),
          name: courtData.name,
          location: courtData.location,
        }}
        onSubmit={updateCourt}
      />
    </div>
  );
};

export default CourtUpdatePage;
