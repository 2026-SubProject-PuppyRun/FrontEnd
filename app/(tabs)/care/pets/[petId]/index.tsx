import { Redirect } from "expo-router";

/** /care/pets/[petId] → 식단 탭 */
export default function PetDetailIndex() {
  return <Redirect href="./diet" />;
}
