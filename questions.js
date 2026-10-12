// 퀴즈 문항 데이터
// 문항 작성 규칙은 CLAUDE.md의 "문항 작성 규칙" 절을 따른다.
// 각 문항: { id, category, question, choices[4], answer(0~3), explanation }

const QUESTIONS = [
  // ── 파이썬 기초 ──
  { id: "py-01", category: "파이썬 기초", question: "파이썬에서 리스트의 길이를 구하는 함수는?", choices: ["len()", "size()", "count()", "length()"], answer: 0, explanation: "len()은 리스트, 문자열 등 시퀀스의 길이를 돌려준다." },
  { id: "py-02", category: "파이썬 기초", question: "print(type(3.0))의 출력 결과는?", choices: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'double'>"], answer: 1, explanation: "소수점이 있는 수는 float 자료형이다." },
  { id: "py-03", category: "파이썬 기초", question: "다음 중 변경할 수 없는(immutable) 자료형은?", choices: ["list", "dict", "set", "tuple"], answer: 3, explanation: "tuple은 만든 뒤 원소를 바꿀 수 없다." },
  { id: "py-04", category: "파이썬 기초", question: "range(1, 5)가 만드는 수가 아닌 것은?", choices: ["1", "3", "4", "5"], answer: 3, explanation: "range의 끝 값 5는 포함되지 않는다." },
  { id: "py-05", category: "파이썬 기초", question: "딕셔너리 d에서 키 목록을 얻는 메서드는?", choices: ["d.items()", "d.keys()", "d.values()", "d.get()"], answer: 1, explanation: "keys()는 딕셔너리의 키들을 돌려준다." },

  // ── 데이터 분석 ──
  { id: "da-01", category: "데이터 분석", question: "pandas에서 표 형태 데이터를 다루는 기본 자료구조는?", choices: ["Series", "DataFrame", "ndarray", "Tensor"], answer: 1, explanation: "DataFrame은 행과 열이 있는 2차원 표 구조다." },
  { id: "da-02", category: "데이터 분석", question: "CSV 파일을 DataFrame으로 읽는 pandas 함수는?", choices: ["pd.load_csv()", "pd.open_csv()", "pd.read_csv()", "pd.import_csv()"], answer: 2, explanation: "pd.read_csv()로 CSV 파일을 읽는다." },
  { id: "da-03", category: "데이터 분석", question: "DataFrame의 처음 5행을 보는 메서드는?", choices: ["df.top()", "df.first()", "df.head()", "df.start()"], answer: 2, explanation: "head()는 기본으로 앞의 5행을 보여 준다." },
  { id: "da-04", category: "데이터 분석", question: "결측치(빈 값) 개수를 열별로 세는 코드는?", choices: ["df.isnull().sum()", "df.count_na()", "df.empty()", "df.dropna().sum()"], answer: 0, explanation: "isnull()로 결측 여부를 구하고 sum()으로 열별 개수를 센다." },
  { id: "da-05", category: "데이터 분석", question: "값 1, 2, 3, 4, 100의 중앙값은?", choices: ["3", "22", "4", "2"], answer: 0, explanation: "정렬한 가운데 값은 3이다. 평균(22)과 달리 이상치 영향을 덜 받는다." },

  // ── 빅데이터 개념 ──
  { id: "bd-01", category: "빅데이터 개념", question: "빅데이터 3V에 해당하지 않는 것은?", choices: ["Volume(규모)", "Velocity(속도)", "Variety(다양성)", "Visibility(가시성)"], answer: 3, explanation: "3V는 Volume, Velocity, Variety다." },
  { id: "bd-02", category: "빅데이터 개념", question: "행과 열이 정해진 표 형태의 데이터를 무엇이라 하는가?", choices: ["정형 데이터", "비정형 데이터", "반정형 데이터", "메타 데이터"], answer: 0, explanation: "스키마가 정해진 표 형태 데이터는 정형 데이터다." },
  { id: "bd-03", category: "빅데이터 개념", question: "JSON, XML 같은 데이터는 주로 어떤 유형인가?", choices: ["정형 데이터", "반정형 데이터", "비정형 데이터", "이진 데이터"], answer: 1, explanation: "태그나 키로 구조를 표현하는 JSON, XML은 반정형 데이터다." },
  { id: "bd-04", category: "빅데이터 개념", question: "대용량 데이터를 여러 컴퓨터에 나누어 저장하는 하둡의 파일 시스템은?", choices: ["NTFS", "HDFS", "FAT32", "EXT4"], answer: 1, explanation: "HDFS는 하둡 분산 파일 시스템이다." },
  { id: "bd-05", category: "빅데이터 개념", question: "데이터베이스에서 데이터를 조회할 때 쓰는 SQL 명령어는?", choices: ["INSERT", "UPDATE", "SELECT", "DELETE"], answer: 2, explanation: "SELECT는 데이터를 조회하는 명령어다." }
];
