"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { guideArticles } from "@/data/guides";
import { useTranslation } from "@/components/locale-provider";
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
  const { t } = useTranslation();

  return (
    <div className="hidden sm:block">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-1">
            {t("guides.label")}
            <ChevronDown className="h-4 w-4 opacity-60" aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel>{t("guides.learn")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/guide" className="cursor-pointer font-medium">
              {t("guides.allGuides")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/freelance-finances" className="cursor-pointer">
              {t("guides.financesHub")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/blog" className="cursor-pointer">
              {t("nav.blog")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            {t("guides.popularArticles")}
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
    </div>
  );
}
