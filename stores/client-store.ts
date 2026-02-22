import { create } from "zustand";
import { getAllClients } from "../services/clients-service.ts";

interface ClientStore {
  clients: BaseClientType[];

  getAllClients: () => Promise<void>;
}

export const useClientStore = create<ClientStore>((set) => ({
  clients: [],

  getAllClients: async () => {
    const result = await getAllClients();
    if (result.success && result.data) {
      set({ clients: result.data });
    }
  },
}));
