import {
  Accordion,
  AccordionContent,
  AccordionContentText,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDownIcon, ChevronUpIcon } from "@/components/ui/icon";
import { BREED_DATA } from "@/constants/breedData";
import { ScrollView } from "react-native";

const BreedGuideBody = () => {
  const breedList = BREED_DATA;

  //     {
  //     name: "말티즈",
  //     code: "101",
  //     color: "#FFFFFF",
  //     weightRange: "2.0 ~ 4.0",
  //     size: "소형견",
  //     personality: "활발하고 애교가 많으며 보호자에게 강한 애착을 보입니다.",
  //     geneticDiseases: ["슬개골 탈구", "유류증(눈물자국)", "기관지 협착증"],
  //     recommendedExercise: "하루 30분 내외의 가벼운 산책",
  //   }, data 구조 예시
  return (
    <ScrollView>
      <Accordion
        size="lg"
        variant="unfilled"
        type="multiple"
        isCollapsible={true}
        isDisabled={false}
        className="m-5 w-[90%] gap-2"
      >
        {breedList.map((breed) => (
          <AccordionItem value={breed.code} key={breed.code}>
            <AccordionHeader>
              <AccordionTrigger>
                {({ isExpanded }: { isExpanded: boolean }) => {
                  return (
                    <>
                      <AccordionTitleText className="text-black">
                        {breed.name}
                      </AccordionTitleText>
                      {isExpanded ? (
                        <AccordionIcon
                          as={ChevronUpIcon}
                          className="text-black"
                        />
                      ) : (
                        <AccordionIcon
                          as={ChevronDownIcon}
                          className="text-black"
                        />
                      )}
                    </>
                  );
                }}
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className="mt-0 pt-2">
              <AccordionContentText className="text-black">
                체중 범위: {breed.weightRange} kg
                {"\n"}
                크기 분류: {breed.size}
                {"\n"}
                성격: {breed.personality}
                {"\n"}
                유의해야 할 유전병: {breed.geneticDiseases.join(", ")}
                {"\n"}
                추천 운동량: {breed.recommendedExercise}
              </AccordionContentText>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollView>
  );
};

export default BreedGuideBody;
