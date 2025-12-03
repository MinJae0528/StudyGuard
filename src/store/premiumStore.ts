import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface PremiumStore {
  isPremium: boolean;
  premiumExpiryDate: number | null; // 만료일 (timestamp)
  setPremium: (isPremium: boolean, expiryDate?: number) => void;
  checkPremiumStatus: () => boolean; // 만료일 체크 포함
}

export const usePremiumStore = create<PremiumStore>()(
  persist(
    (set, get) => ({
      isPremium: false,
      premiumExpiryDate: null,

      setPremium: (isPremium: boolean, expiryDate?: number) => {
        set({
          isPremium,
          premiumExpiryDate: expiryDate || null,
        });
      },

      checkPremiumStatus: () => {
        const { isPremium, premiumExpiryDate } = get();
        
        // 프리미엄이 아니면 false
        if (!isPremium) return false;

        // 만료일이 없으면 영구 프리미엄
        if (!premiumExpiryDate) return true;

        // 만료일 체크
        const now = Date.now();
        if (now > premiumExpiryDate) {
          // 만료됨
          set({ isPremium: false, premiumExpiryDate: null });
          return false;
        }

        return true;
      },
    }),
    {
      name: "premium-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);


