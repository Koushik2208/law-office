"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CaseForm from "@/components/forms/CaseForm";
import { getCaseById, updateCase } from "@/lib/actions/case.actions";
import { UpdateCaseSchema } from "@/lib/validations";
import { CaseStatus } from "@/types/enums";
import logger from "@/lib/logger";

const CaseUpdatePage = () => {
  const params = useParams();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const result = await getCaseById({ id: params.id as string });
        if (result.success && result.data) {
          setCaseData(result.data);
        }
      } catch (error) {
        logger.error("Error fetching case:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!caseData) {
    return <div>Case not found</div>;
  }

  return (
    <div className="container mx-auto">
      <CaseForm
        formType="UPDATE"
        schema={UpdateCaseSchema}
        defaultValues={{
          id: caseData._id.toString(),
          caseNumber: caseData.caseNumber,
          title: caseData.title,
          clientName: caseData.clientName,
          lawyerId: caseData.lawyerId?._id.toString() || "",
          courtId: caseData.courtId?._id.toString() || "",
          status: caseData.status as CaseStatus,
          hearingIds: caseData.hearingIds?.map(id => id.toString()) || [],
        }}
        onSubmit={updateCase}
      />
    </div>
  );
};

export default CaseUpdatePage;
