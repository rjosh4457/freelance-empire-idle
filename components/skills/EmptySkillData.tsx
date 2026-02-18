import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../constant/theme.ts";

export const EmptySkillData = ({
  description,
  onCTAPress,
}: {
  description: string;
  onCTAPress: () => void;
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.illustrationWrapper}>
        <View style={styles.glowEffect} />

        <View style={styles.cardContainer}>
          <View style={styles.iconCircle}>
            <MaterialIcons
              name="auto-stories"
              size={80}
              color={`${theme.colors.primary}4D`}
            />
            <View style={styles.dashedBorder} />
          </View>
        </View>
      </View>

      <Text style={styles.title}>No Skills Yet!</Text>

      <Text style={styles.description}>{description}</Text>

      <TouchableOpacity
        onPress={onCTAPress}
        activeOpacity={0.8}
        style={styles.ctaButton}
      >
        <MaterialIcons
          name="explore"
          size={20}
          color={theme.colors.backgroundDark}
          style={styles.buttonIcon}
        />
        <Text style={styles.buttonText}>Explore Skills</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  illustrationWrapper: {
    position: "relative",
    marginBottom: theme.spacing.xl,
  },
  glowEffect: {
    position: "absolute",
    inset: 20,
    backgroundColor: theme.colors.primary,
    opacity: 0.1,
    borderRadius: theme.borderRadius.full,
  },
  cardContainer: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}1A`,
    // iOS Shadows
    shadowColor: theme.colors.obsidian,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    // Android Shadow
    elevation: 5,
  },
  iconCircle: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  dashedBorder: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: `${theme.colors.primary}33`,
    borderRadius: theme.borderRadius.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.backgroundDark,
    fontFamily: theme.typography.display,
    marginBottom: theme.spacing.sm,
  },
  description: {
    textAlign: "center",
    color: theme.colors.mutedV3,
    lineHeight: 22,
    fontFamily: theme.typography.display,
    marginBottom: theme.spacing.xl,
  },
  ctaButton: {
    backgroundColor: theme.colors.primary,
    width: "100%",
    paddingVertical: 18,
    borderRadius: theme.borderRadius.lg,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // iOS Shadows
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    // Android Shadow
    elevation: 8,
  },
  buttonIcon: {
    marginRight: theme.spacing.sm,
  },
  buttonText: {
    color: theme.colors.backgroundDark,
    fontWeight: "bold",
    fontSize: 18,
    fontFamily: theme.typography.display,
  },
});
