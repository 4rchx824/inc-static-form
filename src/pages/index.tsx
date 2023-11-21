import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center">
        <div className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Start stealing data.
              <br />
              Start using our app today.
            </h2>
            <div className="mt-10 flex items-center gap-x-6">
              <button
                className={cn(
                  "h-10 px-4 py-2",
                  "bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90",
                  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
                )}
                onClick={
                  !session
                    ? () => void signIn()
                    : () => void router.push("/forms")
                }
              >
                {!session ? "Get Started" : "View all forms"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}