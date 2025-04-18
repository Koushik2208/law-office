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
import Link from "next/link";
import { LawyerSpecialization } from "@/types/enums"; // Import your enum
import EnumDropdown from "../dropdowns/EnumDropdown";

interface AuthFormProps<T extends FieldValues> {
    schema: ZodType<T>;
    defaultValues: T;
    formType: "SIGN_IN" | "SIGN_UP";
    onSubmit: (data: T) => Promise<ActionResponse>;
}

const AuthForm = <T extends FieldValues>({ schema, defaultValues, formType, onSubmit }: AuthFormProps<T>) => {
    const router = useRouter();

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>,
    });

    const handleSubmit: SubmitHandler<T> = async (data) => {
        const result = (await onSubmit(data)) as ActionResponse;

        if (result?.success) {
            toast.success(
                formType === "SIGN_IN"
                    ? "Signed in successfully"
                    : "Signed up successfully"
            );

            router.push(ROUTES.HOME);
        } else {
            toast.error(result?.error?.message ?? "Something went wrong");
        }
    };

    const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";
    const title = formType === "SIGN_IN" ? "Welcome Back" : "Create Account";

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        {Object.keys(defaultValues).map((field) => (
                            <FormField
                                key={field}
                                control={form.control}
                                name={field as Path<T>}
                                render={({ field }) => {
                                    if (field.name === "specialization") {
                                        return (
                                            <FormItem>
                                                <FormLabel>Specialization</FormLabel>
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

                                    return (
                                        <FormItem>
                                            <FormLabel>
                                                {field.name === "email"
                                                    ? "Email Address"
                                                    : field.name === "password"
                                                        ? "Password"
                                                        : field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    required
                                                    type={field.name === "password" ? "password" : "text"}
                                                    placeholder={`Enter your ${field.name}`}
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
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting
                                ? buttonText === "Sign In"
                                    ? "Signing In..."
                                    : "Signing Up..."
                                : buttonText}
                        </Button>

                        <div>
                            {formType === "SIGN_IN" ? (
                                <p>
                                    Don&apos;t have an account?{" "}
                                    <Link href={ROUTES.SIGN_UP} className="text-primary hover:underline">
                                        Sign up
                                    </Link>
                                </p>
                            ) : (
                                <p>
                                    Already have an account?{" "}
                                    <Link href={ROUTES.SIGN_IN} className="text-primary hover:underline">
                                        Sign in
                                    </Link>
                                </p>
                            )}
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default AuthForm;