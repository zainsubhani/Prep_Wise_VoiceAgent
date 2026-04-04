import {
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  UserCredential,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUpWithEmail(
  name: string,
  email: string,
  password: string
): Promise<UserCredential> {
  const result = await createUserWithEmailAndPassword(auth, email, password);

  if (name.trim()) {
    await updateProfile(result.user, { displayName: name.trim() });
  }

  return result;
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  return signInWithPopup(auth, provider);
}

export async function signInWithGithub() {
  const provider = new GithubAuthProvider();
  provider.addScope("read:user");
  provider.addScope("user:email");

  return signInWithPopup(auth, provider);
}

/**
 * Works only when you configure a generic OIDC provider in Firebase.
 * For many Firebase projects, LinkedIn is not available as a native provider.
 */
export async function signInWithLinkedIn() {
  const provider = new OAuthProvider("oidc.linkedin");
  return signInWithPopup(auth, provider);
}