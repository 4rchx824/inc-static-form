import React, { useState } from "react";
import type { GetServerSideProps, NextPage } from "next";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api } from "@/utils/api";
import MyForms from "@/components/MyForms";
import { getServerAuthSession } from "@/server/auth";

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
    props: { session },
  };
};

const Page: NextPage = () => {
  const router = useRouter();
  const [cmdListOpen, setCmdListOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const ctx = api.useUtils();

  const { mutate: createForm, isLoading: isCreating } =
    api.forms.createForm.useMutation({
      onSuccess: (data) => {
        toast("Form has been created!", {
          action: {
            label: "View Form",
            onClick: () => void router.push(`/forms/edit/${data.form_id}`),
          },
        });
        setFormTitle("");
        setDialogOpen(false);
        void ctx.forms.invalidate();
      },
      onError: (e) => {
        console.log(e.data);
        const errMsg = e.data?.zodError?.fieldErrors?.title;
        if (errMsg?.[0]) toast.error(errMsg[0]);
        else toast.error("Failed to create form! Please try again later...");
      },
    });

  const handleFormCreation = () => {
    createForm({ title: formTitle });
  };

  const { data } = api.forms.myForms.useQuery();

  return (
    <div className="flex min-h-screen flex-col items-center justify-start">
      <div className="relative flex w-full max-w-lg justify-center space-x-4 pt-8">
        <Command className="z-50 border">
          <CommandInput
            placeholder="Search for a form..."
            onFocus={() => setCmdListOpen(true)}
            onBlur={() => setCmdListOpen(false)}
          />
          <CommandList hidden={!cmdListOpen}>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {(data ?? []).map((form) => (
                <CommandItem key={form.form_id}>{form.title}</CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-11">Create Form</Button>
          </DialogTrigger>
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle>Create New Form</DialogTitle>
            </DialogHeader>

            <div className="flex items-center justify-center space-x-4">
              <Input
                placeholder="Form Title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
              <Button onClick={handleFormCreation} disabled={isCreating}>
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <MyForms />
    </div>
  );
};

export default Page;
