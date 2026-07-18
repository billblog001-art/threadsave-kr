# ThreadSave

Threads 공개 게시물 중 사용자가 소유하거나 저장 허가를 받은 동영상을 처리하는 한국어 MVP입니다.

## 실행
```bash
npm install
cp .env.example .env
npm run dev
```

## 핵심 설정
- `SITE_URL`: 실제 HTTPS 도메인
- `THREADS_RESOLVER_URL`: Meta의 허가를 받은 API 또는 운영자가 적법하게 사용할 수 있는 미디어 리졸버
- `THREADS_RESOLVER_API_KEY`: 리졸버 인증키

리졸버 응답 형식:
```json
{"items":[{"url":"https://.../video.mp4","quality":"HD","format":"MP4","thumbnail":"https://..."}]}
```

## 배포
Render, Railway, Fly.io, Cloud Run 등 Node/Docker 호스팅에 배포할 수 있습니다. 환경변수를 등록하고 커스텀 도메인과 HTTPS를 연결하세요.

## 운영 전 교체
1. 모든 `YOUR-DOMAIN.com`
2. AdSense의 `ca-pub-XXXXXXXXXXXXXXXX`
3. 개인정보처리방침의 사업자·문의·보관기간
4. Search Console, 네이버, Bing의 소유확인 메타태그

## 주의
Meta는 사전 허가 없는 자동화된 데이터 수집을 제한합니다. 임의 스크래핑 코드를 붙이지 말고 공식/승인된 방식만 연결하세요.
