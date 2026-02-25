import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Navigation } from "../../components/common/Navigation.tsx";
import { GigCard } from "../../components/gigs/cards/GigCard.tsx";
import { theme } from "../../constant/theme.ts";
import { useClientStore } from "../../stores/client-store.ts";
import { useGigsStore } from "../../stores/gig-store.ts";
import { usePlayerStore } from "../../stores/player-store.ts";
import { SkillCode } from "../../types/skills.d.ts";
import { getDifficultyLabel } from "../../utils/helper.ts";
import { SKILL_MAP } from "../../utils/mapping.ts";

const CATEGORIES = ["All Gigs", "Web Dev", "Design", "Marketing", "Scripting"];

export default function Marketplace() {
  const { gigs, getAllGigs } = useGigsStore();
  const { player } = usePlayerStore();
  const { clients } = useClientStore();

  const [timeLeft, setTimeLeft] = useState<string>("--");

  useEffect(() => {
    if (!gigs.length) return;

    const resetTime = new Date(gigs[0].expires_at).getTime();
    const interval = setInterval(() => {
      const diff = resetTime - Date.now();

      if (diff <= 0) {
        getAllGigs(clients);
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor(diff / 1000 / 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [gigs]);

  useEffect(() => {
    if (!clients || !clients.length) return;

    getAllGigs(clients);
  }, [clients]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.brand}>
            <View style={styles.brandIcon}>
              <MaterialIcons
                name="work"
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.headerTitle}>Gig Marketplace</Text>
          </View>
          <View style={styles.balanceContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <Text style={styles.balanceText}>{player?.money}</Text>
          </View>
        </View>

        {/* Horizontal Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
        >
          {CATEGORIES.map((cat, i) => (
            <TouchableOpacity
              key={cat}
              style={[styles.tab, i === 0 && styles.activeTab]}
            >
              <Text style={[styles.tabText, i === 0 && styles.activeTabText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.mainContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Gigs</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Reset in {timeLeft}</Text>
          </View>
        </View>

        {gigs.map((gig) => (
          <GigCard
            key={gig.id}
            title={gig.name}
            difficulty={getDifficultyLabel(gig.difficulty)}
            rating={gig.difficulty}
            reward={`$${gig.reward_money.toFixed(2)}`}
            xp={`+${gig.reward_reputation}`}
            requirement={`Lvl ${gig.required_level} ${SKILL_MAP[gig.required_skill as SkillCode]}`}
            accentColor="#3b82f6"
          />
        ))}
      </ScrollView>
      <Navigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.backgroundLight },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: "rgba(245, 248, 246, 0.8)",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandIcon: {
    backgroundColor: "rgba(37, 244, 106, 0.2)",
    padding: 8,
    borderRadius: 10,
  },
  headerTitle: { fontSize: 22, fontWeight: "800" },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(37, 244, 106, 0.2)",
  },
  dollarSign: {
    color: theme.colors.primary,
    fontWeight: "900",
    marginRight: 4,
  },
  balanceText: { fontWeight: "700", fontSize: 16 },
  tabScroll: { paddingBottom: 12, gap: 12 },
  tab: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(37, 244, 106, 0.1)",
  },
  activeTab: { backgroundColor: theme.colors.primary },
  tabText: { fontWeight: "600", color: "#499c65" },
  activeTabText: { color: "#0d1c12", fontWeight: "800" },
  mainContent: { padding: 16, paddingBottom: 100 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", opacity: 0.8 },
  badge: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: { color: "#3b82f6", fontSize: 10, fontWeight: "900" },
});
