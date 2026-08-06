import { Loader } from "lucide-react";

export default function Loading() {
  return (
          <div className="min-h-screen flex items-center justify-center bg-(--color-page-shell) px-4">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-(--color-border) bg-(--color-card) p-8 text-center shadow-lg">
          <Loader className="h-12 w-12 text-(--color-button-yellow) animate-spin" />
          <div>
            <h1 className="text-xl font-semibold text-black">
              Loading Please wait
            </h1>
            <p className="mt-2 text-(--color-text-muted)">
              Please wait, load the page!!!!!
            </p>
          </div>
        </div>
      </div>
  );
}