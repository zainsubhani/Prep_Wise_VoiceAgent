export type AuthType = "sign-in" | "sign-up";
 export type AuthFieldConfig = {
  name: "name" | "email" | "password";
  label: string;
  type: string;
  placeholder: string;
};