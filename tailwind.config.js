/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 메인 색상: 남색 (Navy Blue) - 신뢰감, 집중력
        "study-primary": "#001F3F",
        // 서브 색상: 더스티 블루 (Dusty Blue) - 차분함, 눈의 편안함
        "study-secondary": "#7A9E9F",
        // 액센트 색상: 밝은 더스티 블루
        "study-accent": "#A8C5C7",
        // 성공 색상: 부드러운 청록색
        "study-success": "#5F9EA0",
        // 경고 색상: 차분한 골드
        "study-warning": "#D4A574",
        // 위험 색상: 부드러운 코랄
        "study-danger": "#C87072",
        // 배경 색상: 매우 연한 블루그레이
        "study-bg": "#F5F7F8",
      },
    },
  },
  plugins: [],
};
