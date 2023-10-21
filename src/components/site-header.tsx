import Link from "next/link";
import { Icons } from "@/components/icons";
import { Combobox } from "@/components/layout/combobox";
import { MainNav } from "@/components/layout/main-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { siteConfig } from "@/config/site";
import { auth } from "@/lib/nextauth";
import { SignIn, SignOut } from "./auth";
import { cn } from "@/lib/utils";

interface User {
  imageUrl: string;
  username: string;
  firstName: string;
  lastName: string;
}

interface SiteHeaderProps extends React.ComponentPropsWithoutRef<"header"> {
  sticky?: boolean;
}

export async function SiteHeader({
  sticky = false,
  className,
}: SiteHeaderProps) {
  const session = await auth();
  const user = session?.user;
  return (
    <header
      className={cn(
        "w-full bg-background",
        sticky && "sticky top-0 z-40 ",
        className
      )}
    >
      <div className="container flex h-16 items-center">
        <MainNav items={siteConfig.mainNav} />

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Combobox />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.image ?? ""}
                        alt={user.name ?? ""}
                      />
                      <AvatarFallback>G</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/account">
                        <Icons.user
                          className="mr-2 h-4 w-4"
                          aria-hidden="true"
                        />
                        Account
                        <DropdownMenuShortcut>⇧⌘A</DropdownMenuShortcut>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild disabled={!user.name}>
                      <Link href={`/u/${user.name}`}>
                        <Icons.dashboard
                          className="mr-2 h-4 w-4"
                          aria-hidden="true"
                        />
                        Dashboard
                        <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild disabled>
                      <Link href="/dashboard/settings">
                        <Icons.settings
                          className="mr-2 h-4 w-4"
                          aria-hidden="true"
                        />
                        Settings
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <div>
                      <Icons.logout
                        className="mr-2 h-4 w-4"
                        aria-hidden="true"
                      />
                      <SignOut>Log out</SignOut>
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SignIn
                className={buttonVariants({
                  size: "sm",
                })}
              >
                Sign In
                <span className="sr-only">Sign In</span>
              </SignIn>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
