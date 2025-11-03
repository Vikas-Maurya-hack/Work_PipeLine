import { Lead } from "@/types/lead";

const STORAGE_KEY = "work_pipeline_leads";

export const loadLeads = (): Lead[] => {
  try {
    const storedRaw = localStorage.getItem(STORAGE_KEY);
    if (!storedRaw) return getInitialLeads();

    const parsed = JSON.parse(storedRaw) as Lead[];

    // Detect previously-seeded dummy leads (common markers) and clear them.
    // This prevents old seed data from reappearing on refresh while
    // preserving genuine user data when possible.
    const looksLikeSeed = parsed.some((l) => {
      return (
        l.client === "ShopMart" ||
        l.title === "E-commerce Platform" ||
        l.email === "dev@shopmart.com"
      );
    });

    if (looksLikeSeed) {
      console.info("Detected legacy seed data in localStorage; clearing stored leads to prevent dummy data from reappearing.");
      localStorage.removeItem(STORAGE_KEY);
      return getInitialLeads();
    }

    return parsed;
  } catch (error) {
    console.error("Error loading leads:", error);
    return getInitialLeads();
  }
};

export const saveLeads = (leads: Lead[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch (error) {
    console.error("Error saving leads:", error);
  }
};

// Return an empty array by default so the app does not create or inject
// any dummy/e-commerce leads automatically. If you need seeded data for
// development later, consider adding an explicit dev-only seed command or
// gating this behind a feature flag / environment variable.
const getInitialLeads = (): Lead[] => [];
