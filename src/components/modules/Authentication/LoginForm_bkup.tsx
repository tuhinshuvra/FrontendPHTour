/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/Input";
import { Link, useNavigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import config from "@/config";

/* ------------------ ZOD SCHEMA ------------------ */
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/* ------------------ ERROR MAP ------------------ */
const errorMessages: Record<number, string> = {
    400: "Bad request",
    401: "Invalid email or password",
    403: "User blocked or inactive",
    404: "User not found",
    410: "User account deleted",
};

/* ------------------ COMPONENT ------------------ */
export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
    const navigate = useNavigate();
    const location = useLocation();
    const [login] = useLoginMutation();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    /* ------------------ HANDLE GOOGLE ERROR ------------------ */
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const error = params.get("error");

        if (error) {
            toast.error(decodeURIComponent(error));
        }
    }, [location.search]);

    /* ------------------ SUBMIT ------------------ */
    const onSubmit = async (data: LoginFormValues) => {
        try {
            const res = await login(data).unwrap();

            if (res.success) {
                toast.success("Login successful");
                navigate("/");
            }
        } catch (error: any) {
            console.error(error);

            const message =
                error?.data?.message || error?.error || "Login failed";
            const statusCode = error?.status;

            // 🔥 Special case
            if (statusCode === 400 && message === "User is not verified") {
                toast.error("Your account is not verified");
                return navigate("/verify", { state: data.email });
            }

            toast.error(errorMessages[statusCode] || message);
        }
    };

    /* ------------------ GOOGLE LOGIN ------------------ */
    // const handleGoogleLogin = () => {
    //     window.location.href = "http://localhost:5000/api/v1/auth/google";
    // };

    const handleGoogleLogin = () => {
        window.location.assign(`${config.baseUrl}/auth/google`);
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
                    <h1 className="text-2xl font-bold">Login to your account</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your email below to login
                    </p>
                </div>

                {/* Email */}
                <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                        type="email"
                        placeholder="example@company.com"
                        {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                        <FieldDescription className="text-red-500">
                            {form.formState.errors.email.message}
                        </FieldDescription>
                    )}
                </Field>

                {/* Password */}
                <Field>
                    <div className="flex items-center">
                        <FieldLabel>Password</FieldLabel>
                        <Link
                            to="/forgot-password"
                            className="ml-auto text-sm hover:underline"
                        >
                            Forgot?
                        </Link>
                    </div>

                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            {...form.register("password")}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-2 flex items-center"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>

                    {form.formState.errors.password && (
                        <FieldDescription className="text-red-500">
                            {form.formState.errors.password.message}
                        </FieldDescription>
                    )}
                </Field>

                {/* Submit */}
                <Field>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                </Field>

                <FieldSeparator>Or continue with</FieldSeparator>

                {/* Google */}
                <Field>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleGoogleLogin}
                    >
                        Continue with Google
                    </Button>

                    <FieldDescription className="text-center">
                        Don&apos;t have an account?{" "}
                        <Link to="/register" className="underline">
                            Sign up
                        </Link>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    );
}