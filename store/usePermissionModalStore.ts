import { create } from "zustand";

export type PermissionKind =
  | "location"
  | "notification"
  | "backgroundLocation";

/** disclose: 시스템 권한 요청 직전 안내 / settings: 설정 앱으로 유도 */
export type PermissionPurpose = "disclose" | "settings";

type PermissionModalState = {
  visible: boolean;
  kind: PermissionKind | null;
  purpose: PermissionPurpose;
  onConfirm?: (() => void) | null;
  onCancel?: (() => void) | null;
  open: (params: {
    kind: PermissionKind;
    purpose?: PermissionPurpose;
    onConfirm?: () => void;
    onCancel?: () => void;
  }) => void;
  close: () => void;
};

export const usePermissionModalStore = create<PermissionModalState>((set) => ({
  visible: false,
  kind: null,
  purpose: "disclose",
  onConfirm: null,
  onCancel: null,
  open: ({ kind, purpose = "disclose", onConfirm, onCancel }) =>
    set({
      visible: true,
      kind,
      purpose,
      onConfirm: onConfirm ?? null,
      onCancel: onCancel ?? null,
    }),
  close: () =>
    set({
      visible: false,
      kind: null,
      purpose: "disclose",
      onConfirm: null,
      onCancel: null,
    }),
}));

/** 훅/유틸에서 React 없이 모달 열기 */
export const openPermissionModal = (params: {
  kind: PermissionKind;
  purpose?: PermissionPurpose;
  onConfirm?: () => void;
  onCancel?: () => void;
}) => {
  usePermissionModalStore.getState().open(params);
};

export const closePermissionModal = () => {
  usePermissionModalStore.getState().close();
};
