"use client";

import { authFormSchema } from "@/schema/form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { getAuthFields } from "@/constants/auth-field";
import { AuthType } from "@/types/auth.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

type Props = {
  type: AuthType;
};

export default function AuthForm({ type }: Props) {
  const isSignIn = type === "sign-in";
  const formSchema = authFormSchema(type);

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const authFields = getAuthFields(type);

  const onSubmit = async (data: FormValues) => {
    try {
      if (isSignIn) {
        console.log("Sign In:", data);
        toast.success("Signed in successfully");
      } else {
        console.log("Sign Up:", data);
        toast.success("Account created successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <section className="relative w-full max-w-md">
      <div className="absolute inset-0 rounded-3xl bg-primary-200/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-3xl border border-primary-200/20 bg-dark-100/80 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-xl">
        <div className="border-b border-white/10 px-6 py-8 sm:px-8">
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary-200/20 bg-dark-200/80">
              <Image src="/logo.svg" alt="Logo" width={24} height={24} />
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-primary-200/70">
                PrepWise
              </p>
              <h1 className="text-lg font-semibold text-primary-100">
                Interview Prep Platform
              </h1>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-semibold text-white">
              {isSignIn ? "Welcome back" : "Create your account"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-light-400">
              {isSignIn
                ? "Sign in to continue your interview preparation journey."
                : "Create an account to start practicing smarter interviews."}
            </p>
          </div>
        </div>

        <div className="px-6 py-8 sm:px-8">
          <form
            id="auth-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FieldGroup className="space-y-5">
              {authFields.map((field) => (
                <Field key={field.name} className="space-y-2">
                  <FieldLabel className="text-sm font-medium text-light-100">
                    {field.label}
                  </FieldLabel>

                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    {...form.register(field.name)}
                    className="h-12 rounded-2xl border border-white/10 bg-dark-200/80 px-4 text-white placeholder:text-light-400 focus:border-primary-200 focus:ring-0"
                  />

                  {form.formState.errors[field.name] && (
                    <FieldError className="text-sm text-destructive-100">
                      {form.formState.errors[field.name]?.message as string}
                    </FieldError>
                  )}
                </Field>
              ))}
            </FieldGroup>

            <div className="space-y-3 pt-2">
              <Button
                type="submit"
                className="h-12 w-full rounded-2xl bg-primary-200 font-semibold text-dark-100 hover:bg-primary-200/85"
              >
                {isSignIn ? "Sign In" : "Create Account"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-12 w-full rounded-2xl border border-white/10 bg-transparent text-light-100 hover:bg-dark-200 hover:text-white"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-light-400">
            {isSignIn
              ? "Don’t have an account?"
              : "Already have an account?"}{" "}
            <Link
              href={isSignIn ? "/sign-up" : "/sign-in"}
              className="font-semibold text-primary-200 transition hover:text-primary-100"
            >
              {isSignIn ? "Sign up" : "Sign in"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}