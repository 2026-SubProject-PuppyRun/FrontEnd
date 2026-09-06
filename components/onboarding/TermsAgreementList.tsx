import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { CheckIcon } from "@/components/ui/icon";
import {
  TERMS_AGREEMENT_ITEMS,
  type TermsAgreementId,
} from "@/constants/termsData";
import { Linking, Pressable, Text, View } from "react-native";

type TermsAgreementListProps = {
  agreed: Record<TermsAgreementId, boolean>;
  onChange: (id: TermsAgreementId, value: boolean) => void;
  onAgreeAll: (value: boolean) => void;
};

const TermsAgreementList = ({
  agreed,
  onChange,
  onAgreeAll,
}: TermsAgreementListProps) => {
  const allAgreed = TERMS_AGREEMENT_ITEMS.every((item) => agreed[item.id]);

  const openTermsUrl = (url: string) => {
    void Linking.openURL(url);
  };

  return (
    <View className="gap-3">
      <View className="rounded-3xl bg-white px-5 py-4">
        <Checkbox
          size="md"
          value="all"
          isChecked={allAgreed}
          onChange={onAgreeAll}
          aria-label="전체 동의"
        >
          <CheckboxIndicator>
            <CheckboxIcon as={CheckIcon} />
          </CheckboxIndicator>
          <CheckboxLabel className="text-base font-semibold text-[#0D0F1B]">
            전체 동의
          </CheckboxLabel>
        </Checkbox>
      </View>

      <View className="rounded-3xl bg-white px-5 py-2">
        {TERMS_AGREEMENT_ITEMS.map((item, index) => (
          <View
            key={item.id}
            className={
              index < TERMS_AGREEMENT_ITEMS.length - 1
                ? "border-b border-gray-100 py-3.5"
                : "py-3.5"
            }
          >
            <View className="flex-row items-center gap-2">
              <Checkbox
                size="md"
                value={item.id}
                isChecked={agreed[item.id]}
                onChange={(checked) => onChange(item.id, checked)}
                aria-label={item.label}
                className="flex-1"
              >
                <CheckboxIndicator>
                  <CheckboxIcon as={CheckIcon} />
                </CheckboxIndicator>
                <CheckboxLabel className="flex-1 text-sm text-[#0D0F1B]">
                  <Text className="text-sm text-[#0D0F1B]">
                    <Text
                      className={
                        item.required
                          ? "font-semibold text-[#F25857]"
                          : "font-semibold text-gray-400"
                      }
                    >
                      {item.required ? "[필수] " : "[선택] "}
                    </Text>
                    {item.label}
                  </Text>
                </CheckboxLabel>
              </Checkbox>

              <Pressable
                onPress={() => openTermsUrl(item.url)}
                hitSlop={8}
                className="px-1 py-1 active:opacity-70"
              >
                <Text className="text-xs font-medium text-gray-400 underline">
                  보기
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default TermsAgreementList;
