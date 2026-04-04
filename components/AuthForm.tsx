"use client";

import React from "react";
import { authFormSchema } from "../schema/form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { getAuthFields } from "@/constants/auth-field";
import { AuthType } from "@/types/auth.types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

type props ={
  type: AuthType
}

const AuthForm = ({ type }: props) => {
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
    <div className="card-border w-full max-w-md mx-auto">
      <div className="flex flex-col gap-6 card py-10 px-8">
        <div className="flex flex-row gap-2 justify-center items-center">
          <Image src="/logo.svg" alt="Logo" width={32} height={38} />
          <h2 className="text-primary-100 font-bold">
            Interview Prep Platform
          </h2>
        </div>

        <h3 className="text-center text-xl font-semibold">
          {isSignIn ? "Welcome Back" : "Create Your Account"}
        </h3>
      </div>

      <Card className="w-full">
        <CardContent>
          <form
            id="auth-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <FieldGroup>
              {authFields.map((field) => (
                <Field key={field.name}>
                  <FieldLabel>{field.label}</FieldLabel>
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    {...form.register(field.name)}
                  />
                  {form.formState.errors[field.name] && (
                    <FieldError>
                      {form.formState.errors[field.name]?.message as string}
                    </FieldError>
                  )}
                </Field>
              ))}
            </FieldGroup>

            <Button className="w-full" type="submit">
              {isSignIn ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <p className="text-center mt-6 text-sm">
            {isSignIn
              ? "Don’t have an account?"
              : "Already have an account?"}{" "}
            <Link
              href={isSignIn ? "/sign-up" : "/sign-in"}
              className="font-bold text-user-primary"
            >
              {isSignIn ? "Sign up" : "Sign in"}
            </Link>
          </p>
        </CardContent>

        <CardFooter>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthForm;