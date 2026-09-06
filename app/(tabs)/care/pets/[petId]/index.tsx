import { Redirect } from "expo-router";

/** /care/pets/[petId] → 투약 탭 */
export default function PetDetailIndex() {
  return <Redirect href="./medication" />;
}
