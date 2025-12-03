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
  isRestPostponed: boolean; // 휴식 알림에서 나중에를 눌렀는지 여부
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
  setRestPostponed: (postponed: boolean) => void;
  completeEnd: () => void; // 완전 종료 (학습과 휴식 모두 종료)
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
  isRestPostponed: false,

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
      isRestPostponed: false, // 공부 시작 시 나중에 상태 초기화
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
    const now = Date.now();
    
    if (startTime) {
      // 학습 중일 때 측정 종료
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      set({
        isStudying: false,
        isResting: true,
        studyTime: studyTime + elapsed,
        startTime: null,
        restTimeMinutes: restMinutes,
        restStartTime: now,
        isRestTimeOver: false,
        restRemainingTime: restMinutes * 60, // 설정된 시간(분)을 초로 변환
        isRestPostponed: false,
      });
    } else {
      // 이미 휴식 중일 때 추가 휴식 시간 설정
      set({
        restTimeMinutes: restMinutes,
        restStartTime: now,
        isRestTimeOver: false,
        restRemainingTime: restMinutes * 60,
        isRestPostponed: false,
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
      isRestPostponed: false,
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

  setRestPostponed: (postponed: boolean) => {
    set({ isRestPostponed: postponed });
  },

  completeEnd: () => {
    // 완전 종료: 학습과 휴식 모두 종료하고 타이머 초기화
    set({
      isStudying: false,
      isResting: false,
      studyTime: 0,
      startTime: null,
      restStartTime: null,
      restTimeMinutes: 1,
      isRestTimeOver: false,
      restRemainingTime: 0,
      isRestPostponed: false,
    });
  },
}));
