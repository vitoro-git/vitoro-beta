"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TypeInfo from "./type-info";
import { useState } from "react";
import { Table } from "../types";
import { Input } from "@/components/ui/input";
import { uploadedFoundationalSchema, uploadedQBankSchema } from "../schemas";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";
import { uploadFoundational, uploadQBank } from "../actions";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { ArrowUp } from "lucide-react";

type QuestionUploadFormProps = {
  qbank: number;
  foundational: number;
  foundationalFollowup: number;
};

export default function QuestionUploadForm({
  qbank,
  foundational,
  foundationalFollowup,
}: QuestionUploadFormProps) {
  const [tab, setTab] = useState<Table>("qbank");

  return (
    <main className="flex flex-col px-4 h-full">
      <Tabs
        value={tab}
        onValueChange={(tab) => setTab(tab as Table)}
        className="flex flex-col h-full"
      >
        <TabsList className="mt-4">
          <TabsTrigger value="qbank">QBank</TabsTrigger>
          <TabsTrigger value="foundational">Foundational</TabsTrigger>
          <TabsTrigger value="foundational-followup">
            Foundational Followup
          </TabsTrigger>
        </TabsList>
        <div className="flex flex-1 gap-4 pt-4 overflow-hidden">
          <QuestionUpload
            table={tab}
            qbank={qbank}
            foundational={foundational}
            foundationalFollowup={foundationalFollowup}
          />
          <TypeInfo table={tab} />
        </div>
      </Tabs>
    </main>
  );
}

type QuestionUploadProps = QuestionUploadFormProps & {
  table: Table;
};

function QuestionUpload({
  table,
  qbank,
  foundational,
  foundationalFollowup,
}: QuestionUploadProps) {
  const [message, setMessage] = useState<"Valid JSON" | string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function getExistingCount() {
    switch (table) {
      case "qbank":
        return qbank;
      case "foundational":
        return foundational;
      case "foundational-followup":
        return foundationalFollowup;
    }
  }

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) return toast.warning("Invalid file type");

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const json = JSON.parse(text);
        let result;
        switch (table) {
          case "qbank":
            result = uploadedQBankSchema.safeParse(json);
            break;
          case "foundational":
            result = uploadedFoundationalSchema.safeParse(json);
            break;
          case "foundational-followup":
            result = uploadedFoundationalSchema.safeParse(json);
            break;
        }

        if (result.success) {
          setFileContent(text);
          setMessage("Valid JSON");
        } else {
          setFileContent(null);
          setMessage(result.error.message);
        }
      } catch (err) {
        console.error("Error reading JSON:", err);
        toast.error("Failed to read JSON", { richColors: true });
      }
    };

    reader.readAsText(file);
  }

  async function handleUpload() {
    if (!fileContent) return;
    setIsLoading(true);

    try {
      let data;
      switch (table) {
        case "qbank":
          data = uploadedQBankSchema.parse(JSON.parse(fileContent));
          await uploadQBank(data);
          break;
        case "foundational":
          data = uploadedFoundationalSchema.parse(JSON.parse(fileContent));
          await uploadFoundational(data);
          break;
        case "foundational-followup":
          data = uploadedFoundationalSchema.parse(JSON.parse(fileContent));
          await uploadFoundational(data);
          break;
      }

      setMessage(
        "Uploaded successfully.\nRefresh the page to see new pending count."
      );
      setFileContent(null);
    } catch (err) {
      console.error("Error uploading questions:", err);
      setMessage("Failed to upload questions.\nSee console for more details.");
    }

    setIsLoading(false);
  }

  return (
    <div className="flex flex-col flex-1 gap-4 pb-4 h-full overflow-y-auto">
      <div className="space-y-2">
        <p className="font-bold text-2xl">Upload Questions</p>
        <p className="text-muted-foreground text-sm">
          Pending Question Count • {getExistingCount()}
        </p>
      </div>
      <div className="flex flex-col flex-1 space-y-2">
        <div className="flex justify-between">
          <ButtonGroup>
            <Input type="file" accept=".json" onChange={handleSelect} />
            <Button disabled={message !== "Valid JSON"} onClick={handleUpload}>
              <LoadingSwap
                isLoading={isLoading}
                className="flex items-center gap-2"
              >
                <span>Upload</span>
                <ArrowUp />
              </LoadingSwap>
            </Button>
          </ButtonGroup>
        </div>
        <div className="flex-1 space-y-4">
          {message && (
            <pre>
              <p
                className={cn(
                  "text-sm",
                  message === "Valid JSON"
                    ? "text-green-500"
                    : "text-destructive"
                )}
              >
                {message}
              </p>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
