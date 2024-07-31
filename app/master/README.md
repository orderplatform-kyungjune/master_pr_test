# 마스터 2

## 프로젝트 SPEC

![](https://img.shields.io/badge/node-v18.13.0(lts)-ffffff?style=for-the-badge&logo=Node.js)

![](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=ffffff)
![](https://img.shields.io/badge/PNPM-F69220?style=for-the-badge&logo=PNPM&logoColor=ffffff)

![](https://img.shields.io/badge/Vue3-4FC08D?style=for-the-badge&logo=Vue.js&logoColor=white)
![](https://img.shields.io/badge/TS-3178C6?style=for-the-badge&logo=TypeScript&logoColor=ffffff)
![](https://img.shields.io/badge/Pinia-646CFF?style=for-the-badge&logo=buffer)

![](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=TailwindCSS&logoColor=white)

![](https://img.shields.io/badge/cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white)
![](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=ESLint)

# 개요
태블릿으로 주문하는 서비스로 AOSP(Android Open Source Project) 로 개발된 태블릿에 동작하는 App 으로 업장에서
운영되고 있는 사항을 종합적으로 모니터링 하는 마스터 기능을 제공하는 앱이다. 해당앱은 gecko 79 버전으로 개발이 되었다.

## 개발환경
- [Firefox 79](https://ftp.mozilla.org/pub/firefox/releases/79.0/)
- [pnpm](https://pnpm.io/ko/)
- [TailwindCSS](https://tailwindcss.com/) 사용 
- [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import) & [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)를 사용한 vue core등, components autoImports 사용 
- [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages) & [vite-plugin-vue-layouts](https://github.com/JohnCampionJr/vite-plugin-vue-layouts)를 이용한 File Based Routing 도입.
- [vite-plugin-vue-inspector](https://github.com/webfansplz/vite-plugin-vue-inspector) 이용한 요소 디버깅 간편화
  - `Inspector`는 에디터 별 설정이 필요하기에 위 [링크](https://github.com/webfansplz/vite-plugin-vue-inspector) 내 가이드를 따라주시면 되겠습니다.

## 디버깅 방법
[다버깅 방법] (https://www.notion.so/torderkorea/43173d3db72245caab942e386d3a379e)

**테스트**

- Cypress E2E Test
  - UI의 첫단 부터 서버 응답의 끝단까지의 테스트를 통한 배포전 무결성 보장을 위해 도입.
  - 기본적으로 필수 동작 조건에 대한 E2E라도 존재한다면 QC등 프로젝트의 안전성에 많은 도움이 됨.
  - 신규 기능 -> 개발자 선에서 test code 작성 -> QC 테스트 -> QC에서 나온 예외 부분 추가 작성.
  - actions 통한 E2E 테스트 미통과시 PR 머지 불가 처리
  - Cypress 미통과시 슬랙으로 해당 실패 원인에 대한 녹화본 전송 됨.

<br/>

## 프로젝트 실행방법

### 1. Localhost Domain 추가(MAC Ver)

> 해당 프로젝트를 로컬에서 정상적으로 실행하기 위해선 localhost를 추가해야한다.

1-1. 터미널 실행 - `sudo vim /private/etc/hosts` 입력<br/>
1-2. 아래의 내용 추가

```
127.0.0.1    local.torder.io
```

1-3. `pnpm serve`하여 실행 시 아래와 같이 Local 환경이 변경된 내용으로 적용되면 된다. <br/>
![](https://user-images.githubusercontent.com/91718091/216925079-24ded263-4e22-4ebd-afbe-08778649007d.png)

### 2. scripts 실행 명령어
```
pnpm start
```
![](.cli/cli.gif)

### 2-1. 환경변수 플래그(`env.d.ts`)

- VITE_API_BASE_URL: env.MODE에 맞춰 개발, 스테이지, 운영으로 분기됨.

## 프로젝트 디렉토리 구조

> src <br/>
> ⎣&nbsp;**api** - rest api 및 주소 <br/>
> ⎣&nbsp;**assets** - image 파일 <br/>
> ⎣&nbsp;**common** - 공용 폴더 <br/>
> ⎣&nbsp;**composables** - Vue Mixins을 대체할 공용으로 쓰일 상태값을 정리 해둔 이펙터<br/>
> ⎣&nbsp;**interface** - Typescript 객체에 대한 타입 지정을 모아두고 있다.<br/>
> ⎣&nbsp;**router** - vue router 정보<br/>
> ⎣&nbsp;**store** - pinia store 관련 파일<br/>
> ⎣&nbsp;**styles** - css 모음<br/>
> ⎣&nbsp;**utils** - vue 컴포넌트 helper util<br/>
> ⎣&nbsp;**pages** - 파일 라우팅<br/>
> &nbsp;&nbsp;&nbsp;⎣&nbsp;**Common** - 공통 컴포넌트 및 레이아웃 --라우팅 처리 제외<br/>
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⎣&nbsp;**Layouts** - 레이아웃 폴더<br/>
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⎣&nbsp;**UI** - 공용 UI 컴포넌트<br/>
> &nbsp;&nbsp;&nbsp;⎣&nbsp;**[pages]** - 폴더명이 곧 라우팅<br/>
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⎣&nbsp;**index.vue** - 라우팅된 뷰파일<br/>
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⎣&nbsp;**Components** - 해당 페이지의 컴포넌트 폴더 --라우팅 처리 제외<br/>
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⎣&nbsp;**Containers** - 해당 페이지의 컨테이너 폴더 --라우팅 처리 제외<br/>

<br/>

## 프로젝트 커밋 컨벤션
- 기본적으로 [Conventional Commit 1.0](https://www.conventionalcommits.org/ko/v1.0.0/) 따르고 있음.
- feat : 새로운 기능 추가
- edit : 코드 수정
- fix : 버그 수정
- docs : 문서 수정
- style : Style 변경
- refactor : 코드 리펙토링
- test : 테스트 코드 추가 및 수정, 리펙토링 테스트 코드 추가
- chore : 빌드 업무 수정, 패키지 매니저 수정
