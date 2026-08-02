// Dialog for exporting all currently visible plots to a single PDF report.
// The report itself (cover branding, chart pages, check page) always
// includes the same fixed elements — these three checkboxes only control the
// optional Index/Statistics/Annex sections (src/lib/pdfExport).
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Label,
} from "@workspace/ui/components";
import { useState } from "react";
import type { PdfExportOptions, PdfExportResult } from "../../../lib/pdfExport/types";

interface PdfExportModalProps {
  open: boolean;
  onClose: () => void;
  onExport: (options: PdfExportOptions) => Promise<PdfExportResult>;
  visiblePlotCount: number;
}

export default function PdfExportModal({ open, onClose, onExport, visiblePlotCount }: PdfExportModalProps) {
  const [includeToc, setIncludeToc]     = useState(true);
  const [includeStats, setIncludeStats] = useState(true);
  const [includeAnnex, setIncludeAnnex] = useState(true);
  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => { setError(""); onClose(); };

  const handleExport = async () => {
    setError("");
    setBusy(true);
    try {
      const result = await onExport({ includeToc, includeStats, includeAnnex });
      if (result.generated === 0) {
        setError("No plots could be rendered — nothing to export.");
        return;
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF generation failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="sm:max-w-[26rem]">
        <DialogHeader>
          <DialogTitle>Export PDF Report</DialogTitle>
          <p className="text-muted-foreground text-xs">
            Exports all {visiblePlotCount} currently visible plot{visiblePlotCount !== 1 && "s"}, one chart per page.
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-1">
          {visiblePlotCount === 0 && (
            <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
              No visible plots — add or unhide a plot first.
            </div>
          )}

          <label className="flex items-center gap-2.5 text-sm">
            <Checkbox checked={includeToc} onCheckedChange={(v) => setIncludeToc(v === true)} />
            <Label className="font-normal">Include Table of Contents</Label>
          </label>
          <label className="flex items-center gap-2.5 text-sm">
            <Checkbox checked={includeStats} onCheckedChange={(v) => setIncludeStats(v === true)} />
            <Label className="font-normal">Include Statistics page (full data range)</Label>
          </label>
          <label className="flex items-center gap-2.5 text-sm">
            <Checkbox checked={includeAnnex} onCheckedChange={(v) => setIncludeAnnex(v === true)} />
            <Label className="font-normal">Include Series Annex</Label>
          </label>

          {error && (
            <p className="text-destructive bg-destructive/10 rounded-md px-3 py-2 text-xs">{error}</p>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <Button variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>
          <Button className="flex-1" onClick={handleExport} disabled={busy || visiblePlotCount === 0}>
            {busy ? "Generating…" : "Generate PDF"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
