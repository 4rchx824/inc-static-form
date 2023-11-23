import React from "react";
import type { GetServerSideProps } from "next";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/utils/api";
import Loading from "@/components/Loading";
import { toast } from "sonner";
import { useRouter } from "next/router";
import EditFormTemplate from "@/components/EditFormTemplate";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { env } from "@/env.mjs";

const Page = ({ form_id, baseUrl }: { form_id: string; baseUrl: string }) => {
  const router = useRouter();
  const { data, isLoading, isError } = api.forms.findById.useQuery({
    form_id: form_id,
  });

  const { data: response_count, isLoading: loadingResponseCount } =
    api.forms.findResponseCountByFormId.useQuery({
      form_id: form_id,
    });

  const { mutate: deleteForm } = api.forms.deleteForm.useMutation({
    onSuccess: () => {
      toast.success("Form deleted successfully!");
      void router.push("/forms");
    },
    onError: () => {
      toast.error("Failed to delete form :(");
    },
  });

  if (isLoading)
    return (
      <div className="flex min-h-screen">
        <Loading text="Loading form..." />
      </div>
    );

  if (isError || !data) {
    toast.error("Error loading form");
    void router.push("/forms");
    return;
  }

  return (
    <div className="flex flex-col items-center justify-center px-12 py-6">
      <Button
        className="mt-4  self-end"
        disabled={loadingResponseCount}
        onClick={() => void router.push(`/forms/view/${form_id}/responses`)}
      >
        View Responses{" "}
        <span className="ml-2 rounded-md bg-white px-2 text-black">
          {response_count ?? 0}
        </span>
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4  self-end">Share Form</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share this link</DialogTitle>
          </DialogHeader>

          <Input
            value={`${baseUrl}/forms/view/${form_id}`}
            className="text-black"
            contentEditable={false}
          />
        </DialogContent>
      </Dialog>
      <Button
        className="mt-4 self-end"
        variant={"destructive"}
        onClick={() => deleteForm({ form_id })}
      >
        Delete Form
      </Button>
      <EditFormTemplate data={data} />
    </div>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  return {
    props: { form_id: ctx.params?.id, baseUrl: env.NEXTAUTH_URL },
  };
};
