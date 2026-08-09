import { create } from "zustand";

export type PermissionKind =
  | "location"
  | "notification"
  | "backgroundLocation";

type PermissionModalState = {
  visible: boolean;
  kind: PermissionKind | null;
  onConfirm?: (() => void) | null;
  onCancel?: (() => void) | null;
  open: (params: {
    kind: PermissionKind;
    onConfirm?: () => void;
    onCancel?: () => void;
  }) => void;
  close: () => void;
};

export const usePermissionModalStore = create<PermissionModalState>((set) => ({
  visible: false,
  kind: null,
  onConfirm: null,
  onCancel: null,
  open: ({ kind, onConfirm, onCancel }) =>
    set({
      visible: true,
      kind,
      onConfirm: onConfirm ?? null,
      onCancel: onCancel ?? null,
    }),
  close: () =>
    set({
      visible: false,
      kind: null,
      onConfirm: null,
      onCancel: null,
    }),
}));

/** 훅/유틸에서 React 없이 모달 열기 */
export const openPermissionModal = (params: {
  kind: PermissionKind;
  onConfirm?: () => void;
  onCancel?: () => void;
}) => {
  usePermissionModalStore.getState().open(params);
};

export const closePermissionModal = () => {
  usePermissionModalStore.getState().close();
};
