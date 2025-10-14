"use client";

import { Button } from "@/components/ui/button";
import useLocalStorage from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  Computer,
  CreditCard,
  History,
  Home,
  Layers,
  Menu,
  ShieldUser,
  Target,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, ReactNode, useContext } from "react";

const ICONS = {
  home: Home,
  qbank: Target,
  foundational: Layers,
  history: History,
  flashcards: CreditCard,
  tutor: Computer,

  admin: ShieldUser,
  upload: Upload,
};

type IconType = keyof typeof ICONS;

// Context

const NavContext = createContext({ isOpen: true });

function NavProvider({
  children,
  isOpen,
}: {
  children: ReactNode;
  isOpen: boolean;
}) {
  return (
    <NavContext.Provider value={{ isOpen }}>{children}</NavContext.Provider>
  );
}

export function useNavContext() {
  return useContext(NavContext);
}

// Components

type SidenavProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  bottom?: React.ReactNode;
};

export function Sidenav({ title, subtitle, children, bottom }: SidenavProps) {
  const [isOpen, updateIsOpen] = useLocalStorage("is-sidenav-open", true);

  return (
    <NavProvider isOpen={isOpen}>
      <nav
        className={cn(
          "flex flex-col gap-4 p-4 border-r h-full",
          isOpen ? "w-[320px]" : "items-center"
        )}
      >
        <div className="flex justify-between items-center">
          {isOpen && (
            <div>
              <p className="font-semibold text-lg">{title}</p>
              {subtitle && (
                <p className="text-muted-foreground text-sm">{subtitle}</p>
              )}
            </div>
          )}
          <Button variant="ghost" onClick={() => updateIsOpen(!isOpen)}>
            {isOpen ? <ChevronLeft /> : <Menu />}
          </Button>
        </div>
        <ul className="flex flex-col">{children}</ul>
        {isOpen && bottom && bottom}
      </nav>
    </NavProvider>
  );
}

type NavGroupProps = {
  label?: string;
  children?: ReactNode;
};

export function NavGroup({ children }: NavGroupProps) {
  return <div className="flex flex-col mb-4">{children}</div>;
}

type NavLinkProps = {
  label: string;
  href: string;
  icon: IconType;
};

export function NavLink({ label, href, icon }: NavLinkProps) {
  const { isOpen } = useNavContext();
  const pathname = usePathname();
  const isSelected = pathname === href;
  const Icon = ICONS[icon];

  return (
    <li
      className={cn(
        "hover:bg-muted rounded-md transition-all",
        isSelected && "font-semibold"
      )}
    >
      <Link href={href} className={cn("flex items-center gap-2 p-2 text-sm")}>
        <Icon
          size={16}
          className={cn(
            isSelected ? "text-foreground" : "text-muted-foreground"
          )}
        />
        {isOpen && (
          <span
            className={cn(
              isSelected ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {label}
          </span>
        )}
      </Link>
    </li>
  );
}
