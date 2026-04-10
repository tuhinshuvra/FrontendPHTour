"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator, } from "@/components/ui/field";
import { Input } from "@/components/ui/Input";
import Password from "@/components/ui/Password";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";

/* ------------------ ZOD SCHEMA ------------------ */
const registerSchema = z.object({
    name: z.string()
        .min(4, "Name must be at least 4 characters")
        .max(40, "Name must be less than 40 characters"),
    // name: z.string().min(4).max(40),

    email: z.email(),
    // email: z.email("Invalid email address"),

    password: z.string().min(8).max(21),
    // .min(8, "Password must be at least 8 characters")
    // .max(21, "Password must be less than 21 characters"),
    // .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    // .regex(/[a-z]/, "Must contain at least one lowercase letter")
    // .regex(/[0-9]/, "Must contain at least one number")
    // .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),

    confirmPassword: z.string().min(8).max(21),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type RegisterFormValues = z.infer<typeof registerSchema>;

/* ------------------ COMPONENT ------------------ */
export function RegisterForm({ className, ...props }: React.ComponentProps<"form">) {

    const [register] = useRegisterMutation();
    const navigate = useNavigate();

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        }
    });

    const onSubmit = async (data: RegisterFormValues) => {
        console.log("Form Data:", data);
        const userInfo = {
            name: data.name,
            email: data.email,
            password: data.password
        }

        try {
            const result = await register(userInfo).unwrap();
            console.log("OnSubmit Result : ", result);
            toast.success("User Created Successfully");
            navigate("/verify");
        } catch (error) {
            console.log("User Registration Error : ", error);
        }
    };

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("flex flex-col gap-6", className)}
            {...props}
        >
            <FieldGroup>
                {/* Header */}
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Create your account</h1>
                    <p className="text-sm text-muted-foreground">
                        Fill in the form below to create your account
                    </p>
                </div>

                {/* Name */}
                <Field>
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                    <Input id="name" {...form.register("name")} placeholder="Satta Annanda" />
                    {form.formState.errors.name && (
                        <FieldDescription className="text-red-500">
                            {form.formState.errors.name.message}
                        </FieldDescription>
                    )}
                </Field>

                {/* Email */}
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" type="email" {...form.register("email")} placeholder="example@company.com" />
                    {form.formState.errors.email && (
                        <FieldDescription className="text-red-500">
                            {form.formState.errors.email.message}
                        </FieldDescription>
                    )}
                </Field>

                {/* Password */}
                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>

                    <div className="relative">
                        <Password {...form.register("password")} />
                    </div>

                    {form.formState.errors.password && (
                        <FieldDescription className="text-red-500">
                            {form.formState.errors.password.message}
                        </FieldDescription>
                    )}
                </Field>

                {/* Confirm Password */}
                <Field>
                    <FieldLabel htmlFor="confirm-password">
                        Confirm Password
                    </FieldLabel>
                    <div className="relative">
                        <Password {...form.register("confirmPassword")} />
                    </div>
                    {form.formState.errors.confirmPassword && (
                        <FieldDescription className="text-red-500">
                            {form.formState.errors.confirmPassword.message}
                        </FieldDescription>
                    )}
                </Field>

                {/* Submit */}
                <Field>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        Create Account
                    </Button>
                </Field>

                {/* Divider */}
                <FieldSeparator>Or continue with</FieldSeparator>

                {/* GitHub Button */}
                <Field>
                    <Button variant="outline" type="button">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="mr-2 h-4 w-4"
                        >
                            <path
                                d="M12 .297c-6.63 0-12 5.373-12 12..."
                                fill="currentColor"
                            />
                        </svg>
                        Sign up with GitHub
                    </Button>

                    <FieldDescription className="px-6 text-center">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    );
}