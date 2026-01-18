import { pipeline } from "@xenova/transformers";

export const normalizePrice = (priceString) => {
  if (!priceString) return null;
  const cleaned = priceString.replace(/[^0-9]/g, "");
  return cleaned ? parseInt(cleaned, 10) : null;
};

export const normalizeTitle = (title) => {
  if (!title) return null;

  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ");
};

// AI-POWERED CATEGORY INFERENCE 

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

export const aiInferCategory = async (title, searchHint = "") => {
  if (!classifierPromise) {
    classifierPromise = initializeClassifier();
  }

  try {
    const text = `${title} ${searchHint}`.toLowerCase();

    const CATEGORY_KEYWORDS = {
      Mobile: ["smartphone", "mobile", "iphone", "android", "5g phone", "phone"],
      Laptop: ["laptop", "notebook", "chromebook", "macbook", "ultrabook"],
      Tablet: ["tablet", "ipad", "tab"],
      Camera: ["camera", "dslr", "mirrorless", "action cam"],
      Headphones: ["headphone", "earphone", "earbuds", "headset", "tws"],
      Smartwatch: ["smartwatch", "fitness band", "smart band"],
      Television: ["tv", "television", "smart tv", "led tv", "oled"],
      HomeAppliance: [
        "washing machine",
        "refrigerator",
        "fridge",
        "microwave",
        "ac",
      ],
      Electronics: ["charger", "power bank", "adapter", "cable", "router"],
      Fashion: [
        "shirt",
        "t-shirt",
        "jeans",
        "dress",
        "kurta",
        "shoe",
        "sneaker",
      ],
      Footwear: ["shoe", "sneaker", "slipper", "sandal", "boot"],
      Furniture: ["sofa", "bed", "chair", "table", "wardrobe"],
      Books: ["book", "novel", "paperback", "hardcover"],
    };

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some((kw) => text.includes(kw))) {
        return category;
      }
    }

    const classifier = await classifierPromise;

    const candidate_labels = [
      "Mobile Phone",
      "Laptop",
      "Tablet",
      "Camera",
      "Headphones",
      "Smartwatch",
      "Television",
      "Home Appliance",
      "Electronics Accessory",
      "Fashion Clothing",
      "Footwear",
      "Furniture",
      "Book",
      "Other",
    ];

    const output = await classifier(title, candidate_labels, {
      multi_label: false,
    });

    const bestLabel = output.labels[0];

    const AI_CATEGORY_MAP = {
      "Mobile Phone": "Mobile",
      Laptop: "Laptop",
      Tablet: "Tablet",
      Camera: "Camera",
      Headphones: "Headphones",
      Smartwatch: "Smartwatch",
      Television: "Television",
      "Home Appliance": "HomeAppliance",
      "Electronics Accessory": "Electronics",
      "Fashion Clothing": "Fashion",
      Footwear: "Footwear",
      Furniture: "Furniture",
      Book: "Books",
      Other: "Others",
    };

    return AI_CATEGORY_MAP[bestLabel] || "Others";
  } catch (error) {
    console.error("[AI CATEGORY ERROR]", error);
    return "Others";
  }
};
