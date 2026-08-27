# 네이버 뉴스 프록시 서버 (Vercel)

시작 홈페이지에서 네이버 뉴스 검색 API를 안전하게 사용하기 위한 중간 서버입니다.
Client Secret은 이 프로젝트의 Vercel 환경변수에만 저장되고, 코드나 프론트엔드에는 노출되지 않습니다.

## 배포 순서

### 1. GitHub에 이 폴더 올리기
- github.com 에서 새 저장소(Repository)를 하나 만듭니다. (예: `naver-news-proxy`, Public/Private 상관없음)
- 이 폴더(`naver-news-proxy`) 전체를 그 저장소에 업로드합니다.
  - GitHub 웹사이트에서 "Add file → Upload files"로 드래그해서 올리셔도 됩니다.

### 2. Vercel 계정 만들고 프로젝트 연결
- vercel.com 접속 → "Sign Up" → **Continue with GitHub**로 가입 (방금 만든 GitHub 계정으로 로그인)
- 가입 후 대시보드에서 **"Add New... → Project"** 클릭
- 방금 올린 `naver-news-proxy` 저장소를 선택하고 **Import**
- Framework는 자동으로 "Other"로 잡힙니다. 별다른 설정 없이 그대로 진행하면 됩니다.

### 3. 환경변수(Secret) 등록
Import 화면 또는 이후 **프로젝트 → Settings → Environment Variables**에서:

| Name | Value |
|---|---|
| `NAVER_CLIENT_ID` | 네이버 콘솔의 Client ID (예: i189xj51oz) |
| `NAVER_CLIENT_SECRET` | 네이버 콘솔의 Client Secret (재발급받은 최신 값) |

입력 후 **Save**. (환경변수를 새로 추가/변경했다면 Deployments 탭에서 재배포가 필요할 수 있어요 — "Redeploy" 버튼 클릭)

### 4. 배포 확인
- 배포가 끝나면 `https://프로젝트이름.vercel.app` 같은 주소가 생깁니다.
- 브라우저 주소창에 아래처럼 입력해서 테스트:
  ```
  https://프로젝트이름.vercel.app/api/news?query=한우
  ```
- JSON 형태로 뉴스 목록이 뜨면 성공입니다.

### 5. 시작 홈페이지에 연결
발급된 주소(`https://프로젝트이름.vercel.app`)를 저에게 알려주시면,
시작 홈페이지 코드의 `NEWS_API_BASE` 값을 그 주소로 채워서 실제 뉴스가 뜨도록 연결해드릴게요.

---

**참고**
- 무료 플랜(Hobby)으로 충분합니다. 결제 정보 없이 진행 가능해요.
- Client Secret은 절대 GitHub 코드나 채팅에 다시 붙여넣지 마세요. Vercel 환경변수 입력창에만 넣으시면 됩니다.
