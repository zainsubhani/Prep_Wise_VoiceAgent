"use client";

import { authFormSchema } from "@/schema/form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

import {
  signInWithEmail,
  signInWithGithub,
  signInWithGoogle,
  signInWithLinkedIn,
  signUpWithEmail,
} from "@/lib/auth";

type Props = {
  type: AuthType;
};

export default function AuthForm({ type }: Props) {
  const router = useRouter();
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
        await signInWithEmail(data.email, data.password);
        toast.success("Signed in successfully");
      } else {
        await signUpWithEmail(data.name ?? "", data.email, data.password);
        toast.success("Account created successfully");
      }

      router.push("/");
    } catch (error: unknown) {
  console.error(error);

  const message =
    error instanceof Error
      ? error.message
      : "Something went wrong";

  toast.error(message);
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
                    className="h-12 rounded-2xl border border-white/10 bg-dark-200/80 px-4 text-white placeholder:text-light-400 focus:border-primary-200"
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

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs uppercase tracking-[0.2em] text-light-400">
              or continue with
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-2xl border border-white/10 bg-dark-200/60 text-white hover:bg-dark-200"
              onClick={async () => {
                try {
                  await signInWithGoogle();
                  toast.success("Signed in with Google");
                  router.push("/");
                } catch (error: unknown) {
  console.error(error);

  const message =
    error instanceof Error
      ? error.message
      : "Something went wrong";

  toast.error(message);
}
              }}
            >
              Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-2xl border border-white/10 bg-dark-200/60 text-white hover:bg-dark-200"
              onClick={async () => {
                try {
                  await signInWithGithub();
                  toast.success("Signed in with GitHub");
                  router.push("/");
                } catch (error: unknown) {
  console.error(error);

  const message =
    error instanceof Error
      ? error.message
      : "Something went wrong";

  toast.error(message);
}
              }}
            >
              GitHub
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-2xl border border-white/10 bg-dark-200/60 text-white hover:bg-dark-200"
              onClick={async () => {
                try {
                  await signInWithLinkedIn();
                  toast.success("Signed in with LinkedIn");
                  router.push("/");
                } catch (error: unknown) {
  console.error(error);

  const message =
    error instanceof Error
      ? error.message
      : "Something went wrong";

  toast.error(message);
}
              }}
            >
              LinkedIn
            </Button>
          </div>

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