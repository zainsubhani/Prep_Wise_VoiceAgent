import { AuthFieldConfig, AuthType } from "@/types/auth.types";

export const getAuthFields = (type: AuthType) =>
  [
    ...(type === "sign-up"
      ? [
          {
            name: "name" as const,
            label: "Full Name",
            type: "text",
            placeholder: "Enter your full name",
          },
        ]
      : []),
    {
      name: "email" as const,
      label: "Email",
      type: "email",
      placeholder: "Enter your email",
    },
    {
      name: "password" as const,
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
    },
  ] satisfies AuthFieldConfig[];