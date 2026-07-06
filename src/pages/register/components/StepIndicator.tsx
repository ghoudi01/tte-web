import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center w-full">
      {[...Array(totalSteps)].map((_, index) => {
        const step = index + 1;
        const isLast = step === totalSteps;
        return (
          <div key={step} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 shrink-0 ${
                currentStep >= step
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border"
              }`}
            >
              {currentStep > step ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-semibold">{step}</span>
              )}
            </div>
            {!isLast && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  currentStep > step ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
