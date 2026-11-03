import { create } from "zustand";

export type PermissionKind =
  | "location"
  | "notification"
  | "backgroundLocation";

/** disclose: 시스템 권한 요청 직전 안내 / settings: 설정 앱으로 유도 */
export type PermissionPurpose = "disclose" | "settings";

export type PermissionModalOpenParams = {
  kind: PermissionKind;
  purpose?: PermissionPurpose;
  onConfirm?: () => void;
  onCancel?: () => void;
};

type PermissionModalState = {
  visible: boolean;
  kind: PermissionKind | null;
  purpose: PermissionPurpose;
  onConfirm?: (() => void) | null;
  onCancel?: (() => void) | null;
  /** 대기 중인 인앱 권한 모달 */
  queue: PermissionModalOpenParams[];
  /** 시스템 권한 다이얼로그 표시 중 — 다음 인앱 모달 보류 */
  systemPromptActive: boolean;
  open: (params: PermissionModalOpenParams) => void;
  close: () => void;
  setSystemPromptActive: (active: boolean) => void;
  flushQueue: () => void;
};

const showModal = (
  set: (partial: Partial<PermissionModalState>) => void,
  params: PermissionModalOpenParams,
) => {
  set({
    visible: true,
    kind: params.kind,
    purpose: params.purpose ?? "disclose",
    onConfirm: params.onConfirm ?? null,
    onCancel: params.onCancel ?? null,
  });
};

export const usePermissionModalStore = create<PermissionModalState>(
  (set, get) => ({
    visible: false,
    kind: null,
    purpose: "disclose",
    onConfirm: null,
    onCancel: null,
    queue: [],
    systemPromptActive: false,
    open: (params) => {
      const { visible, systemPromptActive, queue } = get();
      if (visible || systemPromptActive) {
        set({ queue: [...queue, params] });
        return;
      }
      showModal(set, params);
    },
    close: () => {
      set({
        visible: false,
        kind: null,
        purpose: "disclose",
        onConfirm: null,
        onCancel: null,
      });
      queueMicrotask(() => get().flushQueue());
    },
    setSystemPromptActive: (active) => {
      set({ systemPromptActive: active });
      if (!active) {
        queueMicrotask(() => get().flushQueue());
      }
    },
    flushQueue: () => {
      const { visible, systemPromptActive, queue } = get();
      if (visible || systemPromptActive || queue.length === 0) return;

      const [next, ...rest] = queue;
      set({ queue: rest });
      showModal(set, next);
    },
  }),
);

/** 훅/유틸에서 React 없이 모달 열기 (이미 열려 있으면 큐에 적재) */
export const openPermissionModal = (params: PermissionModalOpenParams) => {
  usePermissionModalStore.getState().open(params);
};

export const closePermissionModal = () => {
  usePermissionModalStore.getState().close();
};

/** 시스템 권한 팝업 전후로 다음 인앱 모달이 끼어들지 않게 잠금 */
export const beginSystemPermissionPrompt = () => {
  usePermissionModalStore.getState().setSystemPromptActive(true);
};

export const endSystemPermissionPrompt = () => {
  usePermissionModalStore.getState().setSystemPromptActive(false);
};
