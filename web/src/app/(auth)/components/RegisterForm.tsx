"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-motion";
import { EyeIcon, EyeOffIcon, Text } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/motion/button/base";
import { Input } from "@/components/motion/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getErrorMessage } from "@/lib/api/get-error-message";
import { StatefulButton } from "@/components/motion/button/stateful";
import { RegisterSchema, RegisterSchemaType } from "../schemas/register.schema";
import useRegister from "../hooks/useRegister";
import Link from "next/link";

export default function LoginForm() {
    const { control, handleSubmit, watch } = useForm<RegisterSchemaType>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: { name: "", email: "", password: "" },
        mode: "onBlur",
    });

    const { mutate: register, isPending, error, reset } = useRegister();
    const errorMessage = error ? getErrorMessage(error) : null;
    const [showPassword, setShowPassword] = useState(false);

    // clear stale server error on next keystroke
    useEffect(() => {
        const sub = watch(() => {
            if (error) reset();
        });
        return () => sub.unsubscribe();
    }, [watch, error, reset]);

    const onSubmit = handleSubmit((data) => register(data));

    return (
        <Card className="w-full max-w-md rounded-[20px] p-4 border border-white/20 bg-[#0f141b] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            <CardHeader className="space-y-1.5 pb-3">
                <CardTitle className="text-lg md:text-xl font-bold text-white">
                    Sign in
                </CardTitle>
                <CardDescription className="text-xs md:text-sm text-white/60">
                    Welcome back to your vault.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
                {errorMessage && (
                    <p
                        role="alert"
                        className="rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-sm leading-5 text-red-300"
                    >
                        {errorMessage}
                    </p>
                )}

                <form className="space-y-5" onSubmit={onSubmit} noValidate>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field, fieldState }) => (
                            <Input
                                {...field}
                                label="Name"
                                type="text"
                                placeholder="John Doe"
                                inputMode="text"
                                leftIcon={<Text className="h-4 w-4" />}
                                error={fieldState.error?.message}
                                classNames={{
                                    label: "text-md text-white/90",
                                    field:
                                        "h-[46px] rounded-full bg-white/[0.06] border-white/10",
                                    input:
                                        "text-sm text-white placeholder:text-white/35 sm:text-[15px]",
                                    errorMessage: "text-red-300 text-xs sm:text-sm",
                                }}
                            />
                        )}
                    />


                    <Controller
                        control={control}
                        name="email"
                        render={({ field, fieldState }) => (
                            <Input
                                {...field}
                                label="Email"
                                type="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                inputMode="email"
                                leftIcon={<Mail className="h-4 w-4" />}
                                error={fieldState.error?.message}
                                classNames={{
                                    label: "text-md text-white/90",
                                    field:
                                        "h-[46px] rounded-full bg-white/[0.06] border-white/10",
                                    input:
                                        "text-sm text-white placeholder:text-white/35 sm:text-[15px]",
                                    errorMessage: "text-red-300 text-xs sm:text-sm",
                                }}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field, fieldState }) => (
                            <Input
                                {...field}
                                label="Password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                type={showPassword ? "text" : "password"}
                                error={fieldState.error?.message}
                                classNames={{
                                    label: "text-sm font-medium text-white/90",
                                    field:
                                        "h-[46px] rounded-full bg-white/[0.06] border-white/10",
                                    input:
                                        "text-sm text-white placeholder:text-white/35 sm:text-[15px]",
                                    errorMessage: "text-red-300 text-xs sm:text-sm",
                                }}
                                leftIcon={<Lock className="h-4 w-4" />}
                                rightIcon={
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        aria-label={
                                            showPassword ? "Hide password" : "Show password"
                                        }
                                        onClick={() => setShowPassword((p) => !p)}
                                        className="h-9 w-9 rounded-full bg-transparent text-white/60 hover:bg-transparent hover:text-white"
                                    >
                                        {showPassword ? (
                                            <EyeOffIcon className="h-4 w-4" />
                                        ) : (
                                            <EyeIcon className="h-4 w-4" />
                                        )}
                                    </Button>
                                }
                            />
                        )}
                    />
                    <StatefulButton
                        className="w-full bg-[#054a72] hover:bg-[#054a7278] text-md font-bold"
                        state={isPending ? "loading" : "idle"}
                        type="submit"
                        loadingText="Signing up..."
                    >
                        Sign up
                    </StatefulButton>

                    <p className="text-center text-sm text-white/50">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-medium text-white hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
