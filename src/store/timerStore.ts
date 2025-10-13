import { create } from "zustand";

interface TimerState {
  isStudying: boolean;
  studyTime: number; // 초 단위
  isResting: boolean;
  startTime: number | null;
  restTimeMinutes: number; // 설정된 휴식 시간 (분)
  restStartTime: number | null; // 휴식 시작 시간
  isRestTimeOver: boolean; // 휴식 시간이 끝났는지 여부
  restRemainingTime: number; // 남은 휴식 시간 (초)
}

interface TimerActions {
  startStudy: () => void;
  pauseStudy: () => void;
  stopStudy: (restMinutes: number) => void;
  updateTime: (time: number) => void;
  updateRestTime: () => void;
  resetTimer: () => void;
  setRestTimeMinutes: (minutes: number) => void;
  checkRestTimeOver: () => void;
}

type TimerStore = TimerState & TimerActions;

export const useTimerStore = create<TimerStore>((set, get) => ({
  // 초기 상태
  isStudying: false,
  studyTime: 0,
  isResting: false,
  startTime: null,
  restTimeMinutes: 1, // 기본 1분
  restStartTime: null,
  isRestTimeOver: false,
  restRemainingTime: 0,

  // 액션들
  startStudy: () => {
    const now = Date.now();
    set({
      isStudying: true,
      isResting: false, // 휴식 중이어도 공부 시작하면 휴식 해제
      studyTime: 0, // 새로운 공부 시작이므로 타이머 초기화
      startTime: now,
      restStartTime: null,
      isRestTimeOver: false,
      restRemainingTime: 0,
    });
  },

  pauseStudy: () => {
    const { studyTime, startTime } = get();
    if (startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      set({
        isStudying: false,
        studyTime: studyTime + elapsed,
        startTime: null,
      });
    }
  },

  stopStudy: (restMinutes: number) => {
    const { studyTime, startTime } = get();
    if (startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const now = Date.now();
      set({
        isStudying: false,
        isResting: true,
        studyTime: studyTime + elapsed,
        startTime: null,
        restTimeMinutes: restMinutes,
        restStartTime: now,
        isRestTimeOver: false,
        restRemainingTime: restMinutes * 60, // 설정된 시간(분)을 초로 변환
      });
    }
  },

  updateTime: (time: number) => {
    set({ studyTime: time });
  },

  updateRestTime: () => {
    const { isResting, restStartTime, restTimeMinutes } = get();
    if (isResting && restStartTime) {
      const elapsed = Math.floor((Date.now() - restStartTime) / 1000);
      const restTimeSeconds = restTimeMinutes * 60;
      const remaining = Math.max(0, restTimeSeconds - elapsed);
      
      set({ restRemainingTime: remaining });
      
      if (remaining === 0) {
        set({ isRestTimeOver: true });
      }
    }
  },

  resetTimer: () => {
    set({
      isStudying: false,
      studyTime: 0,
      isResting: false,
      startTime: null,
      restTimeMinutes: 1,
      restStartTime: null,
      isRestTimeOver: false,
      restRemainingTime: 0,
    });
  },

  setRestTimeMinutes: (minutes: number) => {
    set({ restTimeMinutes: minutes });
  },

  checkRestTimeOver: () => {
    const { isResting, restStartTime, restTimeMinutes } = get();
    if (isResting && restStartTime) {
      const elapsed = Math.floor((Date.now() - restStartTime) / 1000);
      const restTimeSeconds = restTimeMinutes * 60;

      if (elapsed >= restTimeSeconds) {
        set({ isRestTimeOver: true });
      }
    }
  },
}));
