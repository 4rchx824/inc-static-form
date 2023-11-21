import React from "react";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useRouter } from "next/router";
import dayjs from "dayjs";
dayjs.extend(localizedFormat);

const MyFormItem = ({
  form,
}: {
  form: {
    title: string;
    form_id: string;
    createdAt: Date;
    updatedAt: Date;
  };
}) => {
  const router = useRouter();
  return (
    <>
      <button
        className="h-96 border p-4 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
        onClick={() => void router.push(`/forms/edit/${form.form_id}`)}
      >
        <div className="flex h-full flex-col items-start justify-between">
          <div className="text-xl font-bold">{form.title}</div>
          <h1 className="text-xs text-slate-400">
            {dayjs(form.createdAt).diff(form.updatedAt) === 0
              ? "Created"
              : "Last Updated"}
            :
            <span className="pl-1 font-light">
              {dayjs(form.updatedAt).format("LLL")}
            </span>
          </h1>
        </div>
      </button>
    </>
  );
};

export default MyFormItem;
