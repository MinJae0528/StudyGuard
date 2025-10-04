# 📚 StudyGuard

> 휴식 중독을 해결하고 학습 흐름을 유지하는 스마트 학습 관리 앱

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-0.79.6-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-53.0.22-000020?style=for-the-badge&logo=expo&logoColor=white)

</div>

## 🎯 프로젝트 소개

**StudyGuard**는 '휴식 중독' 문제를 해결하고 사용자의 학습 흐름을 유지하도록 돕는 React Native 기반 모바일 애플리케이션입니다.

### ✨ 주요 기능

- ⏱️ **스마트 타이머**: 실시간으로 학습 시간을 추적하고 관리
- 🛌 **맞춤형 휴식 관리**: 1~60분까지 사용자가 직접 설정 가능한 휴식 시간
- 🔔 **복귀 알림**: 설정한 휴식 시간이 지나면 자동으로 학습 복귀 알림 발송
- 📊 **학습 통계**: 누적 학습 시간과 학습 패턴 분석
- 🎨 **눈의 피로도 최소화**: 남색과 더스티 블루 조합의 차분한 색상 테마

## 🛠️ 기술 스택

### Core
- **React Native** 0.79.6 - 크로스 플랫폼 모바일 앱 개발
- **TypeScript** 5.8.3 - 타입 안정성
- **Expo Bare Workflow** - 네이티브 모듈 접근성

### 상태 관리 & UI
- **Zustand** 5.0.2 - 경량 상태 관리 라이브러리
- **NativeWind** 2.0.11 - Tailwind CSS for React Native
- **React Navigation** 7.x - 네비게이션 시스템
  - Native Stack Navigator
  - Bottom Tabs Navigator

### 알림
- **Expo Notifications** 0.29.9 - 푸시 알림 및 로컬 알림

## 🎨 디자인 시스템

### 색상 팔레트

| 색상 | HEX | 용도 |
|------|-----|------|
| **Primary (남색)** | `#001F3F` | 메인 버튼, 헤더 |
| **Secondary (더스티 블루)** | `#7A9E9F` | 서브 텍스트, 액센트 |
| **Accent** | `#A8C5C7` | 보조 버튼 |
| **Warning** | `#D4A574` | 일시정지 상태 |
| **Background** | `#F5F7F8` | 앱 배경 |

> 💡 장시간 학습에도 눈의 피로를 최소화하는 차분하고 고급스러운 조합

## 📱 화면 구성

### 1. 홈 (타이머)
- 실시간 스톱워치 (시:분:초 형식)
- 학습 시작/일시정지/재개 기능
- 휴식 시간 설정 (1~60분)
- 현재 상태 표시 (공부 중/휴식 중/대기 중)

### 2. 더보기
- 사용자 정보
- 앱 설정 (알림, 테마, 기본 휴식 시간)
- 학습 통계 및 기록
- 앱 정보

### 3. 내 정보
- 프로필 관리
- 학습 통계 대시보드
- 최근 활동 내역
- 학습 목표 설정

## 🚀 시작하기

### 사전 요구사항

- Node.js 18.x 이상
- npm 또는 yarn
- Expo CLI
- Android Studio (Android) 또는 Xcode (iOS)

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/MinJae0528/StudyGuard.git
cd StudyGuard

# 의존성 설치
npm install

# Expo 개발 서버 시작
npx expo start

# Android 실행
npm run android

# iOS 실행 (macOS only)
npm run ios
```

## 📂 프로젝트 구조

```
StudyGuard/
├── src/
│   ├── components/          # 재사용 가능한 UI 컴포넌트
│   │   ├── StudyTimer.tsx   # 메인 타이머 컴포넌트
│   │   └── RestTimeModal.tsx # 휴식 시간 설정 모달
│   ├── services/            # 외부 서비스 연동
│   │   └── NotificationService.ts # 알림 관리
│   └── store/               # 상태 관리
│       └── timerStore.ts    # 타이머 Zustand 스토어
├── screens/                 # 화면 컴포넌트
│   ├── Home/               # 홈 화면
│   ├── More/               # 더보기 화면
│   └── MyInfo/             # 내 정보 화면
├── stack/                   # 네비게이션 설정
│   ├── MainStack.tsx       # Stack Navigator
│   └── BottomTab.tsx       # Tab Navigator
├── tailwind.config.js      # Tailwind 설정
├── babel.config.js         # Babel 설정
└── tsconfig.json          # TypeScript 설정
```

## 🔧 주요 설정 파일

### NativeWind 설정
```javascript
// tailwind.config.js
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "study-primary": "#001F3F",
        "study-secondary": "#7A9E9F",
        // ... 추가 색상
      },
    },
  },
};
```

### Zustand 스토어 예시
```typescript
export const useTimerStore = create<TimerStore>((set) => ({
  isStudying: false,
  studyTime: 0,
  startStudy: () => set({ isStudying: true }),
  // ... 추가 액션
}));
```

## 📝 개발 노트

### TypeScript 타입 에러 해결
NativeWind의 `className` prop 타입 에러가 발생하면:
1. VS Code에서 `Ctrl + Shift + P`
2. "TypeScript: Restart TS Server" 실행

### 한글 커밋 메시지
```bash
# Windows에서 한글 깨짐 방지
chcp 65001
git commit -m "한글 커밋 메시지"
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

This project is licensed under the MIT License.

## 👨‍💻 개발자

**MinJae**
- GitHub: [@MinJae0528](https://github.com/MinJae0528)

## 🙏 감사의 말

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [NativeWind](https://www.nativewind.dev/)
- [Zustand](https://zustand-demo.pmnd.rs/)

---

<div align="center">

**Made with ❤️ for better study habits**

</div>

