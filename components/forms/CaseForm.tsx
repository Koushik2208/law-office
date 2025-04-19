"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { z, ZodType } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ROUTES from "@/constants/routes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CaseStatus } from "@/types/enums";
import EnumDropdown from "../dropdowns/EnumDropdown";
import { useEffect, useState } from "react";
import { getLawyers } from "@/lib/actions/lawyer.actions";
import { getCourts } from "@/lib/actions/court.actions";
import SelectDropdown from "../dropdowns/SelectDropdown";

interface CaseFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  formType: "CREATE" | "UPDATE";
  onSubmit: (data: T) => Promise<ActionResponse<Case>>;
}

const CaseForm = <T extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmit,
}: CaseFormProps<T>) => {
  const router = useRouter();
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lawyersResult, courtsResult] = await Promise.all([
          getLawyers({ pageSize: 100 }),
          getCourts({ pageSize: 100 }),
        ]);

        if (lawyersResult.success && lawyersResult.data) {
          setLawyers(lawyersResult.data.lawyers);
        }

        if (courtsResult.success && courtsResult.data) {
          setCourts(courtsResult.data.courts);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading form data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data);

    if (result?.success) {
      toast.success(
        formType === "CREATE"
          ? "Case created successfully"
          : "Case updated successfully"
      );

      router.push(ROUTES.CASES);
    } else {
      toast.error(result?.error?.message ?? "Something went wrong");
    }
  };

  const buttonText = formType === "CREATE" ? "Create" : "Update";
  const title = formType === "CREATE" ? "Create Case" : "Update Case";

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {Object.keys(defaultValues)
              .filter((field) => formType === "CREATE" || field !== "id")
              .map((field) => (
                <FormField
                  key={field}
                  control={form.control}
                  name={field as Path<T>}
                  render={({ field }) => {
                    if (field.name === "status") {
                      return (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <EnumDropdown
                              placeholder="Select Status"
                              enumType={CaseStatus}
                              onChange={field.onChange}
                              defaultValue={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }

                    if (field.name === "lawyerId") {
                      return (
                        <FormItem>
                          <FormLabel>Lawyer</FormLabel>
                          <FormControl>
                            <SelectDropdown
                              placeholder="Select Lawyer"
                              options={lawyers.map((lawyer) => ({
                                value: lawyer._id.toString(),
                                label: `${lawyer.name} (${lawyer.specialization})`,
                              }))}
                              defaultValue={field.value}
                              required={true}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }

                    if (field.name === "courtId") {
                      return (
                        <FormItem>
                          <FormLabel>Court</FormLabel>
                          <FormControl>
                            <SelectDropdown
                              placeholder="Select Court"
                              options={courts.map((court) => ({
                                value: court._id.toString(),
                                label: `${court.name} (${court.location})`,
                              }))}
                              defaultValue={field.value}
                              required={true}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }

                    return (
                      <FormItem>
                        <FormLabel>
                          {field.name === "caseNumber"
                            ? "Case Number"
                            : field.name === "clientName"
                            ? "Client Name"
                            : field.name.charAt(0).toUpperCase() +
                              field.name.slice(1)}
                        </FormLabel>
                        <FormControl>
                          <Input
                            required
                            type="text"
                            placeholder={`Enter ${
                              field.name === "caseNumber"
                                ? "case number"
                                : field.name
                            }`}
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              ))}

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? buttonText === "Create"
                  ? "Creating..."
                  : "Updating..."
                : buttonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CaseForm;
