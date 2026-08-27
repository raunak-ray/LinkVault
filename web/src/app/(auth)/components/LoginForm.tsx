"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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
import useLogin from "../hooks/useLogin";
import { LoginSchema, type LoginSchemaType } from "../schemas/login.schema";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending, isError, error, reset } = useLogin();

  const onSubmit = handleSubmit((data: LoginSchemaType) => {
    login(data);
  });

  // Extract server error message(s) from API error response
  const serverErrorData = error?.response?.data;
  const serverErrorMessage = serverErrorData?.message
    ? Array.isArray(serverErrorData.message)
      ? serverErrorData.message.join(", ")
      : serverErrorData.message
    : error?.message || "An unexpected error occurred. Please try again.";

  return (
    <Card className="w-full max-w-md bg-[#1f2731] text-white border border-white/10 shadow-xl rounded-2xl p-2 sm:p-4">
      <CardHeader className="space-y-1.5 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-white">
          Sign in
        </CardTitle>
        <CardDescription className="text-sm text-gray-400">
          Welcome back to your vault
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isError && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs sm:text-sm text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
            <p className="leading-relaxed">{serverErrorMessage}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <Input
                label="Email"
                id="email"
                type="email"
                placeholder="name@example.com"
                value={field.value}
                onChange={(val) => {
                  field.onChange(val);
                  if (isError) reset();
                }}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                disabled={isPending}
                leftIcon={<Mail className="h-4 w-4 text-gray-400" />}
                className="text-white placeholder:text-gray-500"
                classNames={{
                  label: "text-sm text-gray-300",
                  field: "bg-white/5 border-white/10",
                }}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <Input
                label="Password"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={field.value}
                onChange={(val) => {
                  field.onChange(val);
                  if (isError) reset();
                }}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                disabled={isPending}
                leftIcon={<Lock className="h-4 w-4 text-gray-400" />}
                rightIcon={
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
                className="text-white placeholder:text-gray-500"
                classNames={{
                  label: "text-sm text-gray-300",
                  field: "bg-white/5 border-white/10",
                }}
              />
            )}
          />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#2c6390] hover:bg-[#3577ad] text-white rounded-full h-11 text-sm font-medium transition-colors cursor-pointer disabled:opacity-60"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing in...</span>
              </span>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs sm:text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
