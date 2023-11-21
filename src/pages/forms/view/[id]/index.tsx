import { getServerAuthSession } from "@/server/auth";
import type {  GetServerSideProps } from "next";
import EditFormTemplate from "@/components/EditFormTemplate";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { toast } from "sonner";
import Loading from "@/components/Loading";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  return {
    props: { isViewing: true, form_id: ctx.params?.id },
  };
};

const Page = ({
  isViewing,
  form_id,
}: {
  isViewing: boolean;
  form_id: string;
}) => {
  const router = useRouter();
  const { data, isLoading, isError } = api.forms.publicFindById.useQuery({
    form_id: form_id,
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
    <div className="flex items-center justify-center py-12">
      <EditFormTemplate data={data} isViewing={isViewing} />
    </div>
  );
};

export default Page;
