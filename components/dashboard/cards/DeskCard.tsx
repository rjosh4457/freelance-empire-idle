import { MaterialIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../../constant/theme.ts";

export const OfficeStage = () => {
  return (
    <View style={styles.stageWrapper}>
      <View style={styles.stageInner}>
        {/* Background Illustration */}
        <Image
          source={require("../../../assets/player/working-player.png")}
          style={styles.stageImage}
          resizeMode="contain"
        />
        {/* Floating Project HUD */}
        <View style={styles.projectHud}>
          <View style={styles.hudHeader}>
            <Text style={styles.hudLabel}>CURRENT PROJECT</Text>
            <Text style={styles.hudPercent}>65%</Text>
          </View>
          <Text style={styles.hudTitle} numberOfLines={1}>
            Mobile App UI Design
          </Text>
          <View style={styles.hudProgressTrack}>
            <View style={[styles.hudProgressFill, { width: "65%" }]} />
          </View>
          <Text style={styles.hudTimer}>2 mins remaining</Text>
        </View>

        {/* Tap Action Trigger */}
        <TouchableOpacity style={styles.tapIndicator} activeOpacity={0.7}>
          <View style={styles.tapRipple} />
          <View style={styles.tapIconBox}>
            <MaterialIcons
              name="ads-click"
              size={24}
              color={theme.colors.primary}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stageWrapper: { paddingHorizontal: 16, marginBottom: 20 },
  stageInner: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 32,
    backgroundColor: "#f8fafc",
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "#fff",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  stageImage: {
    width: "100%",
    height: "100%",
  },
  projectHud: {
    position: "absolute",
    top: "25%",
    alignSelf: "center",
    width: "60%",
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  hudHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  hudLabel: { fontSize: 8, fontWeight: "800", color: "#94a3b8" },
  hudPercent: { fontSize: 10, fontWeight: "bold", color: theme.colors.primary },
  hudTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0d1c12",
    marginBottom: 8,
  },
  hudProgressTrack: { height: 6, backgroundColor: "#f1f5f9", borderRadius: 3 },
  hudProgressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  hudTimer: {
    fontSize: 9,
    color: theme.colors.success,
    marginTop: 6,
    textAlign: "center",
    fontWeight: "bold",
  },
  tapIndicator: { position: "absolute", bottom: "25%", right: "20%" },
  tapIconBox: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 25,
    elevation: 5,
  },
  tapRipple: {
    position: "absolute",
    inset: -10,
    backgroundColor: "rgba(37, 244, 106, 0.2)",
    borderRadius: 40,
  },
});
