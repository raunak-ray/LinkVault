import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkResponse } from "../types";
import Link from "next/link";
import { ExternalLink } from "lucide-motion";

export default function RecentLinkCard({ link }: { link: LinkResponse }) {
  const date = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(link.createdAt));

  return (
    <Card className="border border-white/10 hover:border-white/40 transition-all duration-100 ease-in bg-[#131822]">
      <CardHeader>
        <CardTitle className="grid grid-cols-[40px_1fr] items-start gap-4">
          <div className="rounded-full border border-white/20 bg-[#131822] p-2">
            <img
              src={link.metadata.favicon as string}
              width={30}
              height={30}
              alt=""
            />
          </div>

          <h1 className="text-md font-bold text-white md:text-lg lg:text-xl">
            {link.title}
          </h1>
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-[40px_1fr] -mt-5 gap-4">
        <div />

        <div className="space-y-2">
          <h2 className="text-sm text-white/60 md:text-md">
            {link.metadata.description}
          </h2>

          <div className="flex items-center gap-3 flex-wrap">
            {/* URL */}
            <Link
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-w-0 items-center gap-2 text-sm text-white/60 hover:text-white hover:underline"
            >
              <span className="truncate">{link.url}</span>

              <ExternalLink className="size-3 shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            </Link>

            {/* Collection */}
            <Link
              href={`/dashboard/collections/${link.collection.id}`}
              className="shrink-0"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white">
                <span className="size-1.5 rounded-full bg-green-400" />
                {link.collection.name}
              </span>
            </Link>

            {/* Date */}
            <p className="ml-auto shrink-0 text-xs text-white/40">{date}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
