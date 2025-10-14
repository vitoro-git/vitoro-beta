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
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/features/auth/config/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const profileUpdateSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
  school: z.string().min(1),
  gradYear: z.string().min(1),
  exam: z.string().min(1),
});

type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>;

type ProfileUpdateFormProps = {
  user: {
    email: string;
    name: string;
    school: string;
    gradYear: string;
    exam: string;
  };
};

export default function ProfileUpdateForm({ user }: ProfileUpdateFormProps) {
  const router = useRouter();
  const form = useForm<ProfileUpdateForm>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: user,
  });

  const { isSubmitting } = form.formState;

  async function handleProfileUpdate(data: ProfileUpdateForm) {
    const promises = [
      authClient.updateUser({
        name: data.name,
        school: data.school,
        gradYear: data.gradYear,
        exam: data.exam,
      }),
    ];

    const res = await Promise.all(promises);
    const updateUserResult = res[0];

    if (updateUserResult.error) {
      toast.error(updateUserResult.error.message || "Failed to update profile");
    } else {
      toast.success("Profile updated successfully");
      router.refresh();
    }
  }

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(handleProfileUpdate)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} readOnly />
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
          name="school"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Favorite Number</FormLabel>
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
              <FormLabel>Graduation year</FormLabel>
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

        <Button type="submit" disabled={isSubmitting} className="w-full">
          <LoadingSwap isLoading={isSubmitting}>Update Profile</LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}
