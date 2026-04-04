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

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}

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
      error instanceof Error ? error.message : "Something went wrong";

    toast.error(message);
  }
};


  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success("Signed in with Google");
      router.push("/");
    } catch (error: unknown) {
      console.error(error);
      toast.error(getErrorMessage(error));
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signInWithGithub();
      toast.success("Signed in with GitHub");
      router.push("/");
    } catch (error: unknown) {
      console.error(error);
      toast.error(getErrorMessage(error));
    }
  };

  const handleLinkedInSignIn = async () => {
    try {
      await signInWithLinkedIn();
      toast.success("Signed in with LinkedIn");
      router.push("/");
    } catch (error: unknown) {
      console.error(error);
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <section className="relative w-full max-w-xl">
      <div className="absolute inset-0 rounded-4xl bg-cyan-400/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-[#0a1022]/85 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,255,224,0.08),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(0,119,255,0.06),transparent_25%)]" />

        <div className="relative border-b border-white/10 px-6 py-8 sm:px-10">
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-white/5 shadow-[0_0_30px_rgba(0,255,224,0.08)]">
              <Image src="/logo.svg" alt="Logo" width={28} height={28} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-400">
              AXIS AI
              </p>
              <h1 className="text-lg font-semibold text-white">
                Interview Prep Platform
              </h1>
            </div>
          </div>

          <div className="text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.32em] text-cyan-400">
              Secure Access
            </p>

            <h2 className="text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-5xl">
              {isSignIn ? "Welcome Back" : "Create Account"}
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-white/55 sm:text-base">
              {isSignIn
                ? "Sign in to continue your AI-powered interview preparation and track your progress."
                : "Create your account to start practicing with structured, high-signal interview workflows."}
            </p>
          </div>
        </div>

        <div className="relative px-6 py-8 sm:px-10">
          <form
            id="auth-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FieldGroup className="space-y-5">
              {authFields.map((field) => (
                <Field key={field.name} className="space-y-2">
                  <FieldLabel className="text-sm font-medium text-white/85">
                    {field.label}
                  </FieldLabel>

                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    {...form.register(field.name)}
                    className="h-13 rounded-2xl border border-white/10 bg-white/4 px-4 text-white placeholder:text-white/30 focus:border-cyan-400/60 focus:bg-white/6 focus-visible:ring-0"
                  />

                  {form.formState.errors[field.name] && (
                    <FieldError className="text-sm text-red-400">
                      {form.formState.errors[field.name]?.message as string}
                    </FieldError>
                  )}
                </Field>
              ))}
            </FieldGroup>

            <div className="space-y-3 pt-2">
              <Button
                type="submit"
                className="h-13 w-full rounded-2xl bg-cyan-400 text-base font-bold text-black transition hover:bg-cyan-300"
              >
                {isSignIn ? "Sign In" : "Create Account"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-13 w-full rounded-2xl border border-white/10 bg-transparent text-white/80 transition hover:bg-white/5 hover:text-white"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
            </div>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[11px] uppercase tracking-[0.24em] text-white/35">
              or continue with
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-2xl border border-white/10 bg-white/3 text-white transition hover:border-cyan-400/40 hover:bg-white/6"
              onClick={handleGoogleSignIn}
            >
              Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-2xl border border-white/10 bg-white/3 text-white transition hover:border-cyan-400/40 hover:bg-white/6"
              onClick={handleGithubSignIn}
            >
              GitHub
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-2xl border border-white/10 bg-white/3 text-white transition hover:border-cyan-400/40 hover:bg-white/6"
              onClick={handleLinkedInSignIn}
            >
              LinkedIn
            </Button>
          </div>

          <div className="mt-7 text-center text-sm text-white/45">
            {isSignIn
              ? "Don’t have an account?"
              : "Already have an account?"}{" "}
            <Link
              href={isSignIn ? "/sign-up" : "/sign-in"}
              className="font-semibold text-cyan-400 transition hover:text-cyan-300"
            >
              {isSignIn ? "Sign up" : "Sign in"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}