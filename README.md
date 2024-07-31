# Master2

## 프로젝트 개요
마스터2 프로젝트는 국내, 글로벌 마스터 서비스 및 다양한 소규모 프론트엔드 서비스의 효율적인 관리와 개발 생산성 향상을 목표로 합니다.

## eslint, prettier
subtree를 이용한 eslint-config를 extents 하여 공용 rules를 사용합니다.

eslint-config-torder subtree 레포: https://github.com/torderdev/torderservice-eslint-module-client

개별로 rule을 변경할 경우 서로 싱크가 맞지 않는 문제가 발생할 수 있으므로 개인적으로 룰을 변경하여 subtree에 push하는 것은 금지합니다.

## Workspace
-  [마스터2](https://github.com/torderdev/master-client-2.0/tree/master/app/master)

# 깃액션 배포 관련

## 1. Git Flow
- 개별 브랜치 -> develop -> main

## 2. CI/CD Rule
- github labels를 사용하여 선택적으로 CI/CD를 실행할 수 있다.

> #### 개별 브랜치 -> pull request -> develop 의 경우

|        라벨         |    실행 파일    |       결과        |
|:-----------------:|:-----------:|:---------------:|
|     `origin`      | develop.yml | 마스터2 국내 dev망 배포 |

> #### develop -> pull request -> stage 의 경우

|         라벨         |   실행 파일   |         결과         |
|:------------------:|:---------:|:------------------:|
| `origin`, `stage`  | stage.yml | 마스터2 국내 stage망 배포  |
| `us-east`, `stage` | stage.yml | 마스터2 캐나다 stage망 배포 |

> #### stage -> pull request -> main 의 경우

|        라벨         |  실행 파일   |       결과        |
|:-----------------:|:--------:|:---------------:|
| `origin`, `live`  | main.yml | 마스터2 국내 운영망 배포  |
| `us-east`, `live` | main.yml | 마스터2 캐나다 운영망 배포 |
