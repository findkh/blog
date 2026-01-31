import { FaGithub } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { Button } from "../ui/button";
import { Separator } from "@radix-ui/react-context-menu";
import type { MenuNode } from "../../axios/menu/menu";
import { useProfileQuery } from "../../hooks/useGetProfile";

interface FooterProps {
  menuItems: MenuNode[];
}

export function Footer({ menuItems }: FooterProps) {
  const { data: profile, isLoading: profileLoading } = useProfileQuery();

  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg mb-4">About</h3>
            <p className="text-primary-foreground/80 text-sm">
              {profile?.blogDescription}
            </p>
          </div>

          {/* Quick Links - 동적 메뉴 */}
          <div>
            <h3 className="text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {menuItems.map((menu) => (
                <li key={menu.id}>
                  <a
                    href={menu.path}
                    className="text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {menu.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg mb-4">Project</h3>
            <ul className="space-y-2 text-sm">
              {/* <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  Web Development
                </a>
              </li> */}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg mb-4">Connect</h3>
            <div className="flex space-x-2">
              {profile?.github && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 rounded-md text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-200"
                  aria-label="GitHub"
                  asChild
                >
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub className="w-5 h-5" />
                  </a>
                </Button>
              )}
              {profile?.email && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 rounded-md text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-200"
                  aria-label="Email"
                  asChild
                >
                  <a href={`mailto:${profile.email}`}>
                    <MdOutlineMailOutline className="w-5 h-5" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        <Separator className="mb-8 bg-primary-foreground/20" />

        {/* Copyright */}
        <div className="text-center">
          <p className="text-primary-foreground/80 text-sm">
            © {new Date().getFullYear()} WaterMoon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
