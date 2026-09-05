"use client";

import { Plus } from "lucide-react";

export function FloatingActionButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="md:hidden fixed bottom-20 right-4 z-40 w-14 h-14 bg-ink text-on-primary rounded-full shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center safe-area-bottom"
      aria-label="Add transaction"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
}
