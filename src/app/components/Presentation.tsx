// Import necessary dependencies and components
import React, { useCallback, useMemo, useState } from "react";
import { BackwardIcon, ForwardIcon, PlusIcon, SparklesIcon, TrashIcon } from "@heroicons/react/24/outline";
import { SlideModel, Slide } from "./Slide";
import { useMakeCopilotActionable, useMakeCopilotReadable, CopilotTask } from "@copilotkit/react-core";
import { useCopilotContext } from "@copilotkit/react-core";


// Define the ActionButton component
const ActionButton = ({
  disabled,
  onClick,
  className,
  children,
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

// Define the Presentation component
export const Presentation = () => {
  // Initialize state for slides and current slide index
  const [slides, setSlides] = useState<SlideModel[]>([
    {
      title: `Welcome to our presentation!`,
      content: 'This is the first slide.',
      backgroundImageDescription: "hello",
      spokenNarration: "This is the first slide. Welcome to our presentation!",
    },
  ]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Memoize current slide
  const currentSlide = useMemo(() => slides[currentSlideIndex], [slides, currentSlideIndex]);

  // Function to update current slide
  const updateCurrentSlide = useCallback(
    (partialSlide: Partial<SlideModel>) => {
      setSlides((slides) => [
        ...slides.slice(0, currentSlideIndex),
        { ...slides[currentSlideIndex], ...partialSlide },
        ...slides.slice(currentSlideIndex + 1),
      ]);
    },
    [currentSlideIndex, setSlides]
  );

  // Make the slides readable by Copilot
  useMakeCopilotReadable("These are all the slides: " + JSON.stringify(slides));
  // Make the current slide readable by Copilot
  useMakeCopilotReadable("This is the current slide: " + JSON.stringify(currentSlide));

  // Make the action of appending a slide actionable
  useMakeCopilotActionable(
    {
      // Defines the action's metadata.
      name: "appendSlide", // Action identifier.
      description: "Add a slide after all the existing slides. Call this function multiple times to add multiple slides.",
      // Specifies the arguments that the action takes, including their types, descriptions, and if they are required.
      argumentAnnotations: [
        {
          name: "title", // The title of the new slide.
          type: "string",
          description: "The title of the slide. Should be a few words long.",
          required: true,
        },
        {
          name: "content", // The main content or body of the new slide.
          type: "string",
          description: "The content of the slide. Should generally consist of a few bullet points.",
          required: true,
        },
        {
          name: "backgroundImageDescription", // Description for fetching or generating the background image of the new slide.
          type: "string",
          description: "What to display in the background of the slide. For example, 'dog', 'house', etc.",
          required: true,
        },
        {
          name: "spokenNarration", // Narration text that will be read aloud during the presentation of the slide.
          type: "string",
          description: "The text to read while presenting the slide. Should be distinct from the slide's content, and can include additional context, references, etc. Will be read aloud as-is. Should be a few sentences long, clear, and smooth to read.",
          required: true,
        },
      ],
      // The function to execute when the action is triggered. It creates a new slide with the provided details and appends it to the existing slides array.
      implementation: async (title, content, backgroundImageDescription, spokenNarration) => {
        const newSlide: SlideModel = { // Constructs the new slide object.
          title,
          content,
          backgroundImageDescription,
          spokenNarration,
        };

        // Updates the slides state by appending the new slide to the end of the current slides array.
        setSlides((slides) => [...slides, newSlide]);
      },
    },
    [setSlides] // Dependency array for the hook. This action is dependent on the `setSlides` function, ensuring it reinitializes if `setSlides` changes.
  );

  const context = useCopilotContext();

  const generateSlideTask = new CopilotTask({
    instructions: "Make the next slide related to the overall topic of the presentation. It will be inserted after the current slide. Do NOT carry any research",
 });


 const [generateSlideTaskRunning, **setGenerateSlideTaskRunning**] = useState(false);


  

  // JSX structure for the Presentation component
  return (
    <div className="relative">
      {/* Render the current slide */}
      <Slide slide={currentSlide} partialUpdateSlide={updateCurrentSlide} />

      {/* Action buttons */}
      <div className="absolute top-0 left-0 mt-6 ml-4 z-30">
        {/* Add new slide button */}
        <ActionButton
          disabled={true}
          onClick={() => {
            const newSlide: SlideModel = {
              title: "Title",
              content: "Body",
              backgroundImageDescription: "random",
              spokenNarration: "The speaker's notes for this slide.",
            };
            setSlides((slides) => [
              ...slides.slice(0, currentSlideIndex + 1),
              newSlide,
              ...slides.slice(currentSlideIndex + 1),
            ]);
            setCurrentSlideIndex((i) => i + 1);
          }}
          className="rounded-r-none"
        >
          <PlusIcon className="h-6 w-6" />
        </ActionButton>

        {/* Another action button */}
        <ActionButton
          disabled={true}
          onClick={async () => { }}
          className="rounded-l-none ml-[1px]"
        >
          <SparklesIcon className="h-6 w-6" />
        </ActionButton>
      </div>

      {/* Action buttons for deleting slides */}
      <div className="absolute top-0 right-0 mt-6 mr-24">
        <ActionButton
          disabled={slides.length === 1}
          onClick={() => { }}
          className="ml-5 rounded-r-none"
        >
          <TrashIcon className="h-6 w-6" />
        </ActionButton>
      </div>

      {/* Display current slide number and total slides */}
      <div
        className="absolute bottom-0 right-0 mb-20 mx-24 text-xl"
        style={{
          textShadow: "1px 1px 0 #ddd, -1px -1px 0 #ddd, 1px -1px 0 #ddd, -1px 1px 0 #ddd",
        }}
      >
        Slide {currentSlideIndex + 1} of {slides.length}
      </div>

      {/* Navigation buttons */}
      <div className="absolute bottom-0 right-0 mb-6 mx-24">
        {/* Previous slide button */}
        <ActionButton
          className="rounded-r-none"
          disabled={currentSlideIndex === 0}
          onClick={() => {
            setCurrentSlideIndex((i) => i - 1);
          }}
        >
          <BackwardIcon className="h-6 w-6" />
        </ActionButton>
        {/* Next slide button */}
        <ActionButton
          className="mr-[1px] rounded-l-none"
          disabled={currentSlideIndex + 1 === slides.length}
          onClick={async () => {
            setCurrentSlideIndex((i) => i + 1);
          }}
        >
          <ForwardIcon className="h-6 w-6" />
        </ActionButton>
      </div>
    </div>
  );
};

