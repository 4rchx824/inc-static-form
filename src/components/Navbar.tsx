import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

import { Github, LogOut } from "lucide-react";
import { Separator } from "./ui/separator";

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <nav className="flex items-center justify-between bg-white px-4 shadow-md">
      <div className="flex items-center justify-start space-x-4 py-2">
        <Link
          href="/"
          className="rounded-md px-4 py-2 font-mono text-xl font-bold tracking-tighter text-slate-900"
        >
          INC STATIC FORM
        </Link>

        <Separator className="h-5 bg-black/40" orientation="vertical" />

        {session && (
          <div className="flex items-center justify-between pl-8">
            <Link href="/forms" className="text-sm hover:underline">
              Forms
            </Link>
          </div>
        )}
      </div>

      <div className="flex  items-center justify-center space-x-4 rounded-md bg-slate-900 px-4">
        {session && (
          <>
            <div className="flex items-center justify-center space-x-2 py-2">
              <Github className="fill-white text-white" />
              <h1 className="text-white">{session?.user.name}</h1>
            </div>

            <Separator orientation="vertical" className="h-5" />
          </>
        )}

        <button onClick={session ? () => void signOut() : () => void signIn()}>
          {session ? (
            <LogOut className="h-4 text-white" />
          ) : (
            <div className="flex items-center justify-center space-x-2 py-2">
              <Github className="fill-white text-white" />
              <h1 className="text-white">Github Login</h1>
            </div>
          )}
        </button>
      </div>
    </nav>
  );
}
