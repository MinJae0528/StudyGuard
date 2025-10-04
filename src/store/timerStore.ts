import { create } from "zustand";

interface TimerState {
  isStudying: boolean;
  studyTime: number; // 초 단위
  isResting: boolean;
  startTime: number | null;
  restTimeMinutes: number; // 설정된 휴식 시간 (분)
}

interface TimerActions {
  startStudy: () => void;
  pauseStudy: () => void;
  stopStudy: (restMinutes: number) => void;
  updateTime: (time: number) => void;
  resetTimer: () => void;
  setRestTimeMinutes: (minutes: number) => void;
}

type TimerStore = TimerState & TimerActions;

export const useTimerStore = create<TimerStore>((set, get) => ({
  // 초기 상태
  isStudying: false,
  studyTime: 0,
  isResting: false,
  startTime: null,
  restTimeMinutes: 5, // 기본 5분

  // 액션들
  startStudy: () => {
    const now = Date.now();
    set({
      isStudying: true,
      isResting: false,
      startTime: now,
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
      set({
        isStudying: false,
        isResting: true,
        studyTime: studyTime + elapsed,
        startTime: null,
        restTimeMinutes: restMinutes,
      });
    }
  },

  updateTime: (time: number) => {
    set({ studyTime: time });
  },

  resetTimer: () => {
    set({
      isStudying: false,
      studyTime: 0,
      isResting: false,
      startTime: null,
      restTimeMinutes: 5,
    });
  },

  setRestTimeMinutes: (minutes: number) => {
    set({ restTimeMinutes: minutes });
  },
}));
