import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../../constant/theme.ts";

export const DeskEmptyCard = ({ onFindGigs }: { onFindGigs: () => void }) => {
  return (
    <View style={styles.containerWrapper}>
      <View style={styles.container}>
        {/* Abstract Background Decoration */}
        <View style={[styles.decoCircle, styles.topRightCircle]} />
        <View style={[styles.decoCircle, styles.bottomLeftCircle]} />

        <View style={styles.content}>
          {/* Illustration Area */}
          <View style={styles.illustrationWrapper}>
            {/* Radial Gradient simulation */}
            <View style={styles.radialGradient} />

            <MaterialIcons
              name="desk"
              size={80}
              color={theme.colors.primary}
              style={{ opacity: 0.8 }}
            />
          </View>

          <Text style={styles.title}>The desk is clear!</Text>
          <Text style={styles.subtitle}>
            Ready for your next big break? Your empire won't build itself.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={onFindGigs}
            activeOpacity={0.9}
          >
            <MaterialIcons name="search" size={24} color="#102216" />
            <Text style={styles.buttonText}>FIND GIGS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerWrapper: { paddingHorizontal: 16, marginBottom: 20 },
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: "#e2e8f0", // slate-200
    padding: 32,
    overflow: "hidden",
    // shadow-sm
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    alignItems: "center",
    zIndex: 10,
  },
  illustrationWrapper: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#f8fafc", // slate-50
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    position: "relative",
  },
  radialGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 90,
    backgroundColor: theme.colors.primary,
    opacity: 0.05,
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: theme.colors.primary,
    padding: 12,
    borderRadius: 16,
    // shadow-lg
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a", // slate-900
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b", // slate-500
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 240,
    marginBottom: 24,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    width: "100%",
    paddingVertical: 16,
    borderRadius: theme.borderRadius.lg,
    gap: 8,
    // shadow-lg shadow-primary/20
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#102216",
  },
  // Decoration Circles
  decoCircle: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primary,
    opacity: 0.03,
  },
  topRightCircle: {
    top: -40,
    right: -40,
  },
  bottomLeftCircle: {
    bottom: -30,
    left: -30,
  },
});
