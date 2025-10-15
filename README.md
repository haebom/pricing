# Pricing Lab

웹에서 실행되는 가격 연구 실험실입니다. Van Westendorp (PSM), Gabor–Granger, Conjoint 분석을 하나의 앱에서 입력·시각화·시나리오·권장가 산출까지 제공합니다.

## 주요 기능
- PSM, Gabor–Granger, Conjoint 분석 페이지 제공
- 예시 데이터 적용 및 분석 흐름(예시 페이지 → 스토어 주입 → 각 분석 페이지)
- 다중 축 차트(Recharts)와 권장가/참조선 표시
- 정적 빌드/배포(Static Export) 지원

## 기술 스택
- Next.js 15 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Recharts

## 빠르게 시작하기
1. 의존성 설치: `npm install`
2. 개발 서버 실행: `npm run dev`
3. 브라우저에서 열기: `http://localhost:3000/`

### 빌드/정적 내보내기
- 빌드: `npm run build`

Next.js 15에서는 `next export`가 제거되었습니다. `next.config.ts`에서 `output: 'export'`를 설정하면 `npm run build`만으로 정적 산출물(`out/`)이 생성되며 GitHub Pages 등 정적 호스팅에 바로 배포할 수 있습니다.

## 환경 변수
- `NEXT_PUBLIC_INDEX`: 검색 엔진 인덱싱 허용 여부(`true`/`false`)
- `GITHUB_PAGES`: GitHub Pages 배포 여부(`true`/`false`)
- `NEXT_PUBLIC_BASE_PATH`: 베이스 경로(예: `/pricing-lab`)

## 메타데이터/파비콘/이미지
- 파비콘: `app/icon.png` (프로젝트의 `logo.png`를 복사하여 사용)
- 애플 아이콘: `app/apple-icon.png`
- Open Graph 이미지: `app/opengraph-image.png`
- Twitter 카드 이미지: `app/twitter-image.png`
- 메타데이터 정의: `app/layout.tsx`

본 프로젝트는 `/Users/haebom/Trae Project/pricing/logo.png`를 파비콘 및 메타 이미지로 사용합니다. 내부적으로 다음 파일로 복사되어 앱에서 자동으로 참조됩니다.

## 예시 데이터와 페이지
- 예시 정의: `lib/examples.ts`
  - `sourceUrl` 필드를 통해 공식 요금제 페이지 링크를 노출합니다.
- 예시 적용/주입: `app/examples/[id]/ExampleApplyClient.tsx`
- 예시 라우트: `app/examples/[id]/page.tsx`

미리 준비된 예시 페이지:
- Notion: `/examples/notion`
- Figma: `/examples/figma`
- Datadog: `/examples/datadog`

## 분석 모듈
- PSM 계산: `lib/psm.ts`
- Gabor–Granger 계산: `lib/gabor.ts`
- Conjoint 계산: `lib/conjoint.ts`

## 차트 관련 참고
- 다중 Y축을 사용하는 페이지(`Gabor`)에서는 `ReferenceLine` 등 축 의존 컴포넌트에 `yAxisId`를 명시적으로 지정합니다.

## 배포
빌드 결과(`out/`)를 GitHub Pages 등으로 배포할 수 있습니다. `next.config.ts`의 `basePath`/`assetPrefix`를 환경 변수로 설정해 리소스 경로를 맞춰주세요. 워크플로에서는 `npm run build`만 실행하면 됩니다.

## 라이선스
학습 및 데모 목적의 예시 프로젝트입니다. 외부 서비스의 가격 데이터는 실제와 다를 수 있으며, 예시 데이터는 사용자 시나리오에 맞게 조정하세요.