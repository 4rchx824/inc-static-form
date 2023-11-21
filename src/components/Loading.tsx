import React from "react";
import { Loader2Icon } from "lucide-react";

const Loading = ({ text }: { text?: string }) => {
  return (
    <div className="flex flex-grow items-center justify-center">
      <Loader2Icon className="animate-spin" />
      <h1 className="pl-4">{text ?? ""}</h1>
    </div>
  );
};

export default Loading;
