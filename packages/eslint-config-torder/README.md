# eslint-config-torder

## 필수 설치 라이브러리
> #### eslint의 plugins으로 사용되어 rules만 제공하므로 관련 라이브러리 모두 설치 필요
```
  {
    "eslint": "^8.56.0",
    "prettier": "^3.2.5",
    "vue-eslint-parser": "^9.4.2"
    "@typescript-eslint/eslint-plugin": "^6.17.0",
    "@vue/eslint-config-airbnb": "^8.0.0",
    "@vue/eslint-config-typescript": "^12.0.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-import": "^2.29.1",
    "eslint-plugin-jsx-a11y": "^6.8.0",
    "eslint-plugin-react": "^7.34.1",
    "eslint-plugin-vue": "^9.19.2",
    "eslint-plugin-vuejs-accessibility": "^2.2.1",
    "prettier-plugin-classnames": "^0.6.5",
    "prettier-plugin-tailwindcss": "^0.5.14",
  }
```
---

# webstorm 설정
```
    Editor > General > On Save > Remove trailling blank lines at the end of saved files => 체크 해제
    에디터 > 일반 > 저장 시 > 모든 저장된 파일이 줄 바꿈으로 끝나도록 함 => 체크 해제
```

# Git SubModule 사용 방법

원격 저장소 : https://github.com/torderdev/torderservice-eslint-module-client

### 1. SubModule 등록

```
    git submodule add <저장소 주소> <폴더명>
```
```
    git submodule add https://github.com/torderdev/torderservice-eslint-module-client packages/eslint-config-torder
```

### 2. SubModule 업데이트
```
    git submodule update --remote --merge
```