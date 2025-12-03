import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Goal {
  id: string;
  type: "daily" | "weekly" | "monthly";
  targetTime: number; // 목표 시간 (초)
  createdAt: number; // 생성 시간
  isActive: boolean; // 활성화 여부
  date?: string; // 일별 목표: YYYY-MM-DD
  weekStart?: string; // 주간 목표: 주의 시작일 YYYY-MM-DD (일요일)
  month?: string; // 월간 목표: YYYY-MM
}

export interface GoalAchievement {
  goalId: string;
  date: string; // YYYY-MM-DD
  achieved: boolean;
  actualTime: number; // 실제 학습 시간 (초)
  achievementRate: number; // 달성률 (0-100)
}

interface GoalStore {
  goals: Goal[];
  achievements: GoalAchievement[];
  
  // 목표 설정
      setDailyGoal: (targetTime: number) => void;
      setWeeklyGoal: (targetTime: number) => void;
      setMonthlyGoal: (targetTime: number) => void;
      getActiveGoal: (type: "daily" | "weekly" | "monthly") => Goal | null;
      checkAndResetGoals: () => void; // 날짜/주/월 변경 시 목표 리셋 체크
  
  // 목표 달성 체크
  checkGoalAchievement: (type: "daily" | "weekly" | "monthly", actualTime: number) => void;
  getTodayGoalProgress: () => { goal: Goal | null; progress: number; achieved: boolean };
  getWeeklyGoalProgress: () => { goal: Goal | null; progress: number; achieved: boolean };
  getMonthlyGoalProgress: () => { goal: Goal | null; progress: number; achieved: boolean };
  
  // 목표 달성 히스토리
  getAchievementHistory: (type: "daily" | "weekly" | "monthly", limit?: number) => GoalAchievement[];
  getAchievementRate: (type: "daily" | "weekly" | "monthly", days?: number) => number;
}

