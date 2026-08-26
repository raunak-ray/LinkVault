"use client";

import useLogin from "../hooks/useLogin";
import { useForm } from "react-hook-form";
import { LoginSchema, LoginSchemaType } from "../schemas/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LoginForm() {
  const { mutate: login, isPending, isError, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (data: LoginSchemaType) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Email</label>

        <input type="email" {...register("email")} />

        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div>
        <label>Password</label>

        <input type="password" {...register("password")} />

        {errors.password && <p>{errors.password.message}</p>}
      </div>

      {isError && <p>{error.message}</p>}

      <button type="submit" disabled={isPending}>
        {isPending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
