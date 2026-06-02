import { useRunStore } from "@/store/useRunStore";
import { formatTime } from "@/util/run";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const CARD_RADIUS = 20;
const CARD_BG = "rgba(242, 88, 87, 0.7)";

const RunResultBoard = () => {
  const { runData } = useRunStore();

  return (
    <View style={styles.card}>
      <View style={styles.cardBg} />
      <View style={styles.cardContent}>
        <View style={styles.distanceRow}>
          <Text style={styles.statText}>
            {((runData?.distance ?? 0) / 1000).toFixed(2)}km
          </Text>
          <Text style={[styles.statText, styles.slash]}>/</Text>
          <Text style={styles.statText}>
            {formatTime(runData?.totalTime ?? 0)}
          </Text>
        </View>
        <View style={styles.paceBlock}>
          <Text style={styles.paceText}>{runData?.pace}</Text>
          <Text style={styles.paceLabel}>Average Pace</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 387,
    height: 186,
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
    gap: 16,
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  statText: {
    fontSize: 44,
    fontWeight: "600",
    fontStyle: "italic",
    color: "#FFFFFF",
  },
  slash: {
    lineHeight: 44,
  },
  paceBlock: {
    alignItems: "center",
    gap: 4,
  },
  paceText: {
    fontSize: 32,
    fontWeight: "600",
    fontStyle: "italic",
    color: "#FFFFFF",
  },
  paceLabel: {
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "italic",
    color: "#FFFFFF",
  },
});

export default RunResultBoard;
