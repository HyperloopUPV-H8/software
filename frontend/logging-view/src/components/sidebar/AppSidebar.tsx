// Main sidebar shell. Content is divided into two groups:
//   1. FolderPickerGroup — open a log session folder.
//   2. SeriesGroup       — select which measurements to plot (visible once a session is loaded).
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@workspace/ui/components";
import FolderPickerGroup from "./FolderPickerGroup";
import Logo from "./Logo";
import SeriesGroup from "./SeriesGroup";
import ThemeToggleItem from "./ThemeToggleItem";

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => (
  <Sidebar collapsible="icon" {...props}>
    <SidebarHeader>
      <Logo />
    </SidebarHeader>

    <SidebarContent className="overflow-x-hidden">
      <FolderPickerGroup />
      <SidebarSeparator />
      <SeriesGroup />
    </SidebarContent>

    <SidebarFooter>
      <div className="my-2" />
      <ThemeToggleItem />
    </SidebarFooter>

    <SidebarRail className="cursor-pointer!" />
  </Sidebar>
);

export default AppSidebar;
