import { useRunStore } from "@/store/useRunStore";
import { getRunResultStats } from "@/util/run/getRunResultStats";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

/** 셀피/서머리용 — 기록 축하 강조 카드 */
const RunResultBoard = ({
  variant = "card",
}: {
  variant?: "card" | "strip";
}) => {
  const runData = useRunStore((state) => state.runData);
  const { distanceKm, totalTimeLabel, paceLabel } = getRunResultStats(runData);

  if (variant === "strip") {
    return (
      <View style={styles.stripCard}>
        <View style={styles.stripMain}>
          <Text style={styles.stripDistance}>
            {distanceKm}km
            <Text style={styles.stripSlash}> / </Text>
            {totalTimeLabel}
          </Text>
          <View style={styles.stripPaceBlock}>
            <Text style={styles.stripPace}>{paceLabel}</Text>
            <Text style={styles.stripPaceLabel}>Average Pace</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.cardBg} />
        <View style={styles.cardContent}>
          <View style={styles.distanceRow}>
            <Text style={styles.statText}>{distanceKm}km</Text>
            <Text style={[styles.statText, styles.slash]}>/</Text>
            <Text style={styles.statText}>{totalTimeLabel}</Text>
          </View>
          <View style={styles.paceBlock}>
            <Text style={styles.paceText}>{paceLabel}</Text>
            <Text style={styles.paceLabel}>Average Pace</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const CARD_RADIUS = 20;
const CARD_BG = "rgba(242, 88, 87, 0.7)";

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    height: 160,
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
  },
  cardBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: CARD_BG,
    borderRadius: CARD_RADIUS,
  },
  cardContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  statText: {
    fontSize: 40,
    fontWeight: "600",
    fontStyle: "italic",
    color: "#FFFFFF",
  },
  slash: {
    lineHeight: 40,
  },
  paceBlock: {
    alignItems: "center",
    gap: 4,
  },
  paceText: {
    fontSize: 28,
    fontWeight: "600",
    fontStyle: "italic",
    color: "#FFFFFF",
  },
  paceLabel: {
    fontSize: 14,
    fontWeight: "600",
    fontStyle: "italic",
    color: "#FFFFFF",
  },
  stripCard: {
    flex: 1,
    minWidth: 0,
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    backgroundColor: "#F25857",
  },
  stripMain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  stripDistance: {
    flexShrink: 1,
    fontSize: 26,
    fontWeight: "600",
    fontStyle: "italic",
    color: "#FFFFFF",
  },
  stripSlash: {
    fontSize: 22,
    fontWeight: "600",
    fontStyle: "italic",
    color: "rgba(255,255,255,0.75)",
  },
  stripPaceBlock: {
    alignItems: "flex-end",
    gap: 2,
  },
  stripPace: {
    fontSize: 22,
    fontWeight: "600",
    fontStyle: "italic",
    color: "#FFFFFF",
  },
  stripPaceLabel: {
    fontSize: 11,
    fontWeight: "600",
    fontStyle: "italic",
    color: "rgba(255,255,255,0.85)",
  },
});

export default RunResultBoard;
