import { CopilotBackend, OpenAIAdapter } from "@copilotkit/backend"; // For backend functionality with CopilotKit.
import { researchWithLangGraph } from "./research"; // Import a custom function for conducting research.
import { AnnotatedFunction } from "@copilotkit/shared"; // For annotating functions with metadata.


// Define a runtime environment variable, indicating the environment where the code is expected to run.
export const runtime = "edge";

// Define an annotated function for research. This object includes metadata and an implementation for the function.
const researchAction: AnnotatedFunction<any> = {
  name: "research", // Function name.
  description: "Call this function to conduct research on a certain topic. Respect other notes about when to call this function", // Function description.
  argumentAnnotations: [ // Annotations for arguments that the function accepts.
    {
      name: "topic", // Argument name.
      type: "string", // Argument type.
      description: "The topic to research. 5 characters or longer.", // Argument description.
      required: true, // Indicates that the argument is required.
    },
  ],
  implementation: async (topic) => { // The actual function implementation.
    console.log("Researching topic: ", topic); // Log the research topic.
    return await researchWithLangGraph(topic); // Call the research function and return its result.
  },
};