export const useGoalStore = create<GoalStore>()(
  persist(
    (set, get) => ({
      goals: [],
      achievements: [],

      setDailyGoal: (targetTime: number) => {
        const today = new Date().toISOString().split("T")[0];
        
        // 오늘 날짜의 목표 찾기
        const existingGoal = get().goals.find(
          (g) => g.type === "daily" && g.date === today && g.isActive
        );
        
        if (existingGoal) {
          // 기존 목표 업데이트
          set({
            goals: get().goals.map((g) =>
              g.id === existingGoal.id
                ? { ...g, targetTime, createdAt: Date.now() }
                : g
            ),
          });
        } else {
          // 기존 일별 목표 비활성화
          const updatedGoals = get().goals.map((g) =>
            g.type === "daily" && g.isActive
              ? { ...g, isActive: false }
              : g
          );
          
          // 새 목표 생성
          const newGoal: Goal = {
            id: `daily-${Date.now()}`,
            type: "daily",
            targetTime,
            createdAt: Date.now(),
            isActive: true,
            date: today,
          };
          set({ goals: [...updatedGoals, newGoal] });
        }
      },

      setWeeklyGoal: (targetTime: number) => {
        // 현재 주의 시작일 계산 (일요일 기준)
        const now = new Date();
        const dayOfWeek = now.getDay();
        const daysToSunday = -dayOfWeek;
        const sunday = new Date(now);
        sunday.setDate(now.getDate() + daysToSunday);
        sunday.setHours(0, 0, 0, 0);
        const weekStart = sunday.toISOString().split("T")[0];
        
        // 이번 주의 목표 찾기
        const existingGoal = get().goals.find(
          (g) => g.type === "weekly" && g.weekStart === weekStart && g.isActive
        );
        
        if (existingGoal) {
          set({
            goals: get().goals.map((g) =>
              g.id === existingGoal.id
                ? { ...g, targetTime, createdAt: Date.now() }
                : g
            ),
          });
        } else {
          // 기존 주간 목표 비활성화
          const updatedGoals = get().goals.map((g) =>
            g.type === "weekly" && g.isActive
              ? { ...g, isActive: false }
              : g
          );
          
          const newGoal: Goal = {
            id: `weekly-${Date.now()}`,
            type: "weekly",
            targetTime,
            createdAt: Date.now(),
            isActive: true,
            weekStart: weekStart,
          };
          set({ goals: [...updatedGoals, newGoal] });
        }
      },

      setMonthlyGoal: (targetTime: number) => {
        // 현재 월 계산
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const monthStr = `${year}-${(month + 1).toString().padStart(2, "0")}`;
        
        // 이번 달의 목표 찾기
        const existingGoal = get().goals.find(
          (g) => g.type === "monthly" && g.month === monthStr && g.isActive
        );
        
        if (existingGoal) {
          set({
            goals: get().goals.map((g) =>
              g.id === existingGoal.id
                ? { ...g, targetTime, createdAt: Date.now() }
                : g
            ),
          });
        } else {
          // 기존 월간 목표 비활성화
          const updatedGoals = get().goals.map((g) =>
            g.type === "monthly" && g.isActive
              ? { ...g, isActive: false }
              : g
          );
          
          const newGoal: Goal = {
            id: `monthly-${Date.now()}`,
            type: "monthly",
            targetTime,
            createdAt: Date.now(),
            isActive: true,
            month: monthStr,
          };
          set({ goals: [...updatedGoals, newGoal] });
        }
      },

      getActiveGoal: (type: "daily" | "weekly" | "monthly") => {
        const now = new Date();
        
        if (type === "daily") {
          const today = now.toISOString().split("T")[0];
          return get().goals.find((g) => g.type === type && g.date === today && g.isActive) || null;
        } else if (type === "weekly") {
          // 현재 주의 시작일 계산 (일요일 기준)
          const dayOfWeek = now.getDay();
          const daysToSunday = -dayOfWeek;
          const sunday = new Date(now);
          sunday.setDate(now.getDate() + daysToSunday);
          sunday.setHours(0, 0, 0, 0);
          const weekStart = sunday.toISOString().split("T")[0];
          return get().goals.find((g) => g.type === type && g.weekStart === weekStart && g.isActive) || null;
        } else {
          // 월간 목표
          const year = now.getFullYear();
          const month = now.getMonth();
          const monthStr = `${year}-${(month + 1).toString().padStart(2, "0")}`;
          return get().goals.find((g) => g.type === type && g.month === monthStr && g.isActive) || null;
        }
      },
      
      checkAndResetGoals: () => {
        // 목표가 자동으로 날짜/주/월별로 관리되므로 별도 리셋 로직 불필요
        // getActiveGoal에서 현재 날짜/주/월에 맞는 목표만 반환하므로 자동으로 필터링됨
      },

      checkGoalAchievement: (type: "daily" | "weekly" | "monthly", actualTime: number) => {
        const goal = get().getActiveGoal(type);
        if (!goal) return;

        const today = new Date().toISOString().split("T")[0];
        const achievementRate = goal.targetTime > 0 
          ? Math.min((actualTime / goal.targetTime) * 100, 100) 
          : 0;
        const achieved = actualTime >= goal.targetTime;

        // 오늘의 달성 기록이 이미 있는지 확인
        const existingAchievement = get().achievements.find(
          (a) => a.goalId === goal.id && a.date === today
        );

        if (existingAchievement) {
          // 업데이트
          set({
            achievements: get().achievements.map((a) =>
              a.goalId === goal.id && a.date === today
                ? {
                    ...a,
                    actualTime,
                    achieved,
                    achievementRate,
                  }
                : a
            ),
          });
        } else {
          // 새로 생성
          const newAchievement: GoalAchievement = {
            goalId: goal.id,
            date: today,
            achieved,
            actualTime,
            achievementRate,
          };
          set({ achievements: [...get().achievements, newAchievement] });
        }
      },

      getTodayGoalProgress: () => {
        const goal = get().getActiveGoal("daily");
        if (!goal) {
          return { goal: null, progress: 0, achieved: false };
        }

        const today = new Date().toISOString().split("T")[0];
        const achievement = get().achievements.find(
          (a) => a.goalId === goal.id && a.date === today
        );

        if (achievement) {
          return {
            goal,
            progress: achievement.achievementRate,
            achieved: achievement.achieved,
          };
        }

        return { goal, progress: 0, achieved: false };
      },

      getWeeklyGoalProgress: () => {
        const goal = get().getActiveGoal("weekly");
        if (!goal || !goal.weekStart) {
          return { goal: null, progress: 0, achieved: false };
        }

        // 주의 시작일과 종료일 계산 (일요일 기준)
        const weekStart = new Date(goal.weekStart);
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        // 이번 주의 달성 기록들
        const weekAchievements = get().achievements.filter((a) => {
          if (a.goalId !== goal.id) return false;
          const achievementDate = new Date(a.date);
          return achievementDate >= weekStart && achievementDate <= weekEnd;
        });

        const totalTime = weekAchievements.reduce((sum, a) => sum + a.actualTime, 0);
        const progress = goal.targetTime > 0 
          ? Math.min((totalTime / goal.targetTime) * 100, 100) 
          : 0;
        const achieved = totalTime >= goal.targetTime;

        return { goal, progress, achieved };
      },

      getMonthlyGoalProgress: () => {
        const goal = get().getActiveGoal("monthly");
        if (!goal) {
          return { goal: null, progress: 0, achieved: false };
        }

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const monthStr = `${year}-${(month + 1).toString().padStart(2, "0")}`;

        // 이번 달의 달성 기록들
        const monthAchievements = get().achievements.filter((a) => {
          if (a.goalId !== goal.id) return false;
          return a.date.startsWith(monthStr);
        });

        const totalTime = monthAchievements.reduce((sum, a) => sum + a.actualTime, 0);
        const progress = goal.targetTime > 0 
          ? Math.min((totalTime / goal.targetTime) * 100, 100) 
          : 0;
        const achieved = totalTime >= goal.targetTime;

        return { goal, progress, achieved };
      },

      getAchievementHistory: (type: "daily" | "weekly" | "monthly", limit = 30) => {
        const goal = get().goals.find((g) => g.type === type && g.isActive);
        if (!goal) return [];

        return get()
          .achievements.filter((a) => a.goalId === goal.id)
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, limit);
      },

      getAchievementRate: (type: "daily" | "weekly" | "monthly", days = 30) => {
        const history = get().getAchievementHistory(type, days);
        if (history.length === 0) return 0;

        const achievedCount = history.filter((a) => a.achieved).length;
        return (achievedCount / history.length) * 100;
      },
    }),
    {
      name: "goal-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

