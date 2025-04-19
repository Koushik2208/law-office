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
import { Textarea } from "@/components/ui/textarea";
import ROUTES from "@/constants/routes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import { getCases } from "@/lib/actions/case.actions";
import SelectDropdown from "../dropdowns/SelectDropdown";

interface HearingFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  formType: "CREATE" | "UPDATE";
  onSubmit: (data: T) => Promise<ActionResponse<Hearing>>;
}

const HearingForm = <T extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmit,
}: HearingFormProps<T>) => {
  const router = useRouter();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const result = await getCases({ pageSize: 100 });
        if (result.success && result.data) {
          setCases(result.data.cases);
        }
      } catch (error) {
        console.error("Error fetching cases:", error);
        toast.error("Error loading cases");
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data);

    if (result?.success) {
      toast.success(
        formType === "CREATE"
          ? "Hearing created successfully"
          : "Hearing updated successfully"
      );

      router.push(ROUTES.HEARINGS);
    } else {
      toast.error(result?.error?.message ?? "Something went wrong");
    }
  };

  const buttonText = formType === "CREATE" ? "Create" : "Update";
  const title = formType === "CREATE" ? "Create Hearing" : "Update Hearing";

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
                    if (field.name === "caseId") {
                      return (
                        <FormItem>
                          <FormLabel>Case</FormLabel>
                          <FormControl>
                            <SelectDropdown
                              placeholder="Select Case"
                              options={cases.map((caseItem) => ({
                                value: caseItem._id.toString(),
                                label: `${caseItem.caseNumber} - ${caseItem.title}`,
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

                    if (field.name === "date") {
                      return (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input
                              required
                              type="datetime-local"
                              placeholder="Enter date"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }

                    if (field.name === "description") {
                      return (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter hearing description"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }

                    return (
                      <FormItem>
                        <FormLabel>
                          {field.name === "description"
                            ? "Description"
                            : field.name.charAt(0).toUpperCase() +
                              field.name.slice(1)}
                        </FormLabel>
                        <FormControl>
                          <Input
                            required
                            type="text"
                            placeholder={`Enter ${field.name}`}
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

export default HearingForm;
