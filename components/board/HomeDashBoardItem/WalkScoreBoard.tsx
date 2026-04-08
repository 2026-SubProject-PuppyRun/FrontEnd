import WalkScoreSkeleton from "@/components/skeleton/WalkScoreSkeleton";
import { useLocationPermission } from "@/hooks/use-location-permission";
import { useWeatherStore } from "@/store/useWeatherStore";
import { getDustLevel } from "@/util/getDustLevel";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";

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
    const initLocation = async () => {
      if (permission === null || isLocationInitialized.current) return;
      try {
        if (permission !== true) {
          if (permission === false) setErrorMsg("위치 권한이 거부되었습니다.");
          return;
        }

        const serviceEnabled = await Location.hasServicesEnabledAsync();
        if (!serviceEnabled) {
          setErrorMsg("기기 위치 서비스가 꺼져 있습니다. 설정에서 켜 주세요.");
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const [reverseGeocode] = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setAddress(
          `${reverseGeocode.region || ""} ${reverseGeocode.city || ""} ${reverseGeocode.street || ""}`.trim(),
        );

        const airRes = await fetch(
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
        isLocationInitialized.current = true;
      } catch (error) {
        isLocationInitialized.current = true;
        console.error("위치 조회 실패:", error);
        setErrorMsg(
          "현재 위치를 가져올 수 없습니다. 잠시 후 다시 시도해 주세요.",
        );
      } finally {
        setIsLoading(false);
      }
    };
    if (permission === true && !isLocationInitialized.current) initLocation();
  }, [permission]);

  if (isLoading) {
    return <WalkScoreSkeleton />;
  }
  return (
    <View className="m-4 gap-6 pb-16">
      <View className="rounded-lg bg-white p-4 shadow">
        <View className="flex-row items-center gap-2 self-start rounded-2xl bg-[#737153] px-4 py-2">
          <Ionicons name="location-sharp" size={20} color="white" />
          <Text className="text-white">{address}</Text>
        </View>
      </View>
      <View className="rounded-lg bg-white px-8 py-4 shadow">
        <View className="flex-row items-center gap-4">
          <Ionicons name="cloudy-sharp" size={60} color="#BFB8AA" />
          <View>
            <Text>5° 구름많음</Text>
            <Text>최고 17° 최저 3° </Text>
          </View>
        </View>
        <View className="flex-row justify-between px-4">
          <View className="items-center gap-1 pt-4">
            <Text>4시</Text>
            <Ionicons name="cloudy-sharp" size={40} color="#BFB8AA" />
            <Text>5°</Text>
          </View>
          <View className="items-center gap-1 pt-4">
            <Text>5시</Text>
            <Ionicons name="cloudy-sharp" size={40} color="#BFB8AA" />
            <Text>5°</Text>
          </View>
          <View className="items-center gap-1 pt-4">
            <Text>6시</Text>
            <Ionicons name="cloudy-sharp" size={40} color="#BFB8AA" />
            <Text>5°</Text>
          </View>
          <View className="items-center gap-1 pt-4">
            <Text>7시</Text>
            <Ionicons name="cloudy-sharp" size={40} color="#BFB8AA" />
            <Text>5°</Text>
          </View>
        </View>
      </View>
      <View className="gap-4 rounded-lg bg-white p-4 shadow">
        <View className="flex-row items-center justify-between">
          <Text>미세먼지</Text>
          <View className="flex-row items-center gap-1">
            <Text>{dustLevel?.text}</Text>
            <Ionicons
              name={(dustLevel?.icon as "happy" | "sad") || "help"}
              size={24}
              color={dustLevel?.color}
            />
          </View>
        </View>
        <View className="flex-row items-center justify-between">
          <Text>초미세먼지</Text>
          <View className="flex-row items-center gap-1">
            <Text>{dustLevel?.text}</Text>
            <Ionicons
              name={(dustLevel?.icon as "happy" | "sad") || "help"}
              size={24}
              color={dustLevel?.color}
            />
          </View>
        </View>
      </View>
      <View className="rounded-lg bg-white p-4 shadow ">
        <Text>시간대 별 예상 강수량</Text>
        <View className="flex-row justify-between px-4">
          <View className="items-center gap-4 pt-4">
            <Text>4시</Text>
            <Ionicons name="umbrella-sharp" size={40} color="#BFB8AA" />
            <Text>10%</Text>
            <Text>5mm</Text>
          </View>
          <View className="items-center gap-4 pt-4">
            <Text>5시</Text>
            <Ionicons name="umbrella-sharp" size={40} color="#BFB8AA" />
            <Text>10%</Text>
            <Text>5mm</Text>
          </View>
          <View className="items-center gap-4 pt-4">
            <Text>6시</Text>
            <Ionicons name="umbrella-sharp" size={40} color="#BFB8AA" />
            <Text>10%</Text>
            <Text>5mm</Text>
          </View>
          <View className="items-center gap-4 pt-4">
            <Text>7시</Text>
            <Ionicons name="umbrella-sharp" size={40} color="#BFB8AA" />
            <Text>10%</Text>
            <Text>5mm</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default WalkScoreBoard;
