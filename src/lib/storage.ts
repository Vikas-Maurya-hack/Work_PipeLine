import { Lead } from "@/types/lead";

const STORAGE_KEY = "work_pipeline_leads";

// Check if running in Electron
const isElectron = () => {
  return typeof window !== 'undefined' && (window as any).electronAPI?.isElectron;
};

export const loadLeads = async (): Promise<Lead[]> => {
  try {
    // If running in Electron, load from file system
    if (isElectron()) {
      const result = await (window as any).electronAPI.loadLeads();
      if (result.success && result.leads) {
        return result.leads;
      }
      return [];
    }

    // Otherwise use localStorage (browser mode)
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

export const saveLeads = async (leads: Lead[]): Promise<void> => {
  try {
    // If running in Electron, save to file system
    if (isElectron()) {
      const result = await (window as any).electronAPI.saveLeads(leads);
      if (result.success) {
        console.log('Leads saved to:', result.path);
      } else {
        console.error('Failed to save leads:', result.error);
      }
      return;
    }

    // Otherwise use localStorage (browser mode)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch (error) {
    console.error("Error saving leads:", error);
  }
};

export const getDataFolder = async (): Promise<string | null> => {
  if (isElectron()) {
    return await (window as any).electronAPI.getDataFolder();
  }
  return null;
};

export const exportLeads = async (leads: Lead[]): Promise<{ success: boolean; path?: string; error?: string }> => {
  if (isElectron()) {
    return await (window as any).electronAPI.exportLeads(leads);
  }
  return { success: false, error: 'Export only available in desktop app' };
};

// Return an empty array by default so the app does not create or inject
// any dummy/e-commerce leads automatically. If you need seeded data for
// development later, consider adding an explicit dev-only seed command or
// gating this behind a feature flag / environment variable.
const getInitialLeads = (): Lead[] => [];
