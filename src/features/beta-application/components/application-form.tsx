"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { createBetaApplication } from "../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type ApplicationForm = z.infer<typeof applicationSchema>;

const applicationSchema = z.object({
  email: z.email().min(1),
});

export default function ApplicationForm() {
  const form = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      email: "",
    },
  });

  async function handleApply(data: ApplicationForm) {
    try {
      await createBetaApplication(data.email);
      toast.success("Applied for beta access", { richColors: true });
    } catch (err) {
      console.error(err);
      toast.error("Failed to apply for beta access", { richColors: true });
    }
  }

  return (
    <Card className="w-md">
      <CardHeader>
        <CardTitle>Apply For Beta Access</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleApply)} className="space-y-4">
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
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full"
            >
              <LoadingSwap isLoading={form.formState.isSubmitting}>
                <span>Apply</span>
              </LoadingSwap>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
