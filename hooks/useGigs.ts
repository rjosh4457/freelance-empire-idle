import {
    generateGigForClient,
    saveGeneratedGigs,
} from "../services/gig-service.ts";

export const useGigs = () => {
  const refreshBoard = async (clients: BaseClientType[]) => {
    const newGigs = clients.map((client) => generateGigForClient(client));
    const result = await saveGeneratedGigs(newGigs);

    return result;
  };

  return { refreshBoard };
};
