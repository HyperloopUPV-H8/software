// Top bar with the page title and a Normal / Simple mode segmented control.
// Mode switching navigates between routes (/normal, /simple) rather than
// store state, since each mode has a distinct UI.
import { Separator, SidebarTrigger, SegmentedControl } from "@workspace/ui/components";
import { useLocation, useNavigate } from "react-router";

type ViewMode = "normal" | "simple";

const VIEW_OPTIONS: { label: string; value: ViewMode }[] = [
  { label: "Normal", value: "normal" },
  { label: "Simple", value: "simple" },
];

const Header = () => {
  const pageTitle = "Logging View";
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const activeMode: ViewMode = pathname.startsWith("/simple") ? "simple" : "normal";

  return (
    <header className="h-(--header-height) flex shrink-0 items-center gap-2 overflow-x-hidden border-b px-4">
      <SidebarTrigger className="text-foreground -ml-1" />
      <Separator
        orientation="vertical"
        className="text-foreground mx-1 data-[orientation=vertical]:h-4"
      />
      <h1 className="text-foreground text-xl font-bold">{pageTitle}</h1>

      <div className="ml-auto flex items-center gap-2">
        <SegmentedControl
          options={VIEW_OPTIONS}
          value={activeMode}
          onChange={(mode) => navigate(`/${mode}`)}
        />
      </div>
    </header>
  );
};

export default Header;
