import { useRunStore } from "@/store/useRunStore";
import { getRunResultStats } from "@/util/run/getRunResultStats";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

/** 셀피/서머리용 — 기록 축하 강조 카드 */
const RunResultBoard = () => {
  const runData = useRunStore((state) => state.runData);
  const { distanceKm, totalTimeLabel, paceLabel } = getRunResultStats(runData);

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
});

export default RunResultBoard;
