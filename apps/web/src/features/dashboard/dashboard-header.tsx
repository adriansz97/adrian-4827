import { LogOut, UserRound } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  fullName: string;
  email: string;
  onLogout: () => void;
}

export function DashboardHeader({
  fullName,
  email,
  onLogout,
}: DashboardHeaderProps) {
  const initials = fullName
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <header className="flex items-center justify-between border-b border-ink/15 pb-5">
      <BrandMark />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-auto gap-3 px-2 py-1.5">
            <span className="grid size-9 place-items-center rounded-full bg-secondary font-display text-lg font-semibold text-secondary-foreground">
              {initials}
            </span>

            <span className="hidden text-left sm:block">
              <span className="block max-w-40 truncate text-sm font-semibold">
                {fullName}
              </span>

              <span className="block max-w-40 truncate text-xs font-normal text-muted-foreground">
                {email}
              </span>
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="flex items-center gap-2">
            <UserRound className="size-4" aria-hidden="true" />
            Cuenta local
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem variant="destructive" onSelect={onLogout}>
            <LogOut aria-hidden="true" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
