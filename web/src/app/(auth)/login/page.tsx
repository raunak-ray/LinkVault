import { Bookmark } from "lucide-motion";
import { Suspense } from "react";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex flex-col gap-6 min-h-[calc(100vh-6rem)] w-full items-center justify-center px-4 py-12">
      <div className="text-white flex items-center gap-4">
        <div className="bg-blue-400 rounded-full p-2 border-white/10 border text-black">
          <Bookmark className="h-5 w-5" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold">LinkVault</h2>
      </div>
      <Suspense fallback={<div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
