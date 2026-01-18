import cron from "node-cron";
import Alert from "../models/Alert.js";
import Category from "../models/Category.js";
import { getLivePrice } from "./scrapeFlipcart.js";
import { sendPriceDropEmail } from "./emailService.js";

const checkAlerts = async () => {
  console.log("--- [CRON JOB] Starting price alert check ---");
  try {
    const activeAlerts = await Alert.find({ isActive: true }).populate(
      "product user",
    );

    if (activeAlerts.length === 0) {
      console.log("[CRON JOB] No active alerts to check.");
      return;
    }

    console.log(`[CRON JOB] Found ${activeAlerts.length} active alerts.`);

    for (const alert of activeAlerts) {
      if (!alert.product || !alert.user) {
        console.log(`[CRON JOB] Deleting stale alert ID: ${alert._id}`);
        await Alert.findByIdAndDelete(alert._id);
        continue;
      }

      const productURL = alert.product.sellers[0]?.productURL;
      if (!productURL) {
        console.log(
          `[CRON JOB] Skipping product "${alert.product.name}" due to missing URL.`,
        );
        continue;
      }

      const livePrice = await getLivePrice(productURL);
      if (livePrice === null) {
        console.log(
          `[CRON JOB] Failed to get live price for "${alert.product.name}".`,
        );
        continue;
      }

      const productToUpdate = alert.product;

      if (!productToUpdate.category) {
        console.log(
          `[CRON JOB] Product "${productToUpdate.name}" is missing a category. Assigning "General" as a fallback.`,
        );
        let generalCategory = await Category.findOne({ name: "General" });
        if (!generalCategory) {
          generalCategory = await Category.create({ name: "General" });
        }
        productToUpdate.category = generalCategory._id; // Assign the ObjectId
      }

      productToUpdate.currentLowestPrice = livePrice;
      await productToUpdate.save();

      if (
        livePrice <= alert.targetPriceHigh &&
        livePrice >= alert.targetPriceLow
      ) {
        console.log(
          `[CRON JOB] ✅ ALERT TRIGGERED for user ${alert.user.email} on product "${productToUpdate.name}"`,
        );

        await sendPriceDropEmail(alert.user.email, productToUpdate, alert);

        alert.isActive = false;
        await alert.save();
        console.log(
          `[CRON JOB] Alert for "${productToUpdate.name}" has been deactivated.`,
        );
      }
    }
  } catch (error) {
    console.error(
      "[CRON JOB] An unexpected error occurred during the check:",
      error,
    );
  } finally {
    console.log("--- [CRON JOB] Finished price alert check ---");
  }
};

export const startAlertScheduler = () => {
  // Runs at the start of every 4th hour.
  cron.schedule("0 */4 * * *", checkAlerts);
  console.log(
    "Price Alert Scheduler started. Will run at the start of every 4th hour.",
  );
};
