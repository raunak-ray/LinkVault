"use client";

import RecentLinkCard from "../../(dashboard)/components/RecentLinkCard";
import useGetAllLinks from "../hooks/useGetAllLinks";

export default function LinksView() {
    const {data} = useGetAllLinks();

    return(
        <div className="flex flex-col gap-4">
            {data?.data.map((link) => (
                <RecentLinkCard key={link.id} link={link}/>
            ))}
        </div>
    )
}