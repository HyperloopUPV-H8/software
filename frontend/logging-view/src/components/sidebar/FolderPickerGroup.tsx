// Sidebar group for opening a log session folder.
// Uses a hidden <input webkitdirectory> so the native OS folder picker opens —
// window.showDirectoryPicker is not available in Electron's renderer.
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components";
import { Folder, FolderOpen } from "@workspace/ui/icons";
import { useRef } from "react";
import { useStore } from "../../store/store";

const FolderPickerGroup = () => {
  const openSession = useStore((s) => s.openSession);
  const folderName = useStore((s) => s.folderName);
  const settings = useStore((s) => s.settings);
  const isLoading = useStore((s) => s.isLoading);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => inputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      openSession(files);
      // Reset so the same folder can be re-selected.
      e.target.value = "";
    }
  };

  return (
    <SidebarGroup>
      {/* Hidden directory input — triggered programmatically by the button below */}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        // webkitdirectory makes the picker select an entire folder.
        webkitdirectory=""
      />

      <SidebarGroupLabel>Session</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleButtonClick}
              disabled={isLoading}
              tooltip={folderName ?? "Open Session"}
            >
              {folderName ? (
                <Folder className="size-4 shrink-0" />
              ) : (
                <FolderOpen className="size-4 shrink-0" />
              )}
              <span className="truncate">
                {isLoading ? "Loading…" : (folderName ?? "Open Session")}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Session metadata shown once a folder is loaded */}
          {settings && (
            <SidebarMenuItem className="min-w-0">
              <div className="text-muted-foreground w-full min-w-0 overflow-hidden px-2 py-1 text-xs">
                <p className="truncate">{settings.date}</p>
                <a
                  href={`https://hyperloop-upv.github.io/ADJ-Archive/storage/commit-${settings.adj_commit_hash}.json`}
                  target="_blank"
                  rel="noreferrer"
                  className="block truncate font-mono opacity-60 hover:opacity-100 hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(
                      `https://hyperloop-upv.github.io/ADJ-Archive/storage/commit-${settings.adj_commit_hash}.json`,
                      "_blank",
                    );
                  }}
                >
                  {settings.adj_commit_hash.slice(0, 7)}
                </a>
              </div>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default FolderPickerGroup;
