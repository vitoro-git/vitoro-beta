"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/features/auth/config/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const additionalInfoSchema = z.object({
  school: z.string().min(1),
  gradYear: z.string().min(1),
  exam: z.enum(["step-1", "step-2"]),
});

type AdditionalInfoForm = z.infer<typeof additionalInfoSchema>;

export default function AdditionalInfoPage() {
  const router = useRouter();
  const form = useForm<AdditionalInfoForm>({
    resolver: zodResolver(additionalInfoSchema),
    defaultValues: {},
  });

  async function handleSubmit(data: AdditionalInfoForm) {
    await authClient.updateUser(data, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to save data");
      },
    });
    router.push("/app");
  }

  return (
    <main className="place-items-center grid h-full">
      <Card className="w-md">
        <CardHeader>
          <CardTitle>Additional Info</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <FormField
                control={form.control}
                name="school"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gradYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Graduation Year</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="exam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select exam" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="step-1">Step 1</SelectItem>
                          <SelectItem value="step-2">Step 2</SelectItem>
                        </SelectContent>
                      </Select>
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
                  Submit
                </LoadingSwap>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
