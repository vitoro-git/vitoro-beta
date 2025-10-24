"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { MultiSelect } from "@/components/ui/multi-select";
import { NumberInput } from "@/components/ui/number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { capitalize } from "@/lib/utils";
import { MODES, Step, STEPS, SYSTEMS } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import { createSession } from "../actions";

const SIZES = [10, 20, 30, 40];
const MIN_SIZE = 1;
const MAX_SIZE = 40;

const createSessionSchema = z.object({
  step: z.enum(STEPS),
  size: z.number().min(MIN_SIZE).max(MAX_SIZE),
  mode: z.enum(MODES),
  systems: z.array(z.string()),
});

export type CreateSessionForm = z.infer<typeof createSessionSchema>;

type CreateSessionFormProps = {
  userId: string;
  step: Step;
};

export default function CreateSessionForm({
  userId,
  step,
}: CreateSessionFormProps) {
  const router = useRouter();
  const form = useForm<CreateSessionForm>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      step: step,
      size: 10,
      mode: MODES[0],
      systems: [],
    },
  });

  async function handleSubmit(data: CreateSessionForm) {
    const id = await createSession(userId, data);
    router.push(`/app/qbank/${id}`);
  }

  return (
    <Form {...form}>
      <form
        className="space-y-4 w-4xl"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="flex gap-4 w-full">
          <div className="flex-1 space-y-4">
            <FormField
              control={form.control}
              name="systems"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Systems</FormLabel>
                  <FormControl>
                    <MultiSelect
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      options={SYSTEMS.map((s) => ({
                        value: s.system,
                        label: s.system,
                      }))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex gap-4 w-full">
              <FormField
                control={form.control}
                name="step"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Step</FormLabel>
                    <FormControl className="w-full">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a step" />
                        </SelectTrigger>
                        <SelectContent>
                          {STEPS.map((step) => (
                            <SelectItem value={step} key={step}>
                              {capitalize(step.replace("-", " "))}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Mode</FormLabel>
                    <FormControl className="w-full">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a mode" />
                        </SelectTrigger>
                        <SelectContent>
                          {MODES.map((mode) => (
                            <SelectItem value={mode} key={mode}>
                              {capitalize(mode)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <FormControl>
                    <ButtonGroup className="w-full">
                      <NumberInput {...field} min={MIN_SIZE} max={MAX_SIZE} />
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value?.toString()}
                      >
                        <SelectTrigger showValue={false}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SIZES.map((size) => (
                            <SelectItem value={size.toString()} key={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </ButtonGroup>
                  </FormControl>
                  <p className="text-muted-foreground text-sm">
                    {form.getValues().size} questions ={" "}
                    {form.getValues().size * 1.5} minutes
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <Button
          type="submit"
          // className="w-full"
          disabled={form.formState.isSubmitting}
        >
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Start
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}
