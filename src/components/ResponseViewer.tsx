import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { Input } from "./ui/input";
import AutoForm from "@/components/ui/auto-form";
import { fieldconfig } from "@/utils/fieldconfig";
import { staticForm } from "@/utils/validation";
import Loading from "./Loading";
import type { z } from "zod";
import type { Prisma } from "@prisma/client";
import { toast } from "sonner";
import _debounce from "lodash/debounce";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useRouter } from "next/router";
dayjs.extend(localizedFormat);

const formSchema = staticForm;

function ResponseViewer({ data }: { data: { form_response_id: string }[] }) {
  const router = useRouter();
  data = data ?? [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const maxIdx = data.length - 1;

  const {
    refetch,
    data: fetchedResponse,
    isLoading,
  } = api.forms.getFormResponseById.useQuery({
    form_response_id: data[currentIdx]!.form_response_id,
  });

  const { mutate: update } = api.forms.updateFormData.useMutation({
    onSuccess: () => {
      toast.success("Saved changes successfully!");
    },
    onError: () => {
      toast.error("Failed to save changes :(");
    },
  });

  const debouncedHandleChange = _debounce((value) => {
    update({
      form_response_id: data[currentIdx]!.form_response_id,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      formData: value,
    });
  }, 3000);

  const [values, setValues] = useState<Partial<z.infer<typeof formSchema>>>(
    fetchedResponse?.values as Partial<z.infer<typeof formSchema>>,
  );

  useEffect(() => {
    void refetch();
    setValues(fetchedResponse?.values as Partial<z.infer<typeof formSchema>>);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx]);

  useEffect(() => {
    () => {
      debouncedHandleChange(values);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { mutate: deleteResponse } = api.forms.deleteFormResponse.useMutation({
    onSuccess: () => {
      toast.success("Deleted response successfully!");
      void router.push("/forms");
    },
    onError: () => {
      toast.error("Failed to delete response :(");
    },
  });

  if (isLoading) return <Loading text="Loading form response..." />;

  return (
    <div className="flex w-full max-w-xl flex-col py-6">
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant={"secondary"}
          className="w-20"
          onClick={() =>
            setCurrentIdx(currentIdx - 1 >= 0 ? currentIdx - 1 : currentIdx)
          }
        >
          Previous
        </Button>
        <Input
          value={currentIdx + 1}
          contentEditable={false}
          className="w-10 text-center text-black"
        />
        <Button
          variant={"secondary"}
          className="w-20"
          onClick={() =>
            setCurrentIdx(currentIdx + 1 > maxIdx ? maxIdx : currentIdx + 1)
          }
        >
          Next
        </Button>
      </div>
      <h1 className="pb-2 pt-4 text-xs text-slate-600">
        <span className="pr-2 font-bold">Submitted at: </span>
        {dayjs(fetchedResponse!.submittedAt).format("LLL")}
      </h1>
      <h1 className="pb-6 pt-2 text-xs text-slate-600">
        <span className="pr-2 font-bold">Response ID: </span>
        {data[currentIdx]!.form_response_id}
      </h1>
      <AutoForm
        className="w-full"
        values={{ ...(fetchedResponse?.values as Prisma.JsonObject) }}
        onValuesChange={(values) => {
          setValues(values);
          debouncedHandleChange(values);
        }}
        formSchema={formSchema}
        fieldConfig={{ ...fieldconfig }}
      ></AutoForm>

      <Button
        variant={"destructive"}
        className="my-6"
        onClick={() =>
          deleteResponse({
            form_response_id: data[currentIdx]!.form_response_id,
          })
        }
      >
        Delete Response
      </Button>
    </div>
  );
}

export default ResponseViewer;
