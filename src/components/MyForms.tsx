import React from "react";
import { api } from "@/utils/api";
import Loading from "./Loading";
import { toast } from "sonner";
import MyFormItem from "./MyFormItem";

const MyForms: React.FC = () => {
  const { data, isLoading } = api.forms.myForms.useQuery();

  if (isLoading) return <Loading text="Fetching your forms..." />;

  if (!data) {
    toast.error("Failed to fetch your forms :(");
    return <div>An error has occured!</div>;
  }

  return (
    <>
      <div className="absolute top-40 grid w-full grid-cols-5 gap-12 px-36 pt-8">
        {data.map((form) => (
          <MyFormItem form={form} key={form.form_id} />
        ))}
      </div>
    </>
  );
};

export default MyForms;
