"use client";

import { useState } from "react";
import { Button } from "@/components/motion/button/base";
import { Plus } from "lucide-motion";
import CreateLinkModal from "@/app/dashboard/links/components/CreateLinkModal";

export default function HeaderAddLink() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)} className="hidden sm:inline-flex gap-2">
        <Plus className="size-4" /> Add Link
      </Button>
      <Button size="icon" onClick={() => setOpen(true)} className="sm:hidden size-9 rounded-full">
        <Plus className="size-4" />
      </Button>
      <CreateLinkModal open={open} onOpenChange={setOpen} />
    </>
  );
}
