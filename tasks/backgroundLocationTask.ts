import { recordRunLocation } from "@/util/run/recordRunLocation";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

export const LOCATION_TASK_NAME = "background-location-task";

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("❌ [Background Task] Error:", error);
    return;
  }

  const { locations } = (data ?? {}) as {
    locations?: Location.LocationObject[];
  };

  if (!locations?.length) return;

  locations.forEach((location) => {
    recordRunLocation(location.coords, "task");
  });
});
