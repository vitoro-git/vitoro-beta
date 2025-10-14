"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "better-auth";
import { useForm } from "react-hook-form";
import z from "zod";
import { sendContactEmail } from "../actions";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";

const contactSchema = z.object({
  email: z.email().min(1),
  name: z.string().min(1),
  message: z.string().min(1),
});

type ContactForm = z.infer<typeof contactSchema>;

type ContactFormProps = {
  user: User | undefined;
};

export default function ContactForm({ user }: ContactFormProps) {
  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: user?.email || "",
      name: user?.name || "",
      message: "",
    },
  });

  async function handleSendEmail(data: ContactForm) {
    try {
      await sendContactEmail(data.email, data.name, data.message);
      toast.success("Email sent successfully");
    } catch {
      toast.error("Failed to send email");
    }
  }

  return (
    <Card className="w-md">
      <CardHeader>
        <CardTitle>Send Us A Message</CardTitle>
        <CardDescription>We&apos;d love to hear from you</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSendEmail)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              <LoadingSwap isLoading={form.formState.isSubmitting}>
                <span>Send</span>
              </LoadingSwap>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
