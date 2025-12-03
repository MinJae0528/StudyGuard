import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface StudyRecord {
  id: string;
  subject: string; // 공부 내용
  duration: number; // 학습 시간 (초)
  date: string; // 날짜 (YYYY-MM-DD)
  timestamp: number; // 생성 시간
}

export interface WeeklyStats {
  week: string; // "2024-W01" 형식
  totalTime: number; // 총 학습 시간 (초)
  recordCount: number; // 학습 기록 수
  averageTime: number; // 평균 학습 시간 (초)
  days: { [date: string]: number }; // 일별 학습 시간
}

export interface MonthlyStats {
  month: string; // "2024-01" 형식
  totalTime: number; // 총 학습 시간 (초)
  recordCount: number; // 학습 기록 수
  averageTime: number; // 평균 학습 시간 (초)
  days: { [date: string]: number }; // 일별 학습 시간
}

interface StudyRecordStore {
  records: StudyRecord[];
  addRecord: (subject: string, duration: number) => void;
  getTodayRecords: () => StudyRecord[];
  getTotalStudyTime: () => number;
  getTotalStudyTimeToday: () => number;
  // 주간 통계
  getWeeklyStats: (weekOffset?: number) => WeeklyStats;
  getWeeklyStatsByDate: (date: Date) => WeeklyStats;
  // 월간 통계
  getMonthlyStats: (monthOffset?: number) => MonthlyStats;
  getMonthlyStatsByDate: (date: Date) => MonthlyStats;
  // 기간별 통계
  getStatsByDateRange: (startDate: Date, endDate: Date) => {
    totalTime: number;
    recordCount: number;
    averageTime: number;
    days: { [date: string]: number };
  };
  clearAllRecords: () => void;
}

export const useStudyRecordStore = create<StudyRecordStore>()(
  persist(
    (set, get) => ({
      records: [],

      addRecord: (subject: string, duration: number) => {
        const now = new Date();
        const record: StudyRecord = {
          id: Date.now().toString(),
          subject,
          duration,
          date: now.toISOString().split("T")[0], // YYYY-MM-DD
          timestamp: now.getTime(),
        };

        set((state) => ({
          records: [record, ...state.records],
        }));
      },

      getTodayRecords: () => {
        const today = new Date().toISOString().split("T")[0];
        return get().records.filter((record) => record.date === today);
      },

      getTotalStudyTime: () => {
        return get().records.reduce((total, record) => total + record.duration, 0);
      },

      getTotalStudyTimeToday: () => {
        const todayRecords = get().getTodayRecords();
        return todayRecords.reduce((total, record) => total + record.duration, 0);
      },

      // 주간 통계 계산 (현재 주 기준, weekOffset으로 이전/다음 주 선택)
      getWeeklyStats: (weekOffset = 0) => {
        const now = new Date();
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() + weekOffset * 7);
        return get().getWeeklyStatsByDate(targetDate);
      },

      getWeeklyStatsByDate: (date: Date) => {
        // 주의 시작일 (월요일) 계산
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 월요일로 조정
        const monday = new Date(d.setDate(diff));
        monday.setHours(0, 0, 0, 0);

        // 주의 종료일 (일요일) 계산
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);

        // 주 번호 계산 (ISO 8601 기준)
        const year = monday.getFullYear();
        const weekNumber = getWeekNumber(monday);
        const week = `${year}-W${weekNumber.toString().padStart(2, "0")}`;

        // 해당 주의 기록 필터링
        const weekRecords = get().records.filter((record) => {
          const recordDate = new Date(record.timestamp);
          return recordDate >= monday && recordDate <= sunday;
        });

        // 일별 학습 시간 계산
        const days: { [date: string]: number } = {};
        for (let i = 0; i < 7; i++) {
          const dayDate = new Date(monday);
          dayDate.setDate(monday.getDate() + i);
          const dateStr = dayDate.toISOString().split("T")[0];
          days[dateStr] = 0;
        }

        weekRecords.forEach((record) => {
          if (days[record.date] !== undefined) {
            days[record.date] += record.duration;
          }
        });

        const totalTime = weekRecords.reduce((sum, record) => sum + record.duration, 0);
        const recordCount = weekRecords.length;
        const averageTime = recordCount > 0 ? Math.floor(totalTime / recordCount) : 0;

        return {
          week,
          totalTime,
          recordCount,
          averageTime,
          days,
        };
      },

      // 월간 통계 계산 (현재 월 기준, monthOffset으로 이전/다음 월 선택)
      getMonthlyStats: (monthOffset = 0) => {
        const now = new Date();
        const targetDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
        return get().getMonthlyStatsByDate(targetDate);
      },

      getMonthlyStatsByDate: (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const monthStr = `${year}-${(month + 1).toString().padStart(2, "0")}`;

        // 월의 시작일과 종료일
        const startDate = new Date(year, month, 1);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(year, month + 1, 0);
        endDate.setHours(23, 59, 59, 999);

        // 해당 월의 기록 필터링
        const monthRecords = get().records.filter((record) => {
          const recordDate = new Date(record.timestamp);
          return recordDate >= startDate && recordDate <= endDate;
        });

        // 일별 학습 시간 계산
        const days: { [date: string]: number } = {};
        const daysInMonth = endDate.getDate();
        for (let i = 1; i <= daysInMonth; i++) {
          const dayDate = new Date(year, month, i);
          const dateStr = dayDate.toISOString().split("T")[0];
          days[dateStr] = 0;
        }

        monthRecords.forEach((record) => {
          if (days[record.date] !== undefined) {
            days[record.date] += record.duration;
          }
        });

        const totalTime = monthRecords.reduce((sum, record) => sum + record.duration, 0);
        const recordCount = monthRecords.length;
        const averageTime = recordCount > 0 ? Math.floor(totalTime / recordCount) : 0;

        return {
          month: monthStr,
          totalTime,
          recordCount,
          averageTime,
          days,
        };
      },

      // 기간별 통계
      getStatsByDateRange: (startDate: Date, endDate: Date) => {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const rangeRecords = get().records.filter((record) => {
          const recordDate = new Date(record.timestamp);
          return recordDate >= start && recordDate <= end;
        });

        // 일별 학습 시간 계산
        const days: { [date: string]: number } = {};
        const currentDate = new Date(start);
        while (currentDate <= end) {
          const dateStr = currentDate.toISOString().split("T")[0];
          days[dateStr] = 0;
          currentDate.setDate(currentDate.getDate() + 1);
        }

        rangeRecords.forEach((record) => {
          if (days[record.date] !== undefined) {
            days[record.date] += record.duration;
          }
        });

        const totalTime = rangeRecords.reduce((sum, record) => sum + record.duration, 0);
        const recordCount = rangeRecords.length;
        const averageTime = recordCount > 0 ? Math.floor(totalTime / recordCount) : 0;

        return {
          totalTime,
          recordCount,
          averageTime,
          days,
        };
      },

      clearAllRecords: () => {
        set({ records: [] });
      },
    }),
    {
      name: "study-records-storage", // AsyncStorage에 저장될 키 이름
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// ISO 8601 주 번호 계산 함수
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
