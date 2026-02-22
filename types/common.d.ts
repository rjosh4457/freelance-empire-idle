import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

type IconNameMC = keyof typeof MaterialIcons.glyphMap;
type IconNameMCI = keyof typeof MaterialCommunityIcons.glyphMap;

type DBResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

type TabListTypes = {
  id: string;
  label: string;
  icon: IconNameMC;
  color: string;
};
