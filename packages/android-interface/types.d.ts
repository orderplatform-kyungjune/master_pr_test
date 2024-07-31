/**
 * ## android bridge interface error code define
 *
 * | code | description | 사용여부 | message |
 * | --- | --- | --- | --- |
 * | 0000 | 정상 |  |  |
 * | U100 | 할부이자 입력되는 숫자 타입이 아닐 경우 오류 | X | 할부 개월 데이터 오류(입력되지 않았거나 숫자 이외의 문자가 입력됨). 숫자만 가능 합니다 |
 * | U200 | 결제금액 입력되는 숫자 타입이 아닐 경우 오류 | X | 결제 금액 오류. 숫자만 가능 합니다 |
 * | U300 | 결제기의 ID 누락 | X | 디바이스 ID(TID)가 입력되지 않았습니다 |
 * | U310 | 상점 번호 누락 | X | 상점 코드가 입력되지 않았습니다. |
 * | U320 | 테이블 번호 누락 | X | 테이블 번호가 입력되지 않았습니다. |
 * | U330 | VAN사 누락 | X | 결제 회사(VAN)가 입력되지 않았습니다. |
 * | U340 | 결제사 결제ID 누락 | X | 결제요청ID가 입력되지 않았습니다 |
 * | U350 | JTNET VAN사 가 아닐 경우 | X | 현금영수증 승인/취소 밴사(KSNET, JTNET) 정보가 없습니다 |
 * | U500 | - | X | 케이에스체크 IC 에서 가맹점 다운로드 후 사용하시기 바랍니다 |
 * | U510 | - | X | 사용자가 결제를 취소 하였습니다.(앱 호출 실패) |
 * | U520 | - | X | 신용카드 결제 실패. 응답값 리턴 실패 |
 * | U530 | - | X | 신용카드 결제 또는 취소 오류 |
 * | U560 | SMARTO 결제는 사업자번호가 있어야 하는데 누락됨 | X | 사업자번호가 서버에서 로딩되지 않았습니다. 1분 뒤에 다시 시도해 주세요. |
 * | U591 | - | X | (리더기 연결 오류. 테블릿을 재시작 해주세요) |
 * | U592 | - | X | (20초 후에 카드결제를 다시 진행해 주세요) |
 * | U593 | - | X | 결제중 카드사 타임아웃(기타오류)이 발생하여 망 취소(결제취소)가 진행 되었습니다. 다시 결제를 진행해 주십시오. |
 * | U570 | 결제사의 모듈(앱)이 설치되지 않음. | X | {결제사} 신용카드 결제 데몬이 설치 되지 않았습니다 |
 * | U640 | 영수증 프린터 테스터 핑이 시간 초가 될 때(1초 2번시도) | X | 프린터의 와이파이 연결 상태를 확인해 주세요(프린터 재부팅이 필요할 수 있습니다). 다시 진행 또는 직원을 호출해 주세요. |
 * | U641 | 영수증 프린터 IP 가 없는 경우 | X | 영수증 프린터 연결 실패 |
 * | U642 | 영수증 프린터 IP 가 없는 경우 | X | 영수증 프린터의 IP 주소가 설정되지 않았습니다. |
 * | U643 | 영수증 프린터 테스터 핑이 시간 초가 될 때(1초 2번시도) | X | 영수증 프린터 연결 실패 |
 * | U644 | 영수증 프린터 테스터 핑이 시간 초가 될 때(1초 2번시도) | X | 프린터의 와이파이 연결 확인 및 프린터를 재부팅 해주세요. 직원을 호출해 주세요. |
 * | U645 | 직전 영수증 정보가 없는 상태 | X | 이전 주문 정보 |
 * | U646 | 직전 영수증 정보가 없는 상태 | X | 이전 주문 정보가 없습니다. |
 * | U999 | 에러 |  |  |
 */

/**
 * app 에서 파일을 다운로드 받는 {@Link Window.UUID.syncFiles} 앱 통신 브릿지 인터페이스의 파라메터 인터페이스
 */
export interface AppBridgeSyncFileResource {
  syncFiles: [{
    path: string, // 파일명을 제외한 로컬 저장소 폴더 경로
    files: [{
      url: string, // 서버에 있는 리소스 url  ex) 'http://i.torder.com/audio/greeting_구로통닭.mp3'
      fileName: string, // 파일명 'greeting_구로통닭.mp3'
      fileSize: BigInt, // byte
      option: { // 파일의 메타 정보
        force: boolean, // 동일한 파일(사이즈) 이여도 강제로 다시 다운로드 받을지 여부, default : false
      },
    }], // syncFiles.files end
  }], // syncFiles end
}

