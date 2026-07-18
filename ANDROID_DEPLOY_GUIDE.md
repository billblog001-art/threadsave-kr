# 안드로이드 휴대폰으로 배포하기

## 준비 계정
- GitHub 계정
- Render 계정
- 사용할 도메인 계정
- Google Search Console
- 네이버 서치어드바이저
- Bing Webmaster Tools
- Google AdSense

## 1. GitHub에 코드 올리기
1. GitHub 앱 또는 Chrome에서 github.com 로그인
2. 새 저장소 생성: `threadsave-kr`
3. 이 압축파일을 풀고 `node_modules`를 제외한 모든 파일 업로드
4. 저장소는 Public 또는 Private 모두 가능

## 2. Render 배포
1. Render 로그인
2. New → Blueprint 선택
3. GitHub 저장소 연결
4. `render.yaml` 감지 후 Apply
5. 환경변수 입력
   - `SITE_URL`: 처음에는 Render에서 받은 주소
   - `THREADS_RESOLVER_URL`: 적법하게 사용할 수 있는 영상 처리 API 주소
   - `THREADS_RESOLVER_API_KEY`: 해당 API 키
6. 배포 완료 후 `/health`에서 `{"ok":true}`가 나오면 서버 정상

## 3. 도메인 연결
1. Render 서비스 → Settings → Custom Domains
2. 도메인 입력
3. Render가 안내하는 DNS 레코드를 도메인 업체에 입력
4. 인증 완료 후 `SITE_URL`을 실제 HTTPS 도메인으로 변경

## 4. 애드센스
1. AdSense → 사이트 → 새 사이트
2. 실제 도메인 입력
3. 발급 코드를 `public/index.html`의 `<head>` 안에 삽입
4. 개인정보처리방침·이용약관·저작권 페이지의 운영자 정보를 실제 정보로 수정
5. 검토 요청

## 5. 검색 등록
- Google Search Console: 도메인 등록 후 `https://도메인/sitemap.xml` 제출
- 네이버 서치어드바이저: 사이트 등록·소유확인 후 sitemap 제출
- Bing Webmaster Tools: 사이트 등록 후 sitemap 제출

## 중요한 제한
현재 다운로드 버튼은 `THREADS_RESOLVER_URL`에 실제 영상 처리 API가 연결되어야 작동합니다. 이 값이 없으면 안내 메시지만 표시됩니다. 타인의 콘텐츠를 무단 저장·재배포하거나 Meta의 접근 제한을 우회하는 방식은 사용하지 마세요.
