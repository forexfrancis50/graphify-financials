import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Calculator, LineChart, GitMerge, Scissors, DollarSign, TrendingUp, Rocket, Briefcase, Binary } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const items = [
  {
    title: "DCF Model",
    path: "/dcf",
    icon: Calculator,
  },
  {
    title: "DDM Model",
    path: "/ddm",
    icon: DollarSign,
  },
  {
    title: "LBO Model",
    path: "/lbo",
    icon: LineChart,
  },
  {
    title: "M&A Model",
    path: "/ma",
    icon: GitMerge,
  },
  {
    title: "Restructuring Model",
    path: "/restructuring",
    icon: Scissors,
  },
  {
    title: "Accretion/Dilution",
    path: "/accretion-dilution",
    icon: TrendingUp,
  },
  {
    title: "IPO Model",
    path: "/ipo",
    icon: Rocket,
  },
  {
    title: "Capital Budgeting",
    path: "/capital-budgeting",
    icon: Briefcase,
  },
  {
    title: "Options Pricing",
    path: "/options",
    icon: Binary,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Financial Models</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={location.pathname === item.path ? "bg-accent/20" : ""}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}