export interface NativeBridgeInterface {
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.1 | 최초 생성 |
   *
   * 안드로이드 내부 저장소에 JSON 형태로 정보를 저장되며 path 는 안드로이드가 지정한 하위에 형성된다. `내부저장소/Download` 폴더 밑에 저장 되나 안드로이드 정책에 의해 변경 될 수 있다.
   *
   * > 하위 json 파일은 앱에서 참고하고 있으며 데이터 저장 형식 변경 및 추가는 앱개발자와 상의 해야 한다.
   * - /torder/json/store.json
   * ```ts
   * {
   *    err: string|undefined,  // option, 에러 메시지??
   *    code: string,  // 매장 코드
   * }
   * ```
   * - /torder/json/config.json
   * ```ts
   * // web url 이 orderview, master 가 포함되어 있는 경우
   * {
   *    vanInfo: string,  // VAN 사 정보: 'KSNET', 'KISVAN', 'SMARTRO', 'JTNET'
   *    T_order_store_code: string,  // store code
   *    T_order_store_name: string,  // store name
   *    saupNumber: string,  // 사업자 번호(ex: 123-45-6789012)
   *    storeVanTid: string,  // TID(VAN 사 transaction id)
   *    storeSerialNumber: string,  // 결제 리더기 고유번호 ???
   *    preCreditTableUse: string,  // 선결제 매장일 경우 선결제 데몬 초기화('1': 초기화, other: none)
   * }
   *
   * // web url 이 'orderview', 'master' 가 포함되지 않는 경우
   * {
   *    goods: string,  // 상품정보
   *    init: {
   *        T_order_store_code: string,  // 매장 코드
   *        T_order_store_name: string,  // Torder 가 바라 보는 매장 이름
   *        storeCpName: string,  // CP(Content Provider) name - PG 사가 고객사에게 할당한 이름
   *        storeTel: string,  // 매장 전화번호
   *        storeAddress: string,  // 매장 주소1
   *        storeAddress2: string,  // 매장 주소2
   *        saupNumber: string,  // 사업자번호 ex)123-45-6789012
   *        auctionAble:string,  // 경매 사용 체크, '1': 사용, '0': 비사용
   *        storeSerialNumber: // 결제 리더기 고유번호 ???
   *    }
   * }
   * ```
   * - /torder/json/table.json
   * ```ts
   * {
   *    targetPaymentTableInfo: {
   *        Ta_id: string,  // 테이블 아이디
   *        Tablet_name: string,  // 테이블 이름
   *        van: string,  // van 사 정보: 'KSNET', 'KISVAN', 'SMARTRO', 'JTNET'
   *        Tablet_credit_use: string,  // 선불 여부, "1":yes, "0":no
   *        Tablet_credit_serialnumber: string,  // 결제기 고유 번호
   *    }
   * }
   * ```
   * > 하위 json 파일은 웹에서만 사용하는 json 파일
   * - /torder/json/uCode.json
   *
   * ```ts
   * {
   *        uCode: string,  // 랜덤 번호
   * }
   * ```
   *
   * - /torder/json/log.json
   *
   * ```ts
   * {
   *        logoBase64: string|undefined,  // 이미지 파일(base64)
   *        logoUrlHash: string|undefined,  // url 를 md5 로 encoding 한 값
   * }
   * ```
   * @param jsonData 파일에 저장할 데이터 (상위 파일 구조에 따른 json 파일 구조를 따른다.)
   * @param path 저장할 위치 경로
   *
   * @example
   * window.UUID.writeFile(JSON.stringfly({test:1}), '/torder/json/test.json');
   *
   * @responseMessage none
   */
  writeFile: (jsonData: string, path: string) => void,

