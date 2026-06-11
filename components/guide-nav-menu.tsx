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

const featuredGuides = guideArticles.slice(0, 4);

export function GuideNavMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="hidden gap-1 sm:inline-flex"
        >
          Guides
          <ChevronDown className="h-4 w-4 opacity-60" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Learn</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/guide" className="cursor-pointer font-medium">
            All billing guides
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/freelance-finances" className="cursor-pointer">
            Freelance finances hub
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/blog" className="cursor-pointer">
            Blog
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Popular articles
        </DropdownMenuLabel>
        {featuredGuides.map((article) => (
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
