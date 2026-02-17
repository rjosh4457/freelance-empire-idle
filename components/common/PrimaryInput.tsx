import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { theme } from "../../constant/theme.ts";

export const PrimaryInput = ({
  value,
  onChangeText,
  placeholder,
  label,
}: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  label: string;
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#a1a1aa"
          value={value}
          onChangeText={onChangeText}
          selectionColor={theme.colors.primary}
        />
        <MaterialIcons
          name="edit"
          size={20}
          color={theme.colors.success}
          style={styles.editIcon}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  inputContainer: { width: "100%", marginBottom: 32 },
  inputLabel: {
    color: theme.colors.success,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 8,
    paddingLeft: 4,
  },
  inputWrapper: {
    width: "100%",
    height: 60,
    backgroundColor: "#f4f4f5",
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    color: "#18181b",
    fontSize: 18,
    fontWeight: "500",
  },
  editIcon: { opacity: 0.6 },
});
