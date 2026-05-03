"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SurveyStepHeader } from "@/components/SurveyStepHeader";
import { LocationAutocomplete } from "@/components/LocationAutocomplete";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import balloonImage from "@/lib/assets/balloon.png";
import styles from "@/styles/animations.module.scss";

type Step0Props = {
  hasDestinations?: boolean;
  destinationList?: string[];
  onUpdate: (hasDestinations: boolean, destinations: string[]) => void;
  onNext: () => void;
};

export function Step0({
  hasDestinations,
  destinationList,
  onUpdate,
  onNext,
}: Step0Props) {
  const [inputs, setInputs] = useState<string[]>(
    destinationList && destinationList.length > 0 ? destinationList : [""]
  );

  const handleChooseForMe = () => {
    onUpdate(false, []);
    onNext();
  };

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const handlePlaceSelected = (index: number, placeName: string) => {
    handleInputChange(index, placeName);
  };

  const addDestinationField = () => {
    if (inputs.length < 4) {
      setInputs([...inputs, ""]);
    }
  };

  const removeDestinationField = (index: number) => {
    if (inputs.length > 1) {
      const newInputs = inputs.filter((_, i) => i !== index);
      setInputs(newInputs);
    }
  };

  const handleContinue = () => {
    const filledDestinations = inputs.filter(input => input.trim().length > 0);
    console.log('Step0 handleContinue - filledDestinations:', filledDestinations);
    if (filledDestinations.length > 0) {
      onUpdate(true, filledDestinations);
      onNext();
    }
  };

  const filledCount = inputs.filter(input => input.trim().length > 0).length;

  return (
    <div className="text-center">
      <SurveyStepHeader
        icon={
          <div className={styles.balloonFloat}>
            <Image 
              src={balloonImage} 
              alt="Hot air balloon" 
              width={200} 
              height={200} 
              className="mx-auto drop-shadow-lg" 
            />
          </div>
        }
        title="Where are you thinking of going?"
        description="Add up to 4 destinations to compare"
        showIcon
      />

      <div className="max-w-md mx-auto mb-8">
        <div className="space-y-3 mb-2">
          {inputs.map((input, index) => (
            <div key={index} className="relative">
              <div className="flex gap-2">
                <LocationAutocomplete
                  value={input}
                  onChange={(value) => handleInputChange(index, value)}
                  onPlaceSelected={(placeName) => handlePlaceSelected(index, placeName)}
                  placeholder={index === 0 ? "Enter a destination (optional)" : `Destination ${index + 1} (optional)`}
                  className="flex-1 px-4 py-3 border-2 border-stone-200 rounded-lg focus:outline-none focus:border-blue-300 bg-white text-stone-900"
                  onEnter={handleContinue}
                />
                {inputs.length > 1 && (
                  <button
                    onClick={() => removeDestinationField(index)}
                    className="flex items-center justify-center w-11 h-11 text-stone-400 hover:text-red-600 transition-colors"
                    aria-label="Remove destination"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {inputs.length < 4 && (
          <button
            onClick={addDestinationField}
            className="flex items-center gap-1 text-primary hover:text-primary-dark text-sm font-medium mb-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Add another
          </button>
        )}

        <p className="text-stone-500 text-sm mb-6">
          Not sure yet? That's okay — just tell us what kind of trip you want and we'll find the match.
        </p>

        <div className="flex flex-col gap-4 items-center">
          {filledCount > 0 && (
            <Button onClick={handleContinue} className="w-64">
              Continue
            </Button>
          )}
          <Button onClick={handleChooseForMe} variant="outline" className="w-64">
            ✨ Choose for me
          </Button>
        </div>
      </div>
    </div>
  );
}
