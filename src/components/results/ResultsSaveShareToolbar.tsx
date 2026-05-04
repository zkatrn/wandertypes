"use client";

import { Bookmark, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

type ResultsSaveShareToolbarProps = {
  showSave?: boolean;
  saveLabel?: string;
  saveDisabled?: boolean;
  onSave?: () => void;
  shareLabel?: string;
  shareDisabled: boolean;
  onShare: () => void;
  shareCopied?: boolean;
};

export function ResultsSaveShareToolbar({
  showSave = false,
  saveLabel = "Save",
  saveDisabled = false,
  onSave,
  shareLabel = "Share",
  shareDisabled,
  onShare,
  shareCopied = false,
}: ResultsSaveShareToolbarProps) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
      {showSave ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={saveDisabled}
          onClick={() => onSave?.()}
          className="border-stone-300 bg-white/90 text-stone-800 backdrop-blur-sm hover:bg-white"
        >
          <Bookmark className="h-4 w-4" />
          {saveLabel}
        </Button>
      ) : null}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={shareDisabled}
        onClick={onShare}
        className="border-stone-300 bg-white/90 text-stone-800 backdrop-blur-sm hover:bg-white"
      >
        {shareCopied ? (
          <>
            <Check className="h-4 w-4 text-emerald-600" />
            Copied link
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4" />
            {shareLabel}
          </>
        )}
      </Button>
    </div>
  );
}
