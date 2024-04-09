"use client";

// Define an interface for the model of a slide, specifying the expected structure of a slide object.
export interface SlideModel {
  title: string;
  content: string;
  backgroundImageDescription: string;
  spokenNarration: string;
}

// Define an interface for the properties of a component or function that manages slides.
export interface SlideProps {
  slide: SlideModel;
  partialUpdateSlide: (partialSlide: Partial<SlideModel>) => void;
}



