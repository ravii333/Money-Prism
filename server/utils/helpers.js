import { pipeline } from "@xenova/transformers";

export const normalizePrice = (priceString) => {
  /* ... */
};
export const normalizeTitle = (title) => {
  /* ... */
};

// --- AI-POWERED CATEGORY INFERENCE (WITH CORRECT SINGLETON PATTERN) ---

let classifierPromise = null;

const initializeClassifier = async () => {
  console.log("[AI] Initializing classification model for the first time...");
  // This will download the model (~400MB) on the very first run.
  try {
    const classifier = await pipeline(
      "zero-shot-classification",
      "Xenova/bart-large-mnli",
    );
    console.log("[AI] Model loaded successfully.");
    return classifier;
  } catch (error) {
    console.error("[AI] Failed to load the classification model:", error);
    classifierPromise = null;
    throw error;
  }
};

export const aiInferCategory = async (title) => {
  if (!classifierPromise) {
    classifierPromise = initializeClassifier();
  }

  try {
    const classifier = await classifierPromise;

    const candidate_labels = [
      "Mobile Phone",
      "Laptop Computer",
      "Camera",
      "Headphones",
      "Electronics Accessory",
    ];
    console.log(`[AI] Classifying title: "${title}"`);
    const output = await classifier(title, candidate_labels, {
      multi_label: false,
    });

    const bestCategory = output.labels[0];
    console.log(`[AI] Best category found: "${bestCategory}"`);

    // Simplify the output
    if (bestCategory.includes("Mobile")) return "Mobile";
    if (bestCategory.includes("Laptop")) return "Laptop";
    if (bestCategory.includes("Camera")) return "Camera";
    if (bestCategory.includes("Headphone")) return "Headphones";

    return "General";
  } catch (error) {
    console.error("[AI] Error during classification:", error);
    return "General";
  }
};
