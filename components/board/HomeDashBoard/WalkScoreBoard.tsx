import WalkScoreSkeleton from "@/components/skeleton/WalkScoreSkeleton";
import { Text } from "@/components/ui/text";
import { useLocationPermission } from "@/hooks/use-location-permission";
import { useWeatherStore } from "@/store/useWeatherStore";
import {
  fetchWithRetry,
  getCurrentPositionWithRetry,
} from "@/util/location";
import { getDustLevel } from "@/util/weather";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";

const HOURLY_FORECAST = [
  { hour: "4시", temp: "5°" },
  { hour: "5시", temp: "5°" },
  { hour: "6시", temp: "4°" },
  { hour: "7시", temp: "4°" },
];

const RAIN_FORECAST = [
  { hour: "4시", chance: "10%", amount: "5mm" },
  { hour: "5시", chance: "10%", amount: "5mm" },
  { hour: "6시", chance: "20%", amount: "8mm" },
  { hour: "7시", chance: "30%", amount: "10mm" },
];

const WalkScoreBoard = () => {
  const permission = useLocationPermission();
  const isLocationInitialized = useRef(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState<string | null>(null);
  const [dustLevel, setDustLevel] = useState<{
    text: string;
    color: string;
    icon: string;
  } | null>(null);

  useEffect(() => {
    if (permission === null || isLocationInitialized.current) return;

    if (permission === false) {
      setErrorMsg("위치 권한이 거부되었습니다.");
      setIsLoading(false);
      return;
    }

    const initLocation = async () => {
      try {
        const serviceEnabled = await Location.hasServicesEnabledAsync();
        if (!serviceEnabled) {
          setErrorMsg("기기 위치 서비스가 꺼져 있습니다. 설정에서 켜 주세요.");
          return;
        }

        const location = await getCurrentPositionWithRetry();

        const [reverseGeocode] = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setAddress(
          `${reverseGeocode.region || ""} ${reverseGeocode.city || ""} ${reverseGeocode.street || ""}`.trim(),
        );

        const airRes = await fetchWithRetry(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${process.env.EXPO_PUBLIC_OPENWEATHERMAP_API_KEY}`,
        );
        const airData = await airRes.json();
        useWeatherStore.getState().setAir({
          pm10: airData.list[0].components.pm10,
          pm25: airData.list[0].components.pm2_5,
        });
        setDustLevel({
          text: getDustLevel(airData.list[0].components.pm10, "pm10").text,
          color: getDustLevel(airData.list[0].components.pm10, "pm10").color,
          icon: getDustLevel(airData.list[0].components.pm10, "pm10").icon,
        });
        setErrorMsg(null);
        isLocationInitialized.current = true;
      } catch (error) {
        console.error("위치/날씨 조회 실패:", error);
        setErrorMsg(
          "현재 위치를 가져올 수 없습니다. 잠시 후 다시 시도해 주세요.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void initLocation();
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
          <Text className="text-sm font-medium text-white">{address}</Text>
        </View>
      </View>

      <View className="rounded-3xl bg-white px-5 py-5 shadow-sm">
        <View className="flex-row items-center gap-4">
          <View className="rounded-2xl bg-[#FFF0F0] p-3">
            <Ionicons name="cloudy-sharp" size={36} color="#F25857" />
          </View>
          <View>
            <Text className="text-2xl font-bold text-[#0D0F1B]">5°</Text>
            <Text className="text-sm text-gray-500">구름 많음</Text>
            <Text className="mt-0.5 text-xs text-gray-400">
              최고 17° · 최저 3°
            </Text>
          </View>
        </View>

        <View className="mt-5 flex-row justify-between">
          {HOURLY_FORECAST.map((item) => (
            <View key={item.hour} className="items-center gap-1">
              <Text className="text-xs text-gray-500">{item.hour}</Text>
              <Ionicons name="cloudy-sharp" size={28} color="#FFB3B2" />
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
              {dustLevel?.text}
            </Text>
            <Ionicons
              name={(dustLevel?.icon as "happy" | "sad") || "help"}
              size={20}
              color={dustLevel?.color}
            />
          </View>
        </View>
        <View className="flex-row items-center justify-between rounded-2xl bg-[#F7F7F7] px-4 py-3">
          <Text className="text-sm text-[#0D0F1B]">초미세먼지</Text>
          <View className="flex-row items-center gap-1.5">
            <Text className="text-sm font-semibold text-[#0D0F1B]">
              {dustLevel?.text}
            </Text>
            <Ionicons
              name={(dustLevel?.icon as "happy" | "sad") || "help"}
              size={20}
              color={dustLevel?.color}
            />
          </View>
        </View>
      </View>

      <View className="rounded-3xl bg-white p-5 shadow-sm">
        <Text className="mb-4 text-sm font-semibold text-gray-500">
          시간대별 예상 강수량
        </Text>
        <View className="flex-row justify-between">
          {RAIN_FORECAST.map((item) => (
            <View key={item.hour} className="items-center gap-1.5">
              <Text className="text-xs text-gray-500">{item.hour}</Text>
              <Ionicons name="umbrella-sharp" size={28} color="#FFB3B2" />
              <Text className="text-sm font-semibold text-[#0D0F1B]">
                {item.chance}
              </Text>
              <Text className="text-xs text-gray-400">{item.amount}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default WalkScoreBoard;
