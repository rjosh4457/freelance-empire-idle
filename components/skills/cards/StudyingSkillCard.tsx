import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Dimensions,
  DimensionValue,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../../../constant/theme.ts";
import { useSkillStore } from "../../../stores/skills-store.ts";
import { IconNameMC } from "../../../types/common.d.ts";
import { getStudyProgress, getTimeRemaining } from "../../../utils/time.ts";

const { width } = Dimensions.get("window");

interface SkillCardProps {
  icon: IconNameMC;
  title: string;
  color: string;
  startedAt: string; // ISO String from your Store/DB
  finishAt: string; // ISO String from your Store/DB
}

export const StudyingSkillCard = ({
  icon,
  title,
  color,
  startedAt,
  finishAt,
}: SkillCardProps) => {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(finishAt));
  const [progress, setProgress] = useState(
    getStudyProgress(startedAt, finishAt),
  );
  const { getPlayerSkills } = useSkillStore();

  useEffect(() => {
    console.log("hehe");

    const timer = setInterval(async () => {
      const remaining = getTimeRemaining(finishAt);
      const currentProgress = getStudyProgress(startedAt, finishAt);

      setTimeLeft(remaining);
      setProgress(currentProgress);

      if (remaining === "Completed") {
        clearInterval(timer);
        try {
          await getPlayerSkills();
        } catch (error) {
          console.error("Failed to refresh skills:", error);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [startedAt, finishAt, getPlayerSkills]);

  const progressPercent = `${(progress * 100).toFixed(2)}%`;

  return (
    <View style={styles.card}>
      {/* Icon with subtle background tint */}
      <View style={[styles.iconContainer, { backgroundColor: `${color}1A` }]}>
        <MaterialIcons name={icon} size={48} color={color} />
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {/* Progress Bar */}
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: progressPercent as DimensionValue,
                backgroundColor: color,
              },
            ]}
          />
        </View>

        {/* Time Remaining Row */}
        <View style={styles.timeRow}>
          <MaterialIcons
            name="access-time-filled"
            size={14}
            color={theme.colors.primary}
            style={styles.clockIcon}
          />
          <Text style={styles.timeText}>{timeLeft}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} activeOpacity={0.8}>
        <Text style={styles.buttonText}>View Lesson</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: (width - 44) / 2, // Accounting for 2-column grid gaps
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(37, 244, 106, 0.05)",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  iconContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    marginTop: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0d1c12",
    fontFamily: theme.typography.display,
  },
  progressTrack: {
    height: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 3,
    marginTop: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  clockIcon: {
    marginRight: 4,
  },
  timeText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "700",
    fontVariant: ["tabular-nums"], // Keeps numbers from jumping
  },
  button: {
    marginTop: 12,
    backgroundColor: "rgba(37, 244, 106, 0.08)",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: theme.colors.primary,
    fontWeight: "800",
    fontSize: 12,
    textTransform: "uppercase",
  },
});
