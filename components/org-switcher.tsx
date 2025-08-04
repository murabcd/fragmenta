"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useOrganization } from "@/hooks/use-organization"
import { Id } from "@/convex/_generated/dataModel"
import { UserOrg } from "@/components/user-org"

interface Organization {
  name: string
  logo: React.ElementType
  plan: string
  id?: Id<"organizations">
  imageUrl?: string
}

export function OrganizationSwitcher({ organizations }: { organizations: Organization[] }) {
  const { isMobile } = useSidebar()
  const { organization, setCurrentOrganization } = useOrganization()
  const [isUserOrgOpen, setIsUserOrgOpen] = React.useState(false)
  
  // Set active organization based on current organization or first organization
  const [activeOrganization, setActiveOrganization] = React.useState<Organization | null>(null)

  React.useEffect(() => {
    if (organizations.length > 0) {
      const currentOrg = organizations.find(org => org.id === organization?._id) || organizations[0]
      setActiveOrganization(currentOrg)
    }
  }, [organizations, organization?._id])

  const handleOrganizationSelect = (org: Organization) => {
    setActiveOrganization(org)
    if (org.id && setCurrentOrganization) {
      setCurrentOrganization({
        _id: org.id,
        name: org.name,
        slug: org.name.toLowerCase().replace(/\s+/g, '-'),
        imageUrl: org.imageUrl,
        role: org.plan === "Pro" ? "owner" : "member",
      })
    }
  }

  if (!organizations.length || !activeOrganization) {
    return null
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                {activeOrganization.imageUrl ? (
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={activeOrganization.imageUrl} alt={activeOrganization.name} />
                    <AvatarFallback className="rounded-lg">
                      <activeOrganization.logo className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg border">
                    <activeOrganization.logo className="size-4" />
                  </div>
                )}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{activeOrganization.name}</span>
                  <span className="truncate text-xs">{activeOrganization.plan}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Organizations
              </DropdownMenuLabel>
              {organizations.map((org, index) => (
                <DropdownMenuItem
                  key={org.id || org.name}
                  onClick={() => handleOrganizationSelect(org)}
                  className="gap-2 p-2"
                >
                  {org.imageUrl ? (
                    <Avatar className="h-6 w-6 rounded-lg">
                      <AvatarImage src={org.imageUrl} alt={org.name} />
                      <AvatarFallback className="rounded-lg">
                        <org.logo className="size-3.5 shrink-0" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="flex size-6 items-center justify-center rounded-lg border">
                      <org.logo className="size-3.5 shrink-0" />
                    </div>
                  )}
                  {org.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="gap-2 p-2"
                onClick={() => setIsUserOrgOpen(true)}
              >
                <div className="flex size-6 items-center justify-center rounded-lg border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">Add organization</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <UserOrg isOpen={isUserOrgOpen} onOpenChange={setIsUserOrgOpen} />
    </>
  )
} 