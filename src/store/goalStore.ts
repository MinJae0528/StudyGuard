import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Goal {
  id: string;
  type: "daily" | "weekly" | "monthly";
  targetTime: number; // 목표 시간 (초)
  createdAt: number; // 생성 시간
  isActive: boolean; // 활성화 여부
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
        const existingGoal = get().goals.find(
          (g) => g.type === "daily" && g.isActive
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
          // 새 목표 생성
          const newGoal: Goal = {
            id: `daily-${Date.now()}`,
            type: "daily",
            targetTime,
            createdAt: Date.now(),
            isActive: true,
          };
          set({ goals: [...get().goals, newGoal] });
        }
      },

      setWeeklyGoal: (targetTime: number) => {
        const existingGoal = get().goals.find(
          (g) => g.type === "weekly" && g.isActive
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
          const newGoal: Goal = {
            id: `weekly-${Date.now()}`,
            type: "weekly",
            targetTime,
            createdAt: Date.now(),
            isActive: true,
          };
          set({ goals: [...get().goals, newGoal] });
        }
      },

      setMonthlyGoal: (targetTime: number) => {
        const existingGoal = get().goals.find(
          (g) => g.type === "monthly" && g.isActive
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
          const newGoal: Goal = {
            id: `monthly-${Date.now()}`,
            type: "monthly",
            targetTime,
            createdAt: Date.now(),
            isActive: true,
          };
          set({ goals: [...get().goals, newGoal] });
        }
      },

      getActiveGoal: (type: "daily" | "weekly" | "monthly") => {
        return get().goals.find((g) => g.type === type && g.isActive) || null;
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
        if (!goal) {
          return { goal: null, progress: 0, achieved: false };
        }

        // 현재 주의 시작일 계산
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(now.setDate(diff));
        monday.setHours(0, 0, 0, 0);

        // 이번 주의 달성 기록들
        const weekAchievements = get().achievements.filter((a) => {
          if (a.goalId !== goal.id) return false;
          const achievementDate = new Date(a.date);
          return achievementDate >= monday;
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

