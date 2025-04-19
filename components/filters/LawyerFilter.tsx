"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getLawyers } from "@/lib/actions/lawyer.actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";
import { FilterSkeleton } from "../skeletons/FilterSkeleton";

export default function LawyerFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const { data } = await getLawyers({ pageSize: 100 });
        if (data) setLawyers(data.lawyers);
      } catch (error) {
        console.error("Error fetching lawyers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLawyers();
  }, []);

  const handleLawyerChange = (value: string) => {
    if (value === "all") {
      const newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ["lawyerId"],
      });
      router.push(newUrl);
    } else {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "lawyerId",
        value,
      });
      router.push(newUrl);
    }
  };

  if (isLoading) {
    return <FilterSkeleton />;
  }

  return (
    <div className="w-full max-w-[240px] max-md:max-w-full">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-muted-foreground">
          Lawyer
        </label>
        <Select
          value={searchParams.get("lawyerId") || "all"}
          onValueChange={handleLawyerChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select lawyer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Lawyers</SelectItem>
            {lawyers.map((lawyer) => (
              <SelectItem key={lawyer._id} value={lawyer._id}>
                {lawyer.name} ({lawyer.specialization})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
