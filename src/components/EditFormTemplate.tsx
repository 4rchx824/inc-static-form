import React, { useState } from "react";
import type { Prisma } from "@prisma/client";
import AutoForm from "@/components/ui/auto-form";
import { Button } from "@/components/ui/button";
import { staticForm } from "@/utils/validation";
import { fieldconfig } from "@/utils/fieldconfig";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { useRouter } from "next/router";
import type { z } from "zod";
import type { FieldConfig } from "./ui/auto-form/types";

const formSchema = staticForm;

const EditFormTemplate = ({
  data,
  isViewing,
}: {
  data: {
    form_id: string;
    title: string;
    ownerId: string;
    requiresLogin: boolean;
    formSchema: Prisma.JsonValue;
    formConfig: Prisma.JsonValue;
    createdAt: Date;
    updatedAt: Date;
  };
  isViewing?: boolean;
}) => {
  const router = useRouter();
  const { mutate: submit } = api.forms.response.useMutation({
    onSuccess: () => {
      toast.success("Form submitted!");
      void router.push(`/`);
    },
    onError: () => {
      toast.error("Error submitting form");
    },
  });
  const [values, setValues] = useState<Partial<z.infer<typeof formSchema>>>({});
  return (
    <div className="flex w-full max-w-xl flex-col items-center justify-center rounded-t-lg border-t-8 border-t-black bg-slate-100 p-4">
      <h1 className="self-start py-4 pb-12 text-5xl font-bold">{data.title}</h1>
      <AutoForm
        className="w-full "
        values={values}
        onValuesChange={(values) => setValues(values)}
        onSubmit={(formData) =>
          submit({ form_id: data.form_id, values: formData })
        }
        formSchema={formSchema}
        fieldConfig={{
          ...(fieldconfig as FieldConfig<z.infer<typeof formSchema>>),
        }}
      >
        {(isViewing ?? false) && <Button className="mt-4">Submit</Button>}
      </AutoForm>
    </div>
  );
};

export default EditFormTemplate;
