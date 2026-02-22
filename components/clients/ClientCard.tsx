import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../constant/theme.ts";
import { IconNameMC } from "../../types/common.d.ts";

interface ClientCardProps {
  type: "MAXED" | "IN_PROGRESS" | "LOCKED";
  title: string;
  reputation?: string;
  icon: IconNameMC;
  progress?: number;
  relationship?: string;
  perk?: string;
  unlockText?: string;
  requirement?: string;
  accentColor?: string;
}

export const ClientCard = ({
  type,
  title,
  reputation,
  icon,
  progress,
  relationship,
  perk,
  unlockText,
  requirement,
  accentColor,
}: ClientCardProps) => {
  if (type === "LOCKED") {
    return (
      <View style={cardStyles.lockedCard}>
        <View style={cardStyles.lockedContent}>
          <View style={cardStyles.lockedIconBox}>
            <MaterialIcons name={icon} size={30} color={theme.colors.mutedV3} />
          </View>
          <View>
            <Text style={cardStyles.lockedTitle}>{title}</Text>
            <Text style={cardStyles.lockedSubtitle}>Unknown Level</Text>
          </View>
        </View>
        <View style={(StyleSheet.absoluteFillObject, cardStyles.lockOverlay)}>
          <View style={cardStyles.lockCircle}>
            <MaterialIcons name="lock" size={20} color={theme.colors.white} />
          </View>
          <Text style={cardStyles.reqLabel}>REQUIREMENT</Text>
          <Text style={cardStyles.reqValue}>{requirement}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={cardStyles.card}>
      <View style={cardStyles.cardHeader}>
        <View style={cardStyles.headerLeft}>
          <View
            style={[
              cardStyles.iconBox,
              { backgroundColor: `${accentColor}15` },
            ]}
          >
            <MaterialIcons name={icon} size={32} color={accentColor} />
          </View>
          <View>
            <Text style={cardStyles.title}>{title}</Text>
            <Text
              style={[
                cardStyles.level,
                {
                  color:
                    type === "MAXED"
                      ? theme.colors.primary
                      : theme.colors.mutedV3,
                },
              ]}
            >
              {reputation}{" "}
              {type === "MAXED" && <MaterialIcons name="verified" size={12} />}
            </Text>
          </View>
        </View>
        {type === "MAXED" ? (
          <View style={cardStyles.maxBadge}>
            <Text style={cardStyles.maxText}>MAXED</Text>
          </View>
        ) : (
          <TouchableOpacity style={cardStyles.playBtn}>
            <MaterialIcons
              name="play-arrow"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={cardStyles.progressSection}>
        <View style={cardStyles.progressLabels}>
          <Text style={cardStyles.progLabel}>
            {type === "MAXED" ? "RELATIONSHIP" : "PROGRESS"}
          </Text>
          <Text style={[cardStyles.progValue, { color: accentColor }]}>
            {type === "MAXED" ? relationship : `${progress! * 100}%`}
          </Text>
        </View>
        <View style={cardStyles.barBg}>
          <View
            style={[
              cardStyles.barFill,
              { width: `${progress! * 100}%`, backgroundColor: accentColor },
            ]}
          />
        </View>
      </View>

      <View
        style={[
          cardStyles.perkBox,
          {
            backgroundColor: theme.colors.backgroundLight,
          },
        ]}
      >
        <View style={cardStyles.perkLeft}>
          <MaterialIcons
            name={type === "MAXED" ? "workspace-premium" : "candlestick-chart"}
            size={20}
            color={
              type === "MAXED" ? theme.colors.secondary : theme.colors.mutedV3
            }
          />
          <View>
            <Text
              style={[
                cardStyles.perkStatus,
                {
                  color:
                    type === "MAXED"
                      ? theme.colors.secondary
                      : theme.colors.mutedV3,
                },
              ]}
            >
              {type === "MAXED" ? "ACTIVE PERK" : unlockText}
            </Text>
            {type === "MAXED" && (
              <Text style={cardStyles.perkName}>{perk}</Text>
            )}
          </View>
        </View>
        {type === "IN_PROGRESS" && (
          <Text style={cardStyles.perkValue}>+{perk}</Text>
        )}
      </View>
    </View>
  );
};

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(37, 244, 106, 0.1)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: { flexDirection: "row", gap: 16 },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "800", color: theme.colors.black },
  level: { fontSize: 14, fontWeight: "600", marginTop: 2 },
  maxBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
  },
  maxText: { fontSize: 10, fontWeight: "900", color: theme.colors.black },
  playBtn: {
    backgroundColor: "rgba(37, 244, 106, 0.1)",
    padding: 8,
    borderRadius: 8,
  },
  progressSection: { marginTop: 16 },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progLabel: { fontSize: 10, fontWeight: "800", color: theme.colors.mutedV3 },
  progValue: { fontSize: 10, fontWeight: "800" },
  barBg: {
    height: 12,
    backgroundColor: theme.colors.muted,
    borderRadius: 6,
    overflow: "hidden",
  },
  barFill: { height: "100%" },
  perkBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: theme.colors.light,
  },
  perkLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  perkStatus: { fontSize: 9, fontWeight: "900", letterSpacing: 1 },
  perkName: { fontSize: 14, fontWeight: "800", color: theme.colors.black },
  perkValue: { fontSize: 12, fontWeight: "900", color: theme.colors.secondary },
  // Locked Styles
  lockedCard: {
    backgroundColor: "rgba(226, 232, 240, 0.5)",
    borderRadius: theme.borderRadius.lg,
    padding: 24,
    marginBottom: 16,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#cbd5e1",
  },
  lockedContent: { flexDirection: "row", gap: 16, opacity: 0.3 },
  lockedIconBox: {
    width: 56,
    height: 56,
    backgroundColor: "#e2e8f0",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  lockedTitle: { fontSize: 18, fontWeight: "800" },
  lockedSubtitle: { fontSize: 14 },
  lockOverlay: { justifyContent: "center", alignItems: "center" },
  lockCircle: {
    backgroundColor: "#1e293b",
    padding: 10,
    borderRadius: 20,
    marginBottom: 8,
  },
  reqLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: theme.colors.mutedV3,
    letterSpacing: 2,
  },
  reqValue: { fontSize: 14, fontWeight: "800", color: theme.colors.black },
});
