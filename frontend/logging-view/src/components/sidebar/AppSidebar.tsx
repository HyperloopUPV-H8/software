// Main sidebar shell. Content is divided into two groups:
//   1. FolderPickerGroup — open a log session folder.
//   2. SeriesGroup       — select which measurements to plot (visible once a session is loaded).
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from "@workspace/ui/components";
import FolderPickerGroup from "./FolderPickerGroup";
import SeriesGroup from "./SeriesGroup";
import SidebarToggleHandle from "./SidebarToggleHandle";
import ThemeToggleItem from "./ThemeToggleItem";

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => (
  <Sidebar collapsible="offcanvas" {...props}>
    {/* Fixed — always visible regardless of scroll position */}
    <SidebarHeader className="p-0">
      <FolderPickerGroup />
      <SidebarSeparator />
    </SidebarHeader>

    {/* Scrollable area for series selection */}
    <SidebarContent className="overflow-x-hidden overflow-y-auto">
      <SeriesGroup />
    </SidebarContent>

    <SidebarFooter>
      <div className="my-2" />
      <ThemeToggleItem />
    </SidebarFooter>

    <SidebarToggleHandle />
  </Sidebar>
);

export default AppSidebar;
