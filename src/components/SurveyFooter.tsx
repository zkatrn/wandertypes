import { Button } from "./ui/Button";

type SurveyFooterProps = {
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  showBack?: boolean;
};

export function SurveyFooter({
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel = "Continue",
  showBack = true,
}: SurveyFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white/70 backdrop-blur-xl border-t border-white/20 py-4 px-4">
      <div className="max-w-3xl mx-auto flex gap-4 justify-center">
        {showBack && onBack && (
          <Button variant="outline" onClick={onBack} className="w-64">
            Back
          </Button>
        )}
        <Button onClick={onNext} disabled={nextDisabled} className="w-64">
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}
