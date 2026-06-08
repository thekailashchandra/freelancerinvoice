"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { guideArticles } from "@/data/guides";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function GuideNavMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-1">
          Guide
          <ChevronDown className="h-4 w-4 opacity-60" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Freelancer guides</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/guide" className="cursor-pointer font-medium">
            All articles
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {guideArticles.map((article) => (
          <DropdownMenuItem key={article.slug} asChild>
            <Link href={`/guide/${article.slug}`} className="cursor-pointer">
              <span className="line-clamp-2">{article.title}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
