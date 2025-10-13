import { create } from "zustand";

export interface StudyRecord {
  id: string;
  subject: string; // 공부 내용
  duration: number; // 학습 시간 (초)
  date: string; // 날짜 (YYYY-MM-DD)
  timestamp: number; // 생성 시간
}

interface StudyRecordStore {
  records: StudyRecord[];
  addRecord: (subject: string, duration: number) => void;
  getTodayRecords: () => StudyRecord[];
  getTotalStudyTime: () => number;
  getTotalStudyTimeToday: () => number;
  clearAllRecords: () => void;
}

export const useStudyRecordStore = create<StudyRecordStore>((set, get) => ({
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

  clearAllRecords: () => {
    set({ records: [] });
  },
}));