  /**
   * 안드로이드 내부 저장소에 접근해 저장된 파일을 읽어옵니다.
   * > 개발 초기 크롬 웹뷰(통신규격1)로 개발 되었으나 파이어폭스 적용(통신규격2) 됨.
   *
   * [통신 규격 1](https://www.notion.so/1-a14dca92b5314458bfd9cce49af0a13b?pvs=21)
   *
   * @param path {string} 폴더 경로
   * @param readType {string} 응답값에 그대로 받을 데이터
   *
   * @example
   * window.UUID.readFile('/torder/json/test.json', "blabla");
   *
   * @responseMessage
   * ```ts
   * {
   *    methodName: "readFile";
   *    readType: string;  // 호출 시 두번째 인자 값을 그대로 응답한다.
   *    message: Blob;  // 파일의 데이터
   * }
   * ```
   */
  readFile: (path: string, readType: string) => void,

  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.1 | 최초 생성 |
   *
   * 안드로이드 태블릿의 MAC 주소를 읽어옵니다.
   *
   * [통신 규격 1](https://www.notion.so/1-a14dca92b5314458bfd9cce49af0a13b?pvs=21)
   *
   * @example
   * window.UUID.getMacAddress()
   * @responseMessage
   * ```ts
   * {
   *    methodName: "getMacAddress",
   *    macAddress: String
   * }
   * ```
   */
  getMacAddress: () => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.6.1 | 최초 생성 |
   *
   * 티오더 앱의 설정 데이터(Shared Preference) 내 ‘화면 회전’에 대한 값을 읽어옵니다. (세로 회전 / 가로 회전)
   *
   * [통신 규격 1](https://www.notion.so/1-a14dca92b5314458bfd9cce49af0a13b?pvs=21)
   *
   * @example
   * window.UUID.getTheme()
   *
   * @responseMessage
   * {
   *    methodName: "getTheme",
   *    theme: String,  // "horizontal" 또는 "vertical"
   * }
   */
  getTheme: () => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.1 | 최초 생성 |
   * | v1.5.3 | GPS 추가 |
   * | v1.6.6 | 수신 응답 스팩 변경, 하기 정의 참조 |
   * | v.1.6.7 | 수신 응답 스팩 변경, 하기 정의 참조 |
   *
   * 태블릿 기기의 실시간 상태를 읽어옵니다. (주의 : 앱 버전 별 message 형태 다르므로 안드로이드 담당자와 확인 필요)
   *
   * [통신 규격 1](https://www.notion.so/1-a14dca92b5314458bfd9cce49af0a13b?pvs=21)
   *
   * @example
   * window.UUID.getDeviceUsage()
   *
   * @responseMessage
   *
   * - message 는 JSON 포맷형식의 문자열(string) 으로 정의한다.
   *
   * ```ts
   * {
   *    methodName: "getDeviceUsage",
   *    message: String  // 문자열 구조는 하기 내용 참조
   * }
   * ```
   * - message
   * - - app v1.5.1
   *
   *     ```jsx
   *     // app v1.5.1
   *     {
   *        "time": 123123123,  // msec (unix time)
   *        "battery": 100,   // %
   *        "bright": 100,   // %
   *        "version": "151",
   *        "cpu": 23123, // hz??
   *        "ram": {
   *            "total": 3502,  // Mbyte
   *            "app": 323,  // Mbyte
   *            "used": 2119  // Mbyte
   *        },
   *        "storage":{
   *            "used": 6082,  // Mbyte
   *            "free": 19465  // Mbyte
   *        },
   *        "wifi": {
   *            "ssid": "",
   *            "speed": 333,  // kbyte/sec ???
   *            "strength": -43  // dBm, 수신 신호 강도
   *        }
   *     }
   *     ```
   *
   * - - app v1.5.3
   *
   *     ```jsx
   *     // app v1.5.3 (gps 필드 추가)
   *     {
   *       ...  // v1.5.1 이전 스팩
   *       "gps": {
   *            "latitude": 35.222,
   *            "longtitude": 123.444
   *       }
   *     }
   *     ```
   *
   * - - app v1.6.6
   *
   *     ```ts
   *     // app v1.6.6
   *     {
   *       "ssaid": "2cdc73d8f6c30cd1",  // 단말기 제조 고유 아이디
   *       "processors": 8,  // 프로세스 갯수
   *       "app": {
   *         "packageName": "com.torder.orderhae",  // 안드로이드 패키지 네임
   *         "versionName": "1.6.5",  // 안드로이드 버전 문자
   *         "versionCode": 10060005  // 안드로이드 버전 코드 1자리 major, 3자리 mior, 4자리 patch
   *       },
   *       "memory": {
   *         "device": 3502,  // MB, 단말기 전체 메모리
   *         "usage": 2119,  // MB, 사용중인 메모리
   *         "free": 1383  // MB, 사용 가능한 메모리
   *       },
   *       "storage": {
   *         "device": 25547,  // MB, 전체 용량
   *         "usage": 6082,  // MB, 사용 중인 용량
   *         "free": 19465  // MB, 남은 용량
   *       },
   *       "network": {
   *         "ssid": "t'order_1",  // 네트워크 이름
   *         "frequency": 5765,  // Mhz, 통신 중인 주파수 대역
   *         "rssi": -43,  // dBm, 수신 신호 강도
   *         "rx": 180,  // Mbps, 수신속도
   *         "tx": 180,  // Mbps, 송신속도
   *         "latency": 166,  // msec, 네트워크 응답시간
   *         "isConnected": true,  // 네트워크 연결 여부
   *         "gateway": "192.168.0.1",  // gateway 주소
   *         "dns": "[8.8.8.8, 8.8.4.4]",  // DNS ip 세팅 정보
   *         "ipv4": "192.168.0.157"  // IP 설정 정보
   *       },
   *       "battery": {
   *         "status": 2,  // 전원 상태(알수없음:1, 충전중:2, 방전:3, 미충전:4, 충전완료:5)
   *         "health": 2,  // 전원 헬스 상태(알수없음:1,
   *                       //             좋음:2,
   *                       //             과충전:3,
   *                       //             방전:4,
   *                       //             과전압:5,
   *                       //             정의되지 않은 실패:6,
   *                       //             저온상태:7(충전 저하))
   *         "plugged": 2,  // 전원연결(교류전원:1, USB:2, 무선충전:4)
   *         "capacity": 100  // %, 충전량
   *       }
   *     }
   *     ```
   *
   * - - app v1.6.7
   *
   *     ```jsx
   *     // app v1.6.7
   *     {
   *        "ssaid": "5c9cb859be1267b0",  // 단말기 제조 고유 아이디
   *        "hw": {
   *            "processors": 8,  // 프로세스 갯수
   *            "supportedABIs": [   // CPU 명령어 셋
   *                "arm64-v8a",
   *                "armeabi-v7a",
   *                "armeabi"
   *            ],
   *            "brand": "APEX",  // 기기의 브랜드명
   *            "model": "torder_pad",  // 기기의 모델명
   *            "hardware": "ums512_1h10"  // 기기의 메인보드 정보
   *        },
   *        "sw": {
   *            "code": "11",  // android 버전
   *            "api": 30,  // android SDK api 버전
   *            "buildNumber": "torder_V2.0_20230923". // 펌웨어 버전
   *        },
   *        "app": {
   *            "packageName": "com.torder.orderhae",    // 안드로이드 패키지 네임
   *            "name": "1.6.8",  // 안드로이드 버전 문자
   *            "code": 10060008  // 안드로이드 버전 코드 1자리 major, 3자리 mior, 4자리 patch
   *        },
   *        "memory": {
   *            "device": 3502,  // MB, 단말기 전체 메모리
   *            "usage": 1939,  // MB, 사용중인 메모리
   *            "free": 1563  // MB, 사용 가능한 메모리
   *        },
   *        "storage": {
   *            "device": 24554,  // MB, 전체 용량
   *            "usage": 5993,  // MB, 사용 중인 용량
   *            "free": 18561  // MB, 남은 용량
   *        },
   *        "network": {
   *            "ssid": "t'order_1",  // 네트워크 이름
   *            "frequency": 5765,  // Mhz, 통신 중인 주파수 대역
   *            "rssi": -42,  // dBm, 수신 신호 강도
   *                          // > -30 : Strong
   *                          // > -67 : excellent ~ good
   *                          // > -80 : weak, but still usable for some applications
   *                          // > -90 : very weak, may not be reliable enough fo most application
   *                          // < -90 : extremely weak, at the edge of what a receiver can receive
   *            "rx": 180,  // Mbps, 수신속도
   *            "tx": 180,  // Mbps, 송신속도
   *            "connectivity": {  // 연결 상태(네트워크 health 상태)
   *                "host": "192.168.0.1",  // ping 요청 대상 주소(주로 게이트웨이, 내부 네트워크 상태 체크)
   *                "received": 10,  // 수신된 패킷 수
   *                "transmitted": 10,  // 송신한 패킷 수
   *                "loss": 0.0,  // 패킷 손실률
   *                "pingResult": [3.638,4.978,10.58,1.916]  // ping 시간 [min/avg/max/mdev] msec
   *            },
   *            "macAddress": "40:45:DA:19:0D:D4",  // H/W mac 정보
   *            "isConnected": true,  // 네트워크 연결 여부
   *            "gateway": "192.168.0.1",  // gateway 주소
   *            "dns": ["8.8.8.8","8.8.4.4"],  // DNS ip 세팅 정보
   *            "ipv4": "192.168.1.78"  // IP 설정 정보
   *        },
   *        "battery": {  // 배터리
   *            "status": 2,  // 전원 상태(알수없음:1, 충전중:2, 방전:3, 미충전:4, 충전완료:5)
   *            "health": 2,  // 전원 헬스 상태(알수없음:1,
   *                          //             좋음:2,
   *                          //             과충전:3,
   *                          //             방전:4,
   *                          //             과전압:5,
   *                          //             정의되지 않은 실패:6,
   *                          //             저온상태:7(충전 저하))
   *            "plugged": 2,  // 전원연결(교류전원:1, USB:2, 무선충전:4)
   *            "capacity": 41  // %, 충전량
   *        }
   *     }
   *     ```
   *
   * - - app v1.6.x (candidate)
   *
   *     ```jsx
   *     // v1.6.x(candidate)
   *     {
   *       ...,   // v1.6.8 에서 정의한 필드
   *        "usb": [{
   *            "sewoPrinter": {    // Product name, 하위 필드에 USB device 정보를 전달
   *                "vendorId": String;
   *                "productId": String;
   *                "classCode": String;
   *                "subclassCode": String;
   *                "protocolCode": String;
   *                "serialNumber": String;
   *            };  // true: 연결, false: 분리
   *         ...
   *        }]
   *     }
   *     ```
   */
  getDeviceUsage: () => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.1 | 최초 생성 |
   *
   * 티오더 앱의 설정 데이터(Shared Preference)에 상점코드(storeCode), 테이블코드(tableCode)를 저장/업데이트 합니다.
   *
   * [통신 규격 1](https://www.notion.so/1-a14dca92b5314458bfd9cce49af0a13b?pvs=21)
   *
   * 앱 초기시 table.json, store.json 파일에 있는 정보를 통해 storeCode, tableCode 를 업데이트 하기도 한다.
   *
   * @param jsonString {string}  문자열은 아래와 같은 구조의 JSON string 이 전달된다.
   *   {
   *      storeCode: string,  // 매장코드
   *      tableCode: string,  // 테이블코드
   *   }
   * @example
   * window.UUID.setStoreCode(JSON.stringfy({
   *    storeCode: "1234567",
   *    tableCode: "4848484",
   * }))
   * @responseMessage none
   */
  setStoreCode: (jsonString: string) => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.1 | 최초 생성 |
   *
   * 장바구니에 담긴 상품의 총 수량을 티오더 앱에 전달합니다. (기가지니에 사용되는 기능,  음성 재생을 위한 목적)
   *
   * [통신 규격 1](https://www.notion.so/1-a14dca92b5314458bfd9cce49af0a13b?pvs=21)
   * @param cartCount {number} 장바구니의 아이템이 담기 갯수
   */
  setCartCount: (cartCount) => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.4 | 최초 생성 |
   *
   * 티오더 앱을 통해 주문 알림음 재생을 요청합니다. (티!오더)
   *
   * [통신 규격 1](https://www.notion.so/1-a14dca92b5314458bfd9cce49af0a13b?pvs=21)
   */
  playOrderBell: () => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.5 | 최초 생성 |
   *
   * 티오더 앱의 부가서비스 기능 중 채팅화면(앱 화면) 노출을 요청합니다.
   *
   * [통신 규격 1](https://www.notion.so/1-a14dca92b5314458bfd9cce49af0a13b?pvs=21)
   */
  showChattingWindow: () => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | 1.5.11 | 최초 생성 |
   *
   * 티오더 앱의 채팅 테이블 “선택화면(앱 화면) 노출을 요청”합니다.
   *
   * [통신 규격 1](https://www.notion.so/1-a14dca92b5314458bfd9cce49af0a13b?pvs=21)
   */
  showAllChattingWindow: () => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.14 | 최초 생성 |
   *
   * 티오더 앱의 채팅 1:1 톡 화면의 강제 종료를 요청합니다.
   *
   * [통신 규격 1](https://www.notion.so/1-a14dca92b5314458bfd9cce49af0a13b?pvs=21)
   * @param storeCode {string} 스토어 코드
   * @param tableNumber {string} 테이블 번호
   */
  closeChat: (storeCode, tableNumber) => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.51 | 최초 생성 |
   *
   * 티오더 앱의 부가서비스 기능 중 대전게임화면(앱 화면) 노출을 요청합니다.
   *
   * [통신 규격 1](https://www.notion.so/1-a14dca92b5314458bfd9cce49af0a13b?pvs=21)
   * @param storeCode {string} 스토어 코드
   * @param tableCode {string} 테이블 번호
   * @param tableName {string} 테이블 이름
   */
  showTableGame: (storeCode, tableCode, tableName) => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.51 | 최초 생성 |
   *
   * 티오더 앱의 부가시버스 기능 중 다른 테이블과 대결하여 진행하는 대전게임화면(앱 화면) 노출을 요청합니다.
   *
   * [통신 규격 1](https://www.notion.so/1-a14dca92b5314458bfd9cce49af0a13b?pvs=21)
   * @param invitationURL {string} 게임초대 URL
   */
  joinTableGame: (invitationURL) => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.22 | 최초 생성 |
   *
   * 웹의 새로고침을 요청합니다.
   *
   * [통신 규격 1](https://www.notion.so/1-a14dca92b5314458bfd9cce49af0a13b?pvs=21)
   */
  refresh: () => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.1 | 최초 생성 |
   * | v1.5.2 | web → mobile 요청 파라메터 payReqId 추가 |
   * | v1.5.3 | web → mobile 요청 파라메터 orderKey 추가 |
   * | v1.6.1 | 환불 로직 제거(파라메터가 넣어도 동작하지 않음) |
   *
   * 티오더 앱에 신용카드 결제를 요청합니다 (구 선결제)
   *
   * > APP 1.5.x 버전 전까지 사용됨, app 1.6.x 버전 이후 앱에서 직접 결제로 바뀌면서 응답데이터 없음.
   * >
   *
   * [통신규격1](https://www.notion.so/FE-e8ab1eefc2ba40788b4db573fd806f48?pvs=21)
   * @param installment {string} (required) 할부개월<br/>
   *                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ex) ‘00’ : 일시불, ‘13’: 13개월
   * @param amount {string} (required) 결제 금액
   * @param payReqId {string} (required) 결제요청ID<br/>
   *                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;’[스토어id]-[테이블id]-[현재시간(초)]-[uCode]’<br/>
   *                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;uCode - 서버에서 cookie 로 전달 되는 정보
   * @param deviceId {string} (required) table 에 연결된 결제기 번호
   * @param storeCd {string} (required) 매장 코드
   * @param tableNo {string} (required) 테이블 번호
   * @param vanType {string} (required) 벤사 유형<br/>
   *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;‘DAOUDATA’, ‘KSNET’, ‘JTNET’, ‘KICC’, ‘KISVAN’, ‘KOCES’, ‘KOVAN’, ‘NHNKCP’, ‘NICE’, SMARTRO’
   * @param orderKey {string} (optional) 주문 키, post ‘/credit/orederRequest’ 에 응답한 데이터 order_key 필드
   * @responseMessage
   * ```ts
   * {
   *    "methodName":"callBackPayment",
   *    "result": String,
   * }
   * // result
   * {
   *    responseCode: string,  // Torder 에러 테이블 참조(android bridge interface error code define)
   *    errorMessage: string,
   *    approvalType: ‘REFUND’|‘APPROVAL’|‘ERROR’,
   *    payReqId: string,  // 결제요청 id
   *    orderKey: string,  // 주문 구분(상위주문의 하위 구분 key)
   * }
   * ```
   * @deprecated 앱 버전 v1.6.1 부터 {@link readyPayment} 사용
   */
  torderPayment: (installment, amount, payReqId, deviceId, storeCd, tableNo, vanType, orderKey) => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.1 | 최초 생성 |
   * | v1.5.2 | web → mobile 요청 파라메터 payReqId 추가 |
   * | v1.5.3 | web → mobile 요청 파라메터 orderKey 추가 |
   * | v1.6.1 | 환불 로직 제거(파라메터가 넣어도 동작하지 않음) |
   *
   * 티오더 앱에 신용카드 결제취소를 요청합니다. (구 선결제)
   *
   * > APP 1.5.x 버전 전까지 사용됨, app 1.6.x 버전 이후 앱에서 직접 결제로 바뀌면서 응답데이터 없음.
   * [통신규격1](https://www.notion.so/FE-e8ab1eefc2ba40788b4db573fd806f48?pvs=21)
   * @param installment {string} (required) 할부개월<br/>
   *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ex) ‘00’ : 일시불, ‘13’: 13개월
   * @param amount {string} (required) 결제 금액
   * @param payReqId {string} (required) 결제요청ID<br/>
   *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ’[스토어id]-[테이블id]-[현재시간(초)]-[uCode]’<br/>
   *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; uCode - 서버에서 cookie 로 전달 되는 정보
   * @param approvalDate {string} (required) ???
   * @param paymentId {string} (required) ???
   * @param approvalNumber {string} (required) ???
   * @param deviceId {string} (required) table 에 연결된 결제기 아이디
   * @param storeCd {string} (required) 매장 코드
   * @param tableNo {string} (required) 테이블 번호
   * @param vanType {string} (required) 벤사 유형<br/>
   *    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;‘DAOUDATA’, ‘KSNET’, ‘JTNET’, ‘KICC’, ‘KISVAN’, ‘KOCES’, ‘KOVAN’, ‘NHNKCP’, ‘NICE’, SMARTRO’
   * @param orderKey {string} (optional) 주문 키, post ‘/credit/orederRequest’ 에 응답한 데이터 order_key 필드
   *
   * @responseMessage
   * ```ts
   * {
   *    "methodName":"callBackPayment",
   *    "result":String
   * }
   * ```
   * // result
   * {
   *    responseCode: string,  // Torder 에러 테이블 참조(android bridge interface error code define)
   *    errorMessage: string,
   *    approvalType: ‘REFUND’|‘APPROVAL’|‘ERROR’,
   *    payReqId: string,  // 결제요청 id
   *    orderKey: string,  // 주문 구분(상위주문의 하위 구분 key)
   * }
   * @deprecated 앱 버전 v1.6.1 부터 {@link readyPayment} 사용
   */
  torderRefund: (installment: string,
    amount: string,
    payReqId: string,
    approvalDate: string,
    paymentId: string,
    approvalNumber: string,
    deviceId: string,
    storeCd: string,
    tableNo: string,
    vanType: string,
    orderKey: string) => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.37 | 최초 생성 |
   *
   * 세로테마 사용을 위해 티오더 앱에 가로/세로 회전을 요청합니다. (토글)
   *
   * [통신규격1](https://www.notion.so/FE-e8ab1eefc2ba40788b4db573fd806f48?pvs=21)
   */
  screenRotation: () => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.37 | 최초 생성 |
   *
   * 티오더 앱에서 동영상 배너 재생을 요청합니다. 해당 url 링크의 영상 정보를 안드로이드 내부적 캐쉬하고 있다.
   *
   * [통신규격1](https://www.notion.so/FE-e8ab1eefc2ba40788b4db573fd806f48?pvs=21)
   * @param mediaIndex {number} 배너 인덱스
   * @param mediaUrl {string} 영상 링크
   * @param control {number} 0: 창닫기, 1: 스크릿 컨트롤 기능 올라옴
   */
  playAdMedia: (mediaIndex: number, mediaUrl: string, control: number) => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.70 | 최초 생성 |
   *
   * 티오더 앱에 시작 URL 을 저장
   *
   * [통신규격1](https://www.notion.so/FE-e8ab1eefc2ba40788b4db573fd806f48?pvs=21)
   * @param homeUrl {string} app 의 webView default 홈페이지 URL
   */
  setHomeUrl: (homeUrl: string) => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.6.1 | 최초 생성 |
   * 선결제 결제/취소 요청<br/>
   * 선결제 기능을 동작시킵니다 (선결제 리메이크)
   *
   * > 앱에서 직접 결제 로직으로 수정 되면서 앱에 결제 요청 후 결제 결과만 받는다.
   * > 앱은 전달되는 데이터 중 orderKey(결제사 결제번호?? 티오더 결제 번호??) 만 사용하고 있다.
   *
   * [통신규격1](https://www.notion.so/FE-e8ab1eefc2ba40788b4db573fd806f48?pvs=21)
   * @param {String} businessNumber - 사업자등록번호, 앱에서 참조 X
   * @param {String} deviceId - VAN사 TID(CP ID), 앱에서 참조 X
   * @param {String} serialNo - VAN사 시리얼 번호(KOCES만 해당), 앱에서 참조 X
   * @param {String} vanType - VAN사 정보, 앱에서 참조 X
   * @param {String} orderKey - 주문 키, 앱에서 참조 O
   * @param {String} storeCode - 상점 코드, 앱에서 참조 X
   * @param {String} tabletCode - 태블릿 코드, 앱에서 참조 X
   *
   * @responseMessage
   * - 장바구니 비우기 (get_cart_list API 호출)
   * - 인원 수 초기화
   * - 안드로이드 응답에 대한 로그 API 전송
   *
   * ```ts
   * {
   *    methodName: "paymentResult";
   *    orderKey: string;  // 결제번호
   *    pending: bool;  // 결제 장애, 보류 처리인지 여부
   * }
   * ```
   */
  readyPayment: (businessNumber: string,
    deviceId: string,
    serialNo: string,
    vanType: string,
    orderKey: string,
    storeCode: string,
    tabletCode: string) => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.6.1 | 최초 생성 |
   * client(tablet) 에서 결제취소 요청<br/>
   * 선결제 중 오류가 발생된 결제건을 취소시키는 기능입니다. (선결제 리메이크)
   *
   * [통신규격1](https://www.notion.so/FE-e8ab1eefc2ba40788b4db573fd806f48?pvs=21)
   * @param {string} orderKey 주문 키
   * @responseMessage
   * ```ts
   * {
   *    methodName: "paymentResult";
   *    orderKey: string;  // 결제번호
   *    pending: bool;  // 결제 장애, 보류 처리인지 여부
   * }
   * ```
   */
  cancelErrorPayment: (orderKey: string) => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.6.1 | 최초 생성 |
   * master 에서 결제 보류 취소 요청<br/>
   * 선결제 기능을 보류 상태로 동작시킵니다. (선결제 리메이크)
   *
   * [통신규격1](https://www.notion.so/FE-e8ab1eefc2ba40788b4db573fd806f48?pvs=21)
   * @param {string} orderKey 주문 키
   */
  cancelPaymentPending: (orderKey) => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.6.5 | 최초 생성 |
   * master 에서 강제 결제 취소<br/>
   * 마스터에서 주문을 강제로 취소하는 기능(결제 취소 화면 노출)입니다. (선결제 리메이크)
   *
   * [통신규격1](https://www.notion.so/FE-e8ab1eefc2ba40788b4db573fd806f48?pvs=21)
   * @param orderKey {string} 주문키
   */
  cancelForcedOrder: (orderKey) => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.39G2 | 최초 생성, 특수버전으로 배포 |
   * | v1.5.39G3 -> v1.5.39TG3 | playTableGame → startTableGame 네임 변경, gameCode 추가 |
   * | v1.5.39TG8 | 안드로이드 로직 삭제됨, 인터페이스만 존재함 |
   *
   * 별도 app(com.payqube.tablegame) 를 호출하여 파라메터를 전달함.
   *
   * [통신 규격 2](https://www.notion.so/FE-e8ab1eefc2ba40788b4db573fd806f48?pvs=21)
   * @param storeCode {string} 매장 코드
   * @param tableCode {string} 테이블 코드
   * @param tableName {string} 테이블 이름
   * @param gameRoomId {string} 게임방id
   * @param nickName {string} 플레이어 닉네임
   * @param gender {string} 성별, -1:미지정,
   * @param gamePlayerId {number} ???
   * @param gameCode {string} ???
   */
  playTableGame: (
    storeCode: string,
    tableCode: string,
    tableName: string,
    gameRoomId: string,
    nickName: string,
    gender: number,
    gamePlayerId: number,
    gameCode: string
  ) => void,
  /**
   * {@link playTableGame} 와 동일
   */
  startTableGame: (
    storeCode: string,
    tableCode: string,
    tableName: string,
    gameRoomId: string,
    nickName: string,
    gender: number,
    gamePlayerId: number,
    gameCode: string
  ) => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.39G2 | 최초 생성 |
   *
   * 해당 숨김 기능은 ‘티오더 app’ 에서 [showTableGame](https://www.notion.so/FE-e8ab1eefc2ba40788b4db573fd806f48?pvs=21) 를 통해 열린 activity 를 숨김처리 함
   *
   * > 해당 인터페이스는 ‘게임 app’(com.payqube.tablegame) 에서 호출하는 인터페이스 이다.
   * >
   *
   * [통신 규격 2](https://www.notion.so/FE-e8ab1eefc2ba40788b4db573fd806f48?pvs=21)
   * @param nickName {string} 플레이어 닉네임
   * @param gender {number}  성별, -1: 미지정, ???
   */
  hideTableGame: (nickName: string, gender: number) => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.39G3 | 최초 생성 |
   *
   * 게임의 고객 아이디를 로컬에 안드로이드에 저장한다. 게임 activity 을 다시 호출 할때 저장된 고객 게임 id를 사용
   *
   * > 해당 인터페이스는 ‘게임 app’(com.payqube.tablegame) 에서 호출하는 인터페이스 이다.
   * >
   *
   * [통신 규격 2](https://www.notion.so/FE-e8ab1eefc2ba40788b4db573fd806f48?pvs=21)
   * @param gameCustomerId {number} 고객 게임 ID
   */
  setGameCustomerId: (gameCustomerId: number) => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.70 | 최초 생성 |
   *
   * [통신 규격 1](https://www.notion.so/1-a14dca92b5314458bfd9cce49af0a13b?pvs=21)
   */
  setOrientationToHorizontal: () => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.70 | 최초 생성 |
   *
   * [통신 규격 1](https://www.notion.so/1-a14dca92b5314458bfd9cce49af0a13b?pvs=21)
   */
  setOrientationToVertical: () => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.67 | 최초 생성 |
   *
   * 웹페이지 URL 에 `orderview.` 이 들어가 있을 고객 주문 영수증(결제영수증), 없을 경우 주방 영수증
   *
   * 마스터는 주방 영수증 출력
   *
   * 그외에는 결제 영수증 출력
   *
   * [통신 규격 1](https://www.notion.so/1-a14dca92b5314458bfd9cce49af0a13b?pvs=21)
   * @param {string} orderNo 주문번호
   * @param {string} orderList JSON 스트링<br>
   * ```ts
   * [{
   *    price: string;  // 상품 가격
   *    qty: string;  // 상품 수량
   *    name: string;  // 상품 이름
   * }]
   * ```
   */
  torderPrintOrder: (orderNo: string, orderList: string) => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.67 | 최초 생성 |
   *
   * 고객이 결제한 영수증와 orderList(주문내역) 과 같이 출력한다.
   *
   * [통신 규격 1](https://www.notion.so/1-a14dca92b5314458bfd9cce49af0a13b?pvs=21)
   * @param {string} orderNo 주문번호
   * @param {string} orderList JSON 스트링<br/>
   * ```ts
   * [{
   *    price: string;  // 상품 가격
   *    qty: string;  // 상품 수량
   *    name: string;  // 상품 이름
   * }]
   * ```
   */
  torderPrintReceipt: (orderNo: string, orderList: string) => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.1 | 최초 생성 |
   *
   * 일시적으로 storeCode  와 tableCode 를 설정한다
   *
   * [통신 규격 1](https://www.notion.so/1-a14dca92b5314458bfd9cce49af0a13b?pvs=21)
   * @param storeInfo {string} 상점 정보 JSON 문장<br/>
   * ```ts
   * {
   *    storeCode: string;
   *    tableCode: string;
   * }
   * ```
   */
  torderUpdateCheck: (storeInfo: string) => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.7.0 | 최초 생성 |
   *
   * 오디오 파일을 재생하며 아래와 같이 재생이 가능하다
   *
   * [통신 규격 1](https://www.notion.so/1-a14dca92b5314458bfd9cce49af0a13b?pvs=21)
   * @param url {String} 음원의 URI, URL 를 받아서 재생한다.<br>
   * ```
   * 예)
   * 파일 재생 - 'torder/audio/event/greeting.mp3'
   * 음원 중지 - ''
   * ```
   * @param option {{
   *     volume?: Number;
   *   }?} 옵션 설정
   * ```
   * {
   *   volume: number;  // 볼륨 %, 0~100, 재생 때만 해당 음원 볼류 사용, -1 일 경우 default volume 으로 재생
   * }
   * ```
   * @responseMessage
   * 에러일때만 응답
   * ```
   *
   * ```
   */
  playAudio: (url: string, option: object) => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.7.0 | 최초 생성 |
   *
   *  로컬 저장소에 저장되는 위치의 모든 파일에 대해서 동기화를 진행한다.
   *
   * 주의사항) 파일에 대한 접근을 여러번 할 경우 성능 및 충돌에 대한 이슈가 있을 수 있으므로 가급적 최소한으로 접근을 제한 해야한다.
   *
   * [통신 규격 1](https://www.notion.so/1-a14dca92b5314458bfd9cce49af0a13b?pvs=21)
   * @param resources {AppBridgeSyncFileResource} 리소스 들에 대한 파일 정보
   * ```
   * {
   *   syncFiles: [{
   *     path: String;       // 파일명을 제외한 로컬 저장소 폴더 경로
   *     url: String;      // 서버에 있는 리소스 url  ex) 'http://i.torder.com/audio/greeting_구로통닭.mp3'
   *     fileName: String; // 파일명 'greeting_구로통닭.mp3'
   *     fileSize: BigInt; // byte
   *     option: {         // 파일의 메타 정보
   *       force: boolean: // 동일한 파일(사이즈) 이여도 강제로 다시 다운로드 받을지 여부, default : false
   *     }
   *   }];  // syncFiles end
   * };
   * ```
   * @responseMessage
   * 요청에 대한 전체 결과에 대한 응답을 전송한다.
   *
   * ```jsx
   * {
   *   methodName: "syncFiles";
   *   data: {
   *        failedFiles: [
   *        {
   *          url: String;         // 서버에서 요청한 리소스 url
   *        },
   *      ];
   *        duration: Number;        // msec
   *    }
   * }
   * ```
   */
  syncFiles: (resources: AppBridgeSyncFileResource) => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.7.0 | 최초 생성 |
   *
   * 기본 오디오 볼륨 조절
   *
   * [통신 규격 1](https://www.notion.so/1-a14dca92b5314458bfd9cce49af0a13b?pvs=21)
   * @param level {number} 볼륨 %, 0~100
   */
  setDefaultVolume: (level: number) => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.7.0 | 최초 생성 |
   *
   * 음소거 여부 설정
   *
   * [통신 규격 1](https://www.notion.so/1-a14dca92b5314458bfd9cce49af0a13b?pvs=21)
   * @param enable {boolean} true: 음소거, false: 소리켜기
   */
  mute: (enable: boolean) => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.7.0 | 최초 생성 |
   *
   * 내부저장소에 있는 파일/폴더 을(를) 삭제한다.
   *
   * [통신 규격 1](https://www.notion.so/1-a14dca92b5314458bfd9cce49af0a13b?pvs=21)
   * @param path {string}
   * @param force {boolean = false} 디렉토리일 경우 삭제 여부(option, default: false)
   * ```
   * true - path 경로의 폴더, 하위폴더를 모두 지운다
   * false - path 경로의 폴더, 하위폴더를 모두 지우지 않는다.
   * ```
   */
  removeFile: (path: string, force: boolean = false) => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.44 | 최초 생성 |
   * | v1.6.1 | 제거 |
   *
   * QR reader dialog 호출
   *
   * [통신 규격 1](https://www.notion.so/1-a14dca92b5314458bfd9cce49af0a13b?pvs=21)
   * @deprecated v1.6.1 부터 지원 안함
   */
  hideQrReader: () => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.44 | 최초 생성 |
   * | v1.6.1 | 제거 |
   *
   * QR reader dialog 호출
   *
   * [통신 규격 1](https://www.notion.so/1-a14dca92b5314458bfd9cce49af0a13b?pvs=21)
   * @deprecated v1.6.1 부터 지원 안함
   */
  showQrReader: () => void,
  /**
   * | 앱 버전 | 설명 |
   * | --- | --- |
   * | v1.5.44 | 최초 생성 |
   * | v1.6.1 | 제거 |
   *
   * toast 팝업 호출
   *
   * [통신 규격 1](https://www.notion.so/torderkorea/FE-e8ab1eefc2ba40788b4db573fd806f48?pvs=4#a14dca92b5314458bfd9cce49af0a13b)
   * @deprecated v1.6.1 부터 지원 안함
   * @param {string} responseCode 레벨 컬러 코드
   * ```
   * 0 ~ 99 : #ff0000 (red)
   * 100 ~ 299 : #FF1AB9FF
   * 300 ~ 399 : #FF54DE1A
   * 400 ~ : #888888 (Gray)
   * ```
   * @param {string} responseMessage 토스트 노출 메시지
   */
  showQrDialog: (responseCode: string, responseMessage: string) => void,
}

declare global {
  interface Window {
    UUID: NativeBridgeInterface,
  }
}
