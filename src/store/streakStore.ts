import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 로컬 시간 기준 날짜 문자열 생성 (UTC 변환 방지)
const getLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
};

interface StreakData {
  currentStreak: number; // 현재 연속 학습일
  longestStreak: number; // 최장 연속 학습일
  lastStudyDate: string | null; // 마지막 학습일 (YYYY-MM-DD)
  streakHistory: { date: string; studied: boolean }[]; // 최근 30일 기록
  minimumStudyTime: number; // 스트릭 인정 최소 학습 시간 (초, 기본 10분)
}

interface StreakStore extends StreakData {
  // 스트릭 업데이트
  updateStreak: (studyTime: number) => void;
  
  // 스트릭 끊김 확인 (앱 시작 시 또는 화면 표시 시 호출)
  checkStreakBreak: () => void;
  
  // 스트릭 정보 조회
  getStreakInfo: () => {
    currentStreak: number;
    longestStreak: number;
    isStreakActive: boolean; // 오늘 학습했는지
    daysUntilNextMilestone: number; // 다음 마일스톤까지 남은 일수
  };
  
  // 스트릭 리셋 (테스트용)
  resetStreak: () => void;
  
  // 최소 학습 시간 설정
  setMinimumStudyTime: (minutes: number) => void;
}

export const useStreakStore = create<StreakStore>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: null,
      streakHistory: [],
      minimumStudyTime: 60, // 기본 1분 (60초) - 테스트를 위해 낮춤

      updateStreak: (studyTime: number) => {
        const { minimumStudyTime, currentStreak, longestStreak, lastStudyDate, streakHistory } = get();
        
        console.log(`[Streak] updateStreak 호출: studyTime=${studyTime}초, minimumStudyTime=${minimumStudyTime}초`);
        
        // 최소 학습 시간 미달이면 스트릭 인정 안 함
        if (studyTime < minimumStudyTime) {
          console.log(`[Streak] 최소 학습 시간 미달: ${studyTime}초 < ${minimumStudyTime}초`);
          return;
        }

        const today = getLocalDateString(new Date());
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        
        // 오늘 이미 학습했는지 확인
        const todayRecord = streakHistory.find((h) => h.date === today);
        if (todayRecord?.studied) {
          return; // 이미 오늘 학습 기록이 있음
        }

        // 오늘 학습 기록 추가
        const newHistory = [
          ...streakHistory.filter((h) => h.date !== today),
          { date: today, studied: true },
        ]
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 30); // 최근 30일만 유지

        let newCurrentStreak = currentStreak;
        let newLongestStreak = longestStreak;

        if (lastStudyDate) {
          // YYYY-MM-DD 문자열을 로컬 시간 기준으로 파싱
          const [year, month, day] = lastStudyDate.split("-").map(Number);
          const lastDate = new Date(year, month - 1, day);
          lastDate.setHours(0, 0, 0, 0);
          const daysDiff = Math.floor(
            (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          console.log(`[Streak] 날짜 차이: ${daysDiff}일, lastStudyDate=${lastStudyDate}, today=${today}`);

          if (daysDiff === 1) {
            // 연속 학습일 증가
            newCurrentStreak = currentStreak + 1;
            console.log(`[Streak] 연속 학습일 증가: ${currentStreak}일 → ${newCurrentStreak}일`);
          } else if (daysDiff === 0) {
            // 같은 날이면 스트릭 유지
            newCurrentStreak = currentStreak;
            console.log(`[Streak] 같은 날 학습: 스트릭 유지 ${newCurrentStreak}일`);
          } else {
            // 스트릭 끊김
            newCurrentStreak = 1;
            console.log(`[Streak] 스트릭 끊김: 새로 시작 ${newCurrentStreak}일`);
          }
        } else {
          // 첫 학습
          newCurrentStreak = 1;
          console.log(`[Streak] 첫 학습: ${newCurrentStreak}일 시작`);
        }

        // 최장 스트릭 업데이트
        if (newCurrentStreak > longestStreak) {
          newLongestStreak = newCurrentStreak;
          console.log(`[Streak] 최장 스트릭 업데이트: ${longestStreak}일 → ${newLongestStreak}일`);
        }

        set({
          currentStreak: newCurrentStreak,
          longestStreak: newLongestStreak,
          lastStudyDate: today,
          streakHistory: newHistory,
        });
        
        console.log(`[Streak] 업데이트 완료: currentStreak=${newCurrentStreak}일, longestStreak=${newLongestStreak}일`);
      },

      checkStreakBreak: () => {
        const { lastStudyDate, currentStreak, streakHistory } = get();
        
        if (!lastStudyDate) {
          // 학습 기록이 없으면 체크할 필요 없음
          return;
        }

        const today = getLocalDateString(new Date());
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        // YYYY-MM-DD 문자열을 로컬 시간 기준으로 파싱
        const [year, month, day] = lastStudyDate.split("-").map(Number);
        const lastDate = new Date(year, month - 1, day);
        lastDate.setHours(0, 0, 0, 0);
        const daysDiff = Math.floor(
          (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        console.log(`[Streak] checkStreakBreak: daysDiff=${daysDiff}일, lastStudyDate=${lastStudyDate}, today=${today}`);

        // 2일 이상 지났으면 무조건 스트릭 끊김
        if (daysDiff >= 2) {
          console.log(`[Streak] 스트릭 끊김 감지: ${daysDiff}일 경과, 스트릭 리셋`);
          set({
            currentStreak: 0,
            lastStudyDate: null,
          });
          return;
        }

        // daysDiff === 1인 경우 (어제 학습, 오늘 아직 학습 안 함)
        // 이 경우는 스트릭을 유지해야 함 (오늘 하루 종일 기회가 있음)
        // 다음날(내일)이 되면 daysDiff === 2가 되어 스트릭이 리셋됨
        
        // daysDiff === 0인 경우 (오늘 학습함)는 스트릭 유지
        // 아무것도 하지 않음
      },

      getStreakInfo: () => {
        const { currentStreak, longestStreak, lastStudyDate, streakHistory } = get();
        const today = getLocalDateString(new Date());
        
        const isStreakActive = streakHistory.some((h) => h.date === today && h.studied);
        
        // 다음 마일스톤 계산 (10일, 30일, 50일, 100일 등)
        const milestones = [10, 30, 50, 100, 200, 365];
        const nextMilestone = milestones.find((m) => m > currentStreak) || 0;
        const daysUntilNextMilestone = nextMilestone > 0 ? nextMilestone - currentStreak : 0;

        return {
          currentStreak,
          longestStreak,
          isStreakActive,
          daysUntilNextMilestone,
        };
      },

      resetStreak: () => {
        set({
          currentStreak: 0,
          longestStreak: 0,
          lastStudyDate: null,
          streakHistory: [],
        });
      },

      setMinimumStudyTime: (minutes: number) => {
        set({ minimumStudyTime: minutes * 60 }); // 분을 초로 변환
      },
    }),
    {
      name: "streak-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

