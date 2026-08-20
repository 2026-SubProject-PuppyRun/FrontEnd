import WalkScoreSkeleton from "@/components/skeleton/WalkScoreSkeleton";
import { Text } from "@/components/ui/text";
import { useLocationPermission } from "@/hooks/use-location-permission";
import { useWeatherStore } from "@/store/useWeatherStore";
import { getCurrentPositionWithRetry } from "@/util/location";
import {
  formatTemp,
  formatWeatherHour,
  getDustLevel,
  getSkyLabel,
  getWeatherIcon,
  loadWeatherIntoStore,
} from "@/util/weather";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { View } from "react-native";

export type WalkScoreBoardHandle = {
  refresh: () => Promise<void>;
};

const WalkScoreBoard = forwardRef<WalkScoreBoardHandle>(function WalkScoreBoard(
  _,
  ref,
) {
  const permission = useLocationPermission();
  const permissionRef = useRef(permission);
  permissionRef.current = permission;
  const isLocationInitialized = useRef(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState<string | null>(null);

  const current = useWeatherStore((state) => state.current);
  const forecast = useWeatherStore((state) => state.forecast6hour);
  const air = useWeatherStore((state) => state.air);

  const hourlyForecast = useMemo(
    () =>
      forecast.times.map((time, index) => ({
        key: `${time}-${index}`,
        hour: formatWeatherHour(time),
        temp: formatTemp(forecast.temp[index]),
        icon: getWeatherIcon(forecast.sky[index], forecast.pty[index]),
      })),
    [forecast],
  );

  const rainForecast = useMemo(
    () =>
      forecast.times.map((time, index) => ({
        key: `${time}-rain-${index}`,
        hour: formatWeatherHour(time),
        pcp: forecast.pcp[index] || "강수없음",
      })),
    [forecast],
  );

  const pm10Level = air.pm10 != null ? getDustLevel(air.pm10, "pm10") : null;
  const pm25Level = air.pm25 != null ? getDustLevel(air.pm25, "pm25") : null;

  const displayAddress = address || current.regionLabel || "위치 확인 중";
  const weatherIcon = getWeatherIcon(current.sky, current.pty);
  const skyLabel = getSkyLabel(current.sky);

  const minMaxLabel = (() => {
    if (forecast.temp.length === 0) return null;
    const max = Math.max(...forecast.temp);
    const min = Math.min(...forecast.temp);
    return `최고 ${formatTemp(max)} · 최저 ${formatTemp(min)}`;
  })();

  const loadWeather = async (options?: { showSkeleton?: boolean }) => {
    const currentPermission = permissionRef.current;
    if (currentPermission === false) {
      setErrorMsg("위치 권한이 거부되었습니다.");
      setIsLoading(false);
      return;
    }
    if (currentPermission !== true) return;

    if (options?.showSkeleton) {
      setIsLoading(true);
    }

    try {
      const serviceEnabled = await Location.hasServicesEnabledAsync();
      if (!serviceEnabled) {
        setErrorMsg("기기 위치 서비스가 꺼져 있습니다. 설정에서 켜 주세요.");
        return;
      }

      const location = await getCurrentPositionWithRetry();
      const { latitude, longitude } = location.coords;

      try {
        const [reverseGeocode] = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        setAddress(
          `${reverseGeocode.region || ""} ${reverseGeocode.city || ""} ${reverseGeocode.street || ""}`.trim(),
        );
      } catch {
        // regionLabel(API)로 대체
      }

      await loadWeatherIntoStore({ lat: latitude, lon: longitude });
      setErrorMsg(null);
      isLocationInitialized.current = true;
    } catch (error) {
      console.error("위치/날씨 조회 실패:", error);
      setErrorMsg(
        "현재 날씨를 가져올 수 없습니다. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadWeatherRef = useRef(loadWeather);
  loadWeatherRef.current = loadWeather;

  useImperativeHandle(ref, () => ({
    refresh: () => loadWeatherRef.current({ showSkeleton: false }),
  }));

  useEffect(() => {
    if (permission === null || isLocationInitialized.current) return;

    if (permission === false) {
      setErrorMsg("위치 권한이 거부되었습니다.");
      setIsLoading(false);
      return;
    }

    void loadWeatherRef.current({ showSkeleton: true });
  }, [permission]);

  if (isLoading) {
    return <WalkScoreSkeleton />;
  }

  if (errorMsg) {
    return (
      <View className="mx-6 items-center justify-center rounded-3xl bg-white px-6 py-10 shadow-sm">
        <View className="mb-3 rounded-full bg-[#FFF0F0] p-3">
          <Ionicons name="location-outline" size={24} color="#F25857" />
        </View>
        <Text className="text-center text-sm text-gray-600">{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View className="gap-4 px-6 pb-4">
      <Text className="text-base font-semibold text-[#0D0F1B]">
        산책 점수 · 날씨
      </Text>

      <View className="rounded-3xl bg-white p-5 shadow-sm">
        <View className="flex-row items-center gap-2 self-start rounded-full bg-[#F25857] px-4 py-2">
          <Ionicons name="location-sharp" size={16} color="white" />
          <Text className="text-sm font-medium text-white">
            {displayAddress}
          </Text>
        </View>
      </View>

      <View className="rounded-3xl bg-white px-5 py-5 shadow-sm">
        <View className="flex-row items-center gap-4">
          <View className="rounded-2xl bg-[#FFF0F0] p-3">
            <Ionicons name={weatherIcon} size={36} color="#F25857" />
          </View>
          <View>
            <Text className="text-2xl font-bold text-[#0D0F1B]">
              {formatTemp(current.temp)}
            </Text>
            <Text className="text-sm text-gray-500">{skyLabel}</Text>
            {minMaxLabel ? (
              <Text className="mt-0.5 text-xs text-gray-400">
                {minMaxLabel}
              </Text>
            ) : null}
          </View>
        </View>

        <View className="mt-5 flex-row justify-between">
          {(hourlyForecast.length > 0 ? hourlyForecast : [])
            .slice(0, 6)
            .map((item) => (
              <View key={item.key} className="items-center gap-1">
                <Text className="text-xs text-gray-500">{item.hour}</Text>
                <Ionicons name={item.icon} size={28} color="#FFB3B2" />
                <Text className="text-sm font-semibold text-[#0D0F1B]">
                  {item.temp}
                </Text>
              </View>
            ))}
        </View>
      </View>

      <View className="gap-3 rounded-3xl bg-white p-5 shadow-sm">
        <Text className="text-sm font-semibold text-gray-500">대기질</Text>
        <View className="flex-row items-center justify-between rounded-2xl bg-[#F7F7F7] px-4 py-3">
          <Text className="text-sm text-[#0D0F1B]">미세먼지</Text>
          <View className="flex-row items-center gap-1.5">
            <Text className="text-sm font-semibold text-[#0D0F1B]">
              {pm10Level?.text ?? "-"}
            </Text>
            <Ionicons
              name={(pm10Level?.icon as "happy" | "sad") || "help"}
              size={20}
              color={pm10Level?.color ?? "#9CA3AF"}
            />
          </View>
        </View>
        <View className="flex-row items-center justify-between rounded-2xl bg-[#F7F7F7] px-4 py-3">
          <Text className="text-sm text-[#0D0F1B]">초미세먼지</Text>
          <View className="flex-row items-center gap-1.5">
            <Text className="text-sm font-semibold text-[#0D0F1B]">
              {pm25Level?.text ?? "-"}
            </Text>
            <Ionicons
              name={(pm25Level?.icon as "happy" | "sad") || "help"}
              size={20}
              color={pm25Level?.color ?? "#9CA3AF"}
            />
          </View>
        </View>
      </View>

      <View className="rounded-3xl bg-white p-5 shadow-sm">
        <Text className="mb-4 text-sm font-semibold text-gray-500">
          시간대별 예상 강수량
        </Text>
        <View className="flex-row justify-between">
          {(rainForecast.length > 0 ? rainForecast : [])
            .slice(0, 6)
            .map((item) => (
              <View key={item.key} className="max-w-[15%] items-center gap-1.5">
                <Text className="text-xs text-gray-500">{item.hour}</Text>
                <Ionicons name="umbrella-sharp" size={28} color="#FFB3B2" />
                <Text
                  className="text-center text-xs font-semibold text-[#0D0F1B]"
                  numberOfLines={2}
                >
                  {item.pcp}
                </Text>
              </View>
            ))}
        </View>
      </View>
    </View>
  );
});

export default WalkScoreBoard;
