import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Book, 
  Layout, 
  Shield, 
  Cloud,
  GitBranch
} from "lucide-react";

const menuItems = [
  {
    title: "Overview",
    icon: Layout,
    href: "/",
  },
  {
    title: "AWS Security",
    icon: Shield,
    href: "/module/1",
  },
  {
    title: "CloudTrail & CloudWatch",
    icon: Cloud,
    href: "/module/2",
  },
  {
    title: "Terraform Basics",
    icon: GitBranch,
    href: "/module/3",
  },
  // Add more menu items...
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 border-r bg-sidebar text-sidebar-foreground">
      <div className="p-6">
        <div className="flex items-center gap-2 font-semibold text-xl">
          <Book className="h-6 w-6" />
          <span>AWS Security</span>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-5rem)] px-3">
        <div className="space-y-1 p-2">
          {menuItems.map((item) => (
            <Button
              key={item.href}
              variant={location === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                location === item.href && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
