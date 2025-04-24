"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm } from "react-hook-form";
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
import { LawyerRole, LawyerSpecialization } from "@/types/enums";
import EnumDropdown from "../dropdowns/EnumDropdown";
import logger from "@/lib/logger";

interface LawyerFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  formType: "CREATE" | "UPDATE";
  onSubmit: (data: T) => Promise<ActionResponse<Lawyer>>;
}

const LawyerForm = <T extends FieldValues>({ 
  schema, 
  defaultValues, 
  formType, 
  onSubmit 
}: LawyerFormProps<T>) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    logger.info("handleSubmit", data);
    const result = await onSubmit(data);

    if (result?.success) {
      toast.success(
        formType === "CREATE"
          ? "Lawyer created successfully"
          : "Lawyer updated successfully"
      );

      router.push(ROUTES.LAWYERS);
    } else {
      toast.error(result?.error?.message ?? "Something went wrong");
    }
  };

  const buttonText = formType === "CREATE" ? "Create" : "Update";
  const title = formType === "CREATE" ? "Create Lawyer" : "Update Lawyer";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {Object.keys(defaultValues)
              .filter(field => formType === "CREATE" || field !== "id")
              .map((field) => (
              <FormField
                key={field}
                control={form.control}
                name={field as Path<T>}
                render={({ field }) => {
                  if (field.name === "specialization") {
                    return (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Specialization</FormLabel>
                        <FormControl>
                          <EnumDropdown
                            placeholder="Select Specialization"
                            enumType={LawyerSpecialization}
                            onChange={field.onChange}
                            defaultValue={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }

                  if (field.name === "role") {
                    return (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Role</FormLabel>
                        <FormControl>
                          <EnumDropdown
                            placeholder="Select Role"
                            enumType={LawyerRole}
                            onChange={field.onChange}
                            defaultValue={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }

                  return (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        {field.name === "email"
                          ? "Email Address"
                          : field.name === "barNumber"
                          ? "Bar Number"
                          : field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                      </FormLabel>
                      <FormControl>
                        <Input
                          required
                          type={field.name === "email" ? "email" : "text"}
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
              className="w-full mt-6"
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

export default LawyerForm;