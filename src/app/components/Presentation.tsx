"use client";

import { useCallback, useMemo, useState } from "react";
import {
  BackwardIcon,
  ForwardIcon,
  PlusIcon,
  SparklesIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { SlideModel, Slide } from "./Slide";

export const ActionButton = ({
    disabled, onClick, className, children,
  }: {
    disabled: boolean;
    onClick: () => void;
    className?: string;
    children: React.ReactNode;
  }) => {
    return (
      <button
        disabled={disabled}
        className={`bg-blue-500 text-white font-bold py-2 px-4 rounded
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}
        ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };

  // Define the Presentation component as a functional component.
export const Presentation = () => {
    // Initialize state for slides with a default first slide and a state to track the current slide index.
    const [slides, setSlides] = useState<SlideModel[]>([
      {
        title: `Welcome to our presentation!`, // Title of the first slide.
        content: 'This is the first slide.', // Content of the first slide.
        backgroundImageDescription: "hello", // Description for background image retrieval.
        spokenNarration: "This is the first slide. Welcome to our presentation!", // Spoken narration text for the first slide.
      },
    ]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0); // Current slide index, starting at 0.

    // Use useMemo to memoize the current slide object to avoid unnecessary recalculations.
    const currentSlide = useMemo(() => slides[currentSlideIndex], [slides, currentSlideIndex]);

    // Define a function to update the current slide. This function uses useCallback to memoize itself to prevent unnecessary re-creations.
    const updateCurrentSlide = useCallback(
      (partialSlide: Partial<SlideModel>) => {
        // Update the slides state by creating a new array with the updated current slide.
        setSlides((slides) => [
          ...slides.slice(0, currentSlideIndex), // Copy all slides before the current one.
          { ...slides[currentSlideIndex], ...partialSlide }, // Merge the current slide with the updates.
          ...slides.slice(currentSlideIndex + 1), // Copy all slides after the current one.
        ]);
      },
      [currentSlideIndex, setSlides] // Dependencies for useCallback.
    );

    // The JSX structure for the Presentation component.
    return (
      <div className="relative">
        {/* Render the current slide by passing the currentSlide and updateCurrentSlide function as props. */}
        <Slide slide={currentSlide} partialUpdateSlide={updateCurrentSlide} />

        {/* Container for action buttons located at the top-left corner of the screen. */}
        <div className="absolute top-0 left-0 mt-6 ml-4 z-30">
          {/* Action button to add a new slide. Disabled state is hardcoded to true for demonstration. */}
          <ActionButton
            disabled={true} 
            onClick={() => {
              // Define a new slide object.
              const newSlide: SlideModel = {
                title: "Title",
                content: "Body",
                backgroundImageDescription: "random",
                spokenNarration: "The speaker's notes for this slide.",
              };
              // Update the slides array to include the new slide.
              setSlides((slides) => [
                ...slides.slice(0, currentSlideIndex + 1),
                newSlide,
                ...slides.slice(currentSlideIndex + 1),
              ]);
              // Move to the new slide by updating the currentSlideIndex.
              setCurrentSlideIndex((i) => i + 1);
            }}
            className="rounded-r-none"
          >
            <PlusIcon className="h-6 w-6" /> {/* Icon for the button. */}
          </ActionButton>

          {/* Another action button, currently disabled and without functionality. */}
          <ActionButton
            disabled={true} 
            onClick={async () => { }} // Placeholder async function.
            className="rounded-l-none ml-[1px]"
          >
            <SparklesIcon className="h-6 w-6" /> {/* Icon for the button. */}
          </ActionButton>
        </div>

        {/* Container for action buttons at the top-right corner for deleting slides, etc. */}
        <div className="absolute top-0 right-0 mt-6 mr-24">
          <ActionButton
            disabled={slides.length === 1} // Disable button if there's only one slide.
            onClick={() => {}} // Placeholder function for the button action.
            className="ml-5 rounded-r-none"
          >
            <TrashIcon className="h-6 w-6" /> {/* Icon for the button. */}
          </ActionButton>
        </div>

        {/* Display current slide number and total slides at the bottom-right corner. */}
        <div
          className="absolute bottom-0 right-0 mb-20 mx-24 text-xl"
          style={{
            textShadow: "1px 1px 0 #ddd, -1px -1px 0 #ddd, 1px -1px 0 #ddd, -1px 1px 0 #ddd",
          }}
        >
          Slide {currentSlideIndex + 1} of {slides.length} {/* Current slide and total slides. */}
        </div>

        {/* Container for navigation buttons (previous and next) at the bottom-right corner. */}
        <div className="absolute bottom-0 right-0 mb-6 mx-24">
          {/* Button to navigate to the previous slide. */}
          <ActionButton
            className="rounded-r-none"
            disabled={
              currentSlideIndex === 0 ||
              true} // Example condition to disable button; 'true' is just for demonstration.
            onClick={() => {
              setCurrentSlideIndex((i) => i - 1); // Update currentSlideIndex to move to the previous slide.
            }}
          >
            <BackwardIcon className="h-6 w-6" /> {/* Icon for the button. */}
          </ActionButton>
          {/* Button to navigate to the next slide. */}
          <ActionButton
            className="mr-[1px] rounded-l-none"
            disabled={
              true ||
              currentSlideIndex + 1 === slides.length} // Example condition to disable button; 'true' is just for demonstration.
            onClick={async () => {
              setCurrentSlideIndex((i) => i + 1); // Update currentSlideIndex to move to the next slide.
            }}
          >
            <ForwardIcon className="h-6 w-6" /> {/* Icon for the button. */}
          </ActionButton>
        </div>
      </div>
    );
  };