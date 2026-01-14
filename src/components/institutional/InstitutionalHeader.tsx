import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, ChevronDown, Sparkles } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const navItems = [
  { label: "Flywheel", href: "/flywheel" },
  { 
    label: "Products", 
    href: "/products",
    children: [
      { label: "Carolina Terrain", href: "/products/carolina-terrain", description: "Professional stormwater construction" },
      { label: "Terrain Vision", href: "/products/terrain-vision", description: "AI-powered drainage analysis" },
      { label: "Terrain Guard", href: "/products/terrain-guard", description: "Continuous SCM monitoring" },
      { label: "Stormwater SCM", href: "/products/stormwater-scm", description: "Asset management platform" },
      { label: "Drainage Academy", href: "/products/drainage-academy", description: "Certified education" },
    ]
  },
  { label: "Proof", href: "/proof" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Pricing", href: "/pricing" },
];

const secondaryItems = [
  { label: "About", href: "/about" },
  { label: "Whitepaper", href: "/whitepaper" },
];

export function InstitutionalHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">T</span>
          </div>
          <span className="font-bold text-xl">Terrain</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {navItems.map((item) => (
              <NavigationMenuItem key={item.label}>
                {item.children ? (
                  <>
                    <NavigationMenuTrigger className={cn(isActive(item.href) && "text-primary")}>
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-2 p-4">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={child.href}
                                className={cn(
                                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                  isActive(child.href) && "bg-accent"
                                )}
                              >
                                <div className="text-sm font-medium leading-none">{child.label}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {child.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                        <li className="border-t pt-2 mt-2">
                          <NavigationMenuLink asChild>
                            <Link
                              to="/products/trn"
                              className="flex items-center gap-2 rounded-md p-3 text-sm hover:bg-accent"
                            >
                              <Sparkles className="h-4 w-4 text-violet-500" />
                              <div>
                                <span className="font-medium">TRN Utility Credits</span>
                                <span className="ml-2 text-xs text-violet-500 font-medium">(Optional)</span>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        isActive(item.href) && "text-primary"
                      )}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop Right Side */}
        <div className="hidden lg:flex items-center gap-4">
          {secondaryItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "text-sm text-muted-foreground hover:text-foreground transition-colors",
                isActive(item.href) && "text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/token">
            <Button variant="outline" size="sm" className="gap-2">
              <Sparkles className="h-4 w-4 text-violet-500" />
              Token
              <span className="text-xs text-muted-foreground">(Optional)</span>
            </Button>
          </Link>
          <Link to="/contribute">
            <Button size="sm">Contribute</Button>
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <nav className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block py-2 text-lg font-medium",
                      isActive(item.href) && "text-primary"
                    )}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pl-4 space-y-2 mt-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block py-1 text-sm text-muted-foreground hover:text-foreground"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="border-t pt-4 mt-4 space-y-4">
                {secondaryItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-muted-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
                
                <Link to="/token" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full gap-2">
                    <Sparkles className="h-4 w-4 text-violet-500" />
                    Token (Optional)
                  </Button>
                </Link>
                
                <Link to="/contribute" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Contribute</Button>
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

interface StickySubnavProps {
  items: { label: string; href: string }[];
  className?: string;
}

export function StickySubnav({ items, className }: StickySubnavProps) {
  const location = useLocation();

  return (
    <nav className={cn(
      "sticky top-16 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="container">
        <div className="flex items-center gap-6 h-12 overflow-x-auto scrollbar-hide">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap",
                location.hash === item.href && "text-primary"
              )}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
