import { Check } from "lucide-react";

type RegisterStepIndicatorProps = {
  currentStep: number;
  totalSteps: number;
};

export function RegisterStepIndicator({
  currentStep,
  totalSteps,
}: RegisterStepIndicatorProps) {
  return (
    <div className="flex items-center justify-between">
      {Array.from({ length: totalSteps }, (_, index) => index + 1).map(
        (step) => (
          <div key={step} className="flex items-center flex-1">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-400 border-slate-300"
              }`}
            >
              {currentStep > step ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-semibold">{step}</span>
              )}
            </div>
            {step < totalSteps && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  currentStep > step ? "bg-slate-900" : "bg-slate-300"
                }`}
              />
            )}
          </div>
        )
      )}
    </div>
  );
}
