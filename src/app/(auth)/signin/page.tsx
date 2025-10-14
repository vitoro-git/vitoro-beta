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
import { useRouter } from "next/navigation";
import { authClient } from "@/features/auth/config/client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SocialAuthButtons } from "@/features/auth/components/social-auth-buttons";

const signInSchema = z.object({
  email: z.email().min(1),
  password: z.string().min(6),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function handleSignIn(data: SignInForm) {
    await authClient.signIn.email(
      { ...data, callbackURL: "/app" },
      {
        onError: (error) => {
          if (error.error.code === "EMAIL_NOT_VERIFIED") {
            router.push(`/verify?email=${data.email}`);
          }
          toast.error(error.error.message || "Failed to sign in");
        },
        onSuccess: () => {
          router.push("/app");
        },
      }
    );
  }

  return (
    <main className="place-items-center grid h-full">
      <Card className="w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(handleSignIn)}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email webauthn"
                          {...field}
                        />
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
                      <div className="flex justify-between items-center">
                        <FormLabel>Password</FormLabel>
                        <Button
                          variant="link"
                          size="sm"
                          className="font-normal text-sm underline"
                          asChild
                        >
                          <Link href="/forgot-password">Forgot password?</Link>
                        </Button>
                      </div>
                      <FormControl>
                        <PasswordInput
                          autoComplete="current-password webauthn"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  <LoadingSwap isLoading={isSubmitting}>Sign In</LoadingSwap>
                </Button>
                <p className="text-muted-foreground text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup">Sign Up</Link>
                </p>
                <Separator />
                <div className="gap-4 grid grid-cols-2">
                  <SocialAuthButtons />
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
