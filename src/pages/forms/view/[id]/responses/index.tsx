import Loading from "@/components/Loading";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/utils/api";
import type { GetServerSideProps } from "next";
import React from "react";
import ResponseViewer from "@/components/ResponseViewer";

const ResponsePage = ({ form_id }: { form_id: string }) => {
  console.log(form_id);
  const { data, isLoading } = api.forms.getAllFormResponseIds.useQuery({
    formId: form_id,
  });

  console.log(data);

  if (isLoading)
    return (
      <div className="flex min-h-screen">
        <Loading text="Loading form..." />
      </div>
    );

  if ((data ?? []).length == 0)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-3xl">Form has no responses!</h1>
      </div>
    );

  return (
    <div className="flex items-center justify-center pt-12">
      <ResponseViewer data={data} />
    </div>
  );
};

export default ResponsePage;

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
    props: { form_id: ctx.params?.id },
  };
};
