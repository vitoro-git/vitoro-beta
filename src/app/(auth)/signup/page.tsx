"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { toast } from "sonner";
import { authClient } from "@/features/auth/config/client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { SocialAuthButtons } from "@/features/auth/components/social-auth-buttons";
import { generateColor } from "@/lib/utils";

const signUpSchema = z.object({
  name: z.string().min(1),
  email: z.email().min(1),
  password: z.string().min(6),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function handleSignUp(data: SignUpForm) {
    const res = await authClient.signUp.email(
      { ...data, color: generateColor(), callbackURL: "/app" },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to sign up");
        },
      }
    );

    if (res.error == null && !res.data.user.emailVerified) {
      router.push(`/verify?email=${data.email}`);
    }
  }

  return (
    <main className="place-items-center grid h-full">
      <Card className="w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleSignUp)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full"
              >
                <LoadingSwap isLoading={form.formState.isSubmitting}>
                  Sign Up
                </LoadingSwap>
              </Button>
              <p className="text-muted-foreground text-sm">
                Already have an account? <Link href="/signin">Sign In</Link>
              </p>
              <Separator />
              <div className="gap-4 grid grid-cols-2">
                <SocialAuthButtons />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
