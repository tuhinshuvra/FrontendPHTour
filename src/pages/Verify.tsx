/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { RefreshCwIcon } from "lucide-react"
import { useLocation, useNavigate } from "react-router"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { useSendOtpMutation, useVerifyOtpMutation } from "@/redux/features/auth/authApi"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// ================= ZOD SCHEMA =================
const otpSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z
        .string()
        .length(6, "OTP must be exactly 6 digits")
        .regex(/^[0-9]+$/, "OTP must contain only numbers"),
})

type OTPFormData = z.infer<typeof otpSchema>

// ================= COMPONENT =================
export default function Verify() {
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [timer, setTimer] = useState(120);
    // const [timer, setTimer] = useState(7);
    const [sendOtp] = useSendOtpMutation();
    const [verifyOtp] = useVerifyOtpMutation();
    const [email] = useState(location.state)

    useEffect(() => {
        if (!email) {
            navigate("/");
            return;
        }

        if (!confirmed) return;

        // ⏱️ delay before timer starts (e.g. 2 seconds)
        const startDelay = setTimeout(() => {
            const timerId = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerId);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            // cleanup interval
            return () => clearInterval(timerId);
        }, 2000); // 🔥 change delay here (2000ms = 2s)

        return () => clearTimeout(startDelay);
    }, [email, confirmed]);

    const form = useForm<OTPFormData>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            email: email,
            otp: "",
        },
    })

    const handleSendOtp = async () => {
        setLoading(true)
        const toastId = toast.loading("Sending OTP...")

        try {
            const res = await sendOtp({ email }).unwrap()

            if (res.success) {
                toast.success("OTP sent", { id: toastId })
                setConfirmed(true)
                setTimer(120);
                // setTimer(7);
            } else {
                toast.error("Failed to send OTP", { id: toastId })
            }
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong", { id: toastId })
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = async (data: OTPFormData) => {
        const toastId = toast.loading("Verifying OTP...")

        const userInfo = {
            email,
            otp: data.otp,
        };
        setLoading(true);

        try {
            const res = await verifyOtp(userInfo).unwrap()

            if (res.success) {
                toast.success("OTP Verified", { id: toastId })
                setConfirmed(true)
                navigate("/login")
            } else {
                toast.error("Failed to verify OTP", { id: toastId })
            }
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong", { id: toastId })
        } finally {
            setLoading(false)
        }
    }

    // const handleResend = async () => {
    //     try {
    //         await sendOtp({ email }).unwrap()
    //         setTimer(120);
    //         toast.success("OTP resent 📩")
    //     } catch {
    //         toast.error("Failed to resend OTP")
    //     }
    // }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full"
            >
                <Card className="mx-auto max-w-md">
                    {/* HEADER */}
                    <CardHeader>
                        <CardTitle>Verify your email address</CardTitle>

                        <CardDescription>
                            {confirmed ? (
                                <>
                                    Enter the verification code sent to{" "}
                                    <span className="italic font-bold">
                                        {form.watch("email")}
                                    </span>
                                </>
                            ) : (
                                <>
                                    We will send an OTP to{" "}
                                    <span className="font-medium">
                                        {form.watch("email")}
                                    </span>
                                </>
                            )}
                        </CardDescription>
                    </CardHeader>

                    {/* OTP SCREEN */}
                    {confirmed ? (
                        <>
                            <CardContent>
                                <Field>
                                    <div className="space-y-4">

                                        {/* LABEL + RESEND */}
                                        <div className="flex items-center justify-between">
                                            <FieldLabel>
                                                Verification code
                                            </FieldLabel>

                                            <span className="font-bold">
                                                {timer > 0 ? `Resend in ${timer}s` : "You can resend now"}
                                            </span>

                                            <div className=" flex items-center gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    // onClick={handleResend}
                                                    onClick={handleSendOtp}
                                                    disabled={timer !== 0}
                                                    className={cn({
                                                        "cursor-pointer": timer === 0,
                                                        "text-gray-500": timer !== 0
                                                    })}
                                                >
                                                    <RefreshCwIcon className="mr-1 h-4 w-4" />
                                                    Resend OTP
                                                </Button>
                                                {/* <span>{timer}</span> */}
                                            </div>
                                        </div>

                                        {/* OTP INPUT */}

                                        <div className=" flex justify-center">
                                            <InputOTP
                                                id="otp-verification"
                                                maxLength={6}
                                                value={form.watch("otp")}
                                                onChange={(value) =>
                                                    form.setValue("otp", value)
                                                }
                                            >
                                                <InputOTPGroup>
                                                    {[0, 1, 2].map((i) => (
                                                        <InputOTPSlot
                                                            key={i}
                                                            index={i}
                                                            className="h-12 w-11 text-xl"
                                                        />
                                                    ))}
                                                </InputOTPGroup>

                                                <InputOTPSeparator />

                                                <InputOTPGroup>
                                                    {[3, 4, 5].map((i) => (
                                                        <InputOTPSlot
                                                            key={i}
                                                            index={i}
                                                            className="h-12 w-11 text-xl"
                                                        />
                                                    ))}
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </div>

                                        {/* ERROR */}
                                        {form.formState.errors.otp && (
                                            <p className="text-sm text-red-500">
                                                {form.formState.errors.otp.message}
                                            </p>
                                        )}

                                        <FieldDescription>
                                            <a href="#" className="underline">
                                                I no longer have access to this email address.
                                            </a>
                                        </FieldDescription>
                                    </div>
                                </Field>
                            </CardContent>

                            <CardFooter>
                                <div className="w-full space-y-2">
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={loading}
                                    >
                                        {loading ? "Verifying..." : "Verify"}
                                    </Button>

                                    <p className="text-sm text-muted-foreground text-center">
                                        Having trouble?{" "}
                                        <a
                                            href="#"
                                            className="underline hover:text-primary"
                                        >
                                            Contact support
                                        </a>
                                    </p>
                                </div>
                            </CardFooter>
                        </>
                    ) : (
                        <>
                            {/* CONFIRM SCREEN */}
                            <CardFooter>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading}
                                    onClick={handleSendOtp}
                                >
                                    {loading ? "Sending..." : "Send OTP"}
                                </Button>
                            </CardFooter>
                        </>
                    )}
                </Card>
            </form>
        </div>
    )
}