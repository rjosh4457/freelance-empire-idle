import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ClientCard } from "../../components/clients/ClientCard.tsx";
import { theme } from "../../constant/theme.ts";
import { useClientStore } from "../../stores/client-store.ts";
import { usePlayerStore } from "../../stores/player-store.ts";
import { getGlobalStatus } from "../../utils/helper.ts";

export default function Clients() {
  const insets = useSafeAreaInsets();
  const { clients } = useClientStore();
  const { player } = usePlayerStore();

  const globalReputation = getGlobalStatus(player?.reputation ?? 0);
  return (
    <SafeAreaView edges={[]} style={styles.container}>
      {/* Header Section */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View>
          <Text style={styles.headerTitle}>Clients</Text>
          <Text style={styles.headerSubtitle}>Manage your portfolio</Text>
        </View>
        <View style={styles.reputationBadge}>
          <MaterialIcons name="star" size={20} color={theme.colors.primary} />
          <Text style={styles.reputationValue}>{player?.reputation}</Text>
          <Text style={styles.reputationLabel}>REPUTATION</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollBody}
      >
        {/* Global Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusContent}>
            <View>
              <Text style={styles.statusContext}>Global Status</Text>
              <Text style={styles.statusTitle}>{globalReputation?.title}</Text>
            </View>
            <View style={styles.growthContainer}>
              <Text style={styles.growthValue}>+0.1% / hour</Text>
              <Text style={styles.growthLabel}>Reputation Growth</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionLabel}>CLIENT CATEGORIES</Text>
        {clients.map((client, index) => {
          if (!player) return null;

          const playerRep = player.reputation;
          const nextClient = clients[index + 1];

          // If player hasn't reached this client's requirement
          if (playerRep < client.reputation_required) {
            return (
              <ClientCard
                key={client.id}
                type="LOCKED"
                title={client.name}
                icon="storefront"
                requirement={`Reputation: ${client.reputation_required}`}
              />
            );
          }

          // If there's a next client and player reached it → MAXED
          const isMaxed =
            nextClient && playerRep >= nextClient.reputation_required;
          const type = isMaxed ? "MAXED" : "IN_PROGRESS";
          const progress = isMaxed
            ? 1
            : playerRep / nextClient.reputation_required;
          return (
            <ClientCard
              key={client.id}
              type={type}
              title={client.name}
              reputation={`Reputation: ${playerRep}`}
              icon={type === "IN_PROGRESS" ? "rocket-launch" : "storefront"}
              progress={progress}
              relationship="Steady"
              unlockText={
                nextClient
                  ? `Unlock at ${nextClient.reputation_required} Rep.`
                  : "Max Level"
              }
              perk={nextClient.perks}
              accentColor={theme.colors.primary}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.backgroundLight },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: "rgba(245, 248, 246, 0.8)",
  },
  headerTitle: { fontSize: 32, fontWeight: "800", color: theme.colors.black },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.mutedV3,
    fontWeight: "600",
  },
  reputationBadge: {
    backgroundColor: "rgba(37, 244, 106, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(37, 244, 106, 0.2)",
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  reputationValue: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.black,
  },
  reputationLabel: {
    fontSize: 8,
    fontWeight: "900",
    color: theme.colors.primary,
    letterSpacing: 1,
  },
  scrollBody: { paddingHorizontal: 16, paddingBottom: 80 },
  statusCard: {
    backgroundColor: "#dcfce7", // primary light mix
    borderRadius: theme.borderRadius.xl,
    padding: 24,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 24,
  },
  statusContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1,
  },
  statusContext: {
    fontSize: 12,
    color: theme.colors.mutedV3,
    fontWeight: "600",
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.black,
    marginTop: 4,
  },
  growthContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  growthValue: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.primary,
    textAlign: "right",
  },
  growthLabel: {
    fontSize: 10,
    color: theme.colors.mutedV3,
    textAlign: "right",
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: theme.colors.mutedV3,
    letterSpacing: 2,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  gridRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  shortcutCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: theme.colors.white,
    padding: 16,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.light,
  },
  shortcutLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: theme.colors.mutedV3,
  },
  shortcutValue: { fontSize: 14, fontWeight: "700", color: theme.colors.black },
});
