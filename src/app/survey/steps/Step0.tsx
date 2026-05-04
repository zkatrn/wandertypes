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
  destinationList?: string[];
  onUpdate: (hasDestinations: boolean, destinations: string[]) => void;
  onNext: () => void;
  /**
   * When true (home hero), destinations + actions sit in a frosted navy card
   * like `homepage_v4.html` `.location-block`, with dashed “add” control.
   */
  darkHeroCard?: boolean;
};

export function Step0({
  destinationList,
  onUpdate,
  onNext,
  darkHeroCard = false,
}: Step0Props) {
  const [inputs, setInputs] = useState<string[]>(
    destinationList && destinationList.length > 0 ? destinationList : [""],
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
    const filledDestinations = inputs.filter(
      (input) => input.trim().length > 0,
    );
    if (filledDestinations.length > 0) {
      onUpdate(true, filledDestinations);
    } else {
      onUpdate(false, []);
    }
    onNext();
  };

  const inputClassDefault =
    "flex-1 rounded-lg border-2 border-stone-200 bg-white px-4 py-3 text-stone-900 focus:border-blue-300 focus:outline-none";
  const inputClassDark =
    "flex-1 rounded-[10px] border border-primary-light/35 bg-white/[0.09] px-4 py-2.5 font-serif text-sm text-stone-50 placeholder:text-slate-300/75 focus:border-amber-300/55 focus:outline-none";

  const formBlock = (
    <>
      <div className={darkHeroCard ? "space-y-2.5" : "mb-2 space-y-3"}>
        {inputs.map((input, index) => (
          <div key={index} className="relative">
            <div className="flex items-center gap-2.5">
              <LocationAutocomplete
                value={input}
                onChange={(value) => handleInputChange(index, value)}
                onPlaceSelected={(placeName) =>
                  handlePlaceSelected(index, placeName)
                }
                placeholder={
                  index === 0
                    ? "Enter a destination (optional)"
                    : `Destination ${index + 1} (optional)`
                }
                className={darkHeroCard ? inputClassDark : inputClassDefault}
                onEnter={handleContinue}
              />
              {inputs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDestinationField(index)}
                  className={
                    darkHeroCard
                      ? "flex h-10 w-10 shrink-0 items-center justify-center text-stone-300/80 transition hover:text-amber-200"
                      : "flex h-11 w-11 shrink-0 items-center justify-center text-stone-400 transition hover:text-red-600"
                  }
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
          type="button"
          onClick={addDestinationField}
          className={
            darkHeroCard
              ? "p-2 mt-2 w-full rounded-[10px] border border-dashed border-primary-light/45 bg-transparent py-2.5 text-left font-serif text-xs tracking-wide text-stone-200 transition hover:border-primary-light/65 hover:text-white"
              : "p-2 mb-2 flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark"
          }
        >
          {darkHeroCard ? (
            "+ Add another destination"
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add another
            </>
          )}
        </button>
      )}


{darkHeroCard ? (
          <Button
            type="button"
            variant="ctaWarm"
            onClick={handleContinue}
            className="mt-4 w-full rounded-xl py-3.5 font-serif text-[15px] font-bold tracking-wide"
          >
            Continue
          </Button>
        ) : (
          <Button onClick={handleContinue} className="w-64">
            Continue
          </Button>
        )}

      {darkHeroCard && (
        <div
          className="my-3 flex items-center gap-3"
          aria-hidden
        >
          <div className="h-px flex-1 bg-primary-light/30" />
          <span className="font-serif text-[11px] italic tracking-wide text-stone-300">
            or
          </span>
          <div className="h-px flex-1 bg-primary-light/30" />
        </div>
      )}

      <div
        className={
          darkHeroCard
            ? "flex flex-col items-stretch gap-3"
            : "flex flex-col items-center gap-4"
        }
      >
        {darkHeroCard ? (
          <Button
            type="button"
            variant="outlineNavy"
            onClick={handleChooseForMe}
            className="w-full rounded-[10px] border-dashed py-2.5 font-serif text-sm font-medium tracking-wide"
          >
            ✨ Choose for me
          </Button>
        ) : (
          <Button onClick={handleChooseForMe} variant="outline" className="w-64">
            ✨ Choose for me
          </Button>
        )}
      </div>
    </>
  );

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
              priority
              className="mx-auto drop-shadow-lg"
            />
          </div>
        }
        title="Where are you thinking of going?"
        description="Add up to 4 destinations to compare"
        showIcon
        toneOnPhoto={darkHeroCard}
      />

      {darkHeroCard ? (
        <div className="mx-auto mt-2 max-w-[600px] text-left">
          <div className="rounded-[20px] bg-landing-navy-wash-hero px-7 pb-6 pt-7 shadow-[0_24px_48px_rgba(0,0,0,0.4)] backdrop-blur-md">
            {formBlock}
          </div>
        </div>
      ) : (
        <div className="mx-auto mb-8 max-w-md">{formBlock}</div>
      )}
    </div>
  );
}
