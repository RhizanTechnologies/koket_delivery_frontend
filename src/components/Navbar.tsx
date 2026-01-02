"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaShoppingCart } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Check, Menu } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";

function Navbar() {
  const pathname = usePathname() || "/";
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const { cartCount } = useCart();
  const isAdmin = user?.role === "admin";

  // Don't show authenticated state while still loading
  const showAsLoggedIn = !isLoading && isLoggedIn;

  const NavLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const AdminLinks = [
    { name: "Products", href: "/admin/products" },
    { name: "Orders", href: "/admin/orders" },
    { name: "Users", href: "/admin/users" },
    { name: "Categories", href: "/admin/categories" },
    { name: "Contacts", href: "/admin/contacts" },
  ];

  const linksToDisplay = showAsLoggedIn && isAdmin ? AdminLinks : NavLinks;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const desktopLinkClass = (href: string) =>
    `2xl:text-lg font-medium transition-colors ${
      isActive(href) ? "text-primary" : "text-foreground hover:text-primary"
    }`;

  const mobileLinkClass = (href: string) =>
    `text-base font-medium ${
      isActive(href)
        ? "text-primary"
        : "text-foreground hover:text-primary transition-colors"
    }`;

  // Navbar classes - normal positioning (scrolls with page)
  const navbarClasses = `
    bg-background border-b border-border w-full hidden xl:flex py-4 items-center justify-between 
    px-4 lg:px-6 xl:px-10 2xl:px-16 3xl:px-24
  `;

  const mobileNavbarClasses = `
    w-full flex xl:hidden px-4 py-3 items-center justify-between 
    bg-background border-b border-border
  `;

  return (
    <>
      {/* ================= Desktop Navbar ================= */}
      <nav className={navbarClasses}>
        {/* Logo */}
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/logo.png"
            alt="Koket Bakery Logo"
            className="h-[50px] w-auto"
            width={100}
            height={100}
          />
        </Link>

        {/* Navigation Links */}
        <div className="flex-1 flex justify-center gap-6 2xl:gap-10">
          {linksToDisplay.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`${desktopLinkClass(link.href)} cursor-pointer`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 2xl:gap-8">
          {/* ===== BEFORE LOGIN ===== */}
          {!showAsLoggedIn && (
            <>
              <Link
                href="/cart"
                className="relative text-primary text-xl 2xl:text-2xl transition-transform duration-200 hover:text-primary-hover hover:scale-110 cursor-pointer"
              >
                <FaShoppingCart size={30} />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-3 text-[13px] font-semibold bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 animate-bounce">
                    {cartCount}
                  </Badge>
                )}
              </Link>
              <Link
                href="/auth/login"
                className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-5 py-2 rounded-lg transition-colors cursor-pointer text-sm"
              >
                Login
              </Link>
            </>
          )}

          {/* ===== AFTER LOGIN ===== */}
          {showAsLoggedIn && (
            <>
              {/* ✅ USER: Cart + Profile Dropdown */}
              {!isAdmin && (
                <>
                  <Link
                    href="/cart"
                    className="relative text-primary text-xl 2xl:text-2xl transition-transform duration-200 hover:text-primary-hover hover:scale-110 cursor-pointer"
                  >
                    <FaShoppingCart size={30} />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-2 -right-3 text-[13px] font-semibold bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 animate-bounce">
                        {cartCount}
                      </Badge>
                    )}
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover transition-colors cursor-pointer">
                        <User size={18} />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="w-40 p-1 bg-background border border-border text-foreground rounded-lg shadow-lg"
                    >
                      <DropdownMenuItem asChild>
                        <Link
                          href="/orders"
                          className={`flex items-center justify-between rounded-md px-3 py-2 transition-colors cursor-pointer ${
                            pathname.startsWith("/orders")
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-secondary"
                          }`}
                        >
                          My Orders
                          {pathname.startsWith("/orders") && (
                            <Check size={14} className="text-primary" />
                          )}
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          href="/profile"
                          className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer ${
                            pathname.startsWith("/profile")
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-secondary"
                          }`}
                        >
                          My Profile
                          {pathname.startsWith("/profile") && (
                            <Check size={14} className="text-primary" />
                          )}
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="my-1 bg-border" />

                      <DropdownMenuItem asChild>
                        <Button
                          onClick={logout}
                          className="flex items-center gap-2 px-3 py-2 w-full rounded-md bg-secondary text-foreground hover:bg-secondary-hover transition-colors cursor-pointer text-sm"
                        >
                          <LogOut size={14} className="text-destructive" />
                          Logout
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}

              {/* ✅ ADMIN: Only Profile Icon */}
              {isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover transition-colors cursor-pointer">
                      <User size={18} />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-40 p-1 bg-background border border-border text-foreground rounded-lg shadow-lg"
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        href="/profile"
                        className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer ${
                          pathname.startsWith("/profile")
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-secondary"
                        }`}
                      >
                        My Profile
                        {pathname.startsWith("/profile") && (
                          <Check size={14} className="text-primary" />
                        )}
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-1 bg-border" />

                    <DropdownMenuItem asChild>
                      <Button
                        onClick={logout}
                        className="flex items-center gap-2 px-3 py-2 w-full rounded-md bg-secondary text-foreground hover:bg-secondary-hover transition-colors cursor-pointer text-sm"
                      >
                        <LogOut size={14} className="text-destructive" />
                        Logout
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          )}
        </div>
      </nav>

      {/* ================= Mobile Navbar ================= */}
      <nav className={mobileNavbarClasses}>
        {/* Logo */}
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/logo.png"
            alt="Koket Bakery Logo"
            className="h-[40px] w-auto"
            width={100}
            height={100}
          />
        </Link>

        <div className="flex items-center gap-3">
          {/* ===== BEFORE LOGIN ===== */}
          {!showAsLoggedIn && (
            <>
              <Link
                href="/cart"
                className="relative text-primary text-lg transition-transform duration-200 hover:text-primary-hover cursor-pointer"
                aria-label={`Shopping cart ${
                  cartCount > 0 ? `with ${cartCount} items` : "(empty)"
                }`}
              >
                <FaShoppingCart size={27} aria-hidden="true" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-3 text-[10px] font-semibold bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 animate-bounce">
                    {cartCount}
                  </Badge>
                )}
              </Link>
              <Link
                href="/auth/login"
                className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-xs"
              >
                Login
              </Link>
            </>
          )}

          {/* ===== AFTER LOGIN ===== */}
          {showAsLoggedIn && (
            <>
              {/* ✅ USER: Cart + Dropdown */}
              {!isAdmin && (
                <>
                  <Link
                    href="/cart"
                    className="relative text-primary text-lg transition-colors duration-200 hover:text-primary-hover cursor-pointer"
                    aria-label={`Shopping cart ${
                      cartCount > 0 ? `with ${cartCount} items` : "(empty)"
                    }`}
                  >
                    <FaShoppingCart size={30} aria-hidden="true" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-2 -right-3 text-[13px] font-semibold bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 animate-bounce">
                        {cartCount}
                      </Badge>
                    )}
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover transition-colors cursor-pointer"
                        aria-label="User menu"
                      >
                        <User size={18} aria-hidden="true" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="w-40 p-1 bg-background border border-border text-foreground rounded-lg shadow-lg"
                    >
                      <DropdownMenuItem asChild>
                        <Link
                          href="/orders"
                          className={`flex items-center justify-between rounded-md px-3 py-2 transition-colors cursor-pointer ${
                            pathname.startsWith("/orders")
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-secondary"
                          }`}
                        >
                          My Orders
                          {pathname.startsWith("/orders") && (
                            <Check size={14} className="text-primary" />
                          )}
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          href="/profile"
                          className={`flex items-center justify-between rounded-md px-3 py-2 transition-colors cursor-pointer ${
                            pathname.startsWith("/profile")
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-secondary"
                          }`}
                        >
                          My Profile
                          {pathname.startsWith("/profile") && (
                            <Check size={14} className="text-primary" />
                          )}
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="my-1 bg-border" />

                      <DropdownMenuItem asChild>
                        <Button
                          onClick={logout}
                          className="flex items-center gap-2 px-3 py-2 w-full rounded-md bg-secondary text-foreground hover:bg-secondary-hover transition-colors cursor-pointer text-sm"
                        >
                          <LogOut size={14} className="text-destructive" />
                          Logout
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}

              {/* ✅ ADMIN: Only Profile Icon */}
              {isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover transition-colors cursor-pointer">
                      <User size={18} />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-40 p-1 bg-background border border-border text-foreground rounded-lg shadow-lg"
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin/profile"
                        className={`flex items-center justify-between rounded-md px-3 py-2 transition-colors cursor-pointer ${
                          pathname.startsWith("/profile")
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-secondary"
                        }`}
                      >
                        My Profile
                        {pathname.startsWith("/profile") && (
                          <Check size={14} className="text-primary" />
                        )}
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-1 bg-border" />

                    <DropdownMenuItem asChild>
                      <Button
                        onClick={logout}
                        className="flex items-center gap-2 px-3 py-2 w-full rounded-md bg-secondary text-foreground hover:bg-secondary-hover transition-colors cursor-pointer text-sm"
                      >
                        <LogOut size={14} className="text-destructive" /> Logout
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          )}

          {/* Mobile Menu (Sheet) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-border text-primary hover:bg-secondary transition-colors cursor-pointer bg-transparent"
                aria-label="Open mobile menu"
              >
                <Menu size={24} aria-hidden="true" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="p-6 w-4/5 max-w-xs bg-background border-l border-border"
            >
              <SheetHeader>
                <SheetTitle>
                  <span className="text-primary text-lg font-kaushan cursor-pointer">
                    Koket Bakery
                  </span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-4 mt-6">
                {linksToDisplay.map((link) => (
                  <SheetClose asChild key={link.name}>
                    <Link
                      href={link.href}
                      className={mobileLinkClass(link.href)}
                    >
                      {link.name}
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
