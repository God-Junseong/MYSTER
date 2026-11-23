# MYSTER

Multidisciplinary Young Scientists Talk Exposure-Response — https://god-junseong.github.io/MYSTER/

빌드 단계 없는 정적 사이트입니다(HTML + CSS + 바닐라 JS).

## 내용 고치기
- **공지 · 멤버 · 갤러리**: `data/content.js`만 고치면 됩니다.
- **홈 문구**: `index.html`, **About · Contact 문구**: `about/index.html`, `contact/index.html`에서 직접 고칩니다.
- **메뉴 · 푸터**: 여섯 페이지 파일에 똑같이 들어 있으니, 바꿀 때는 여섯 곳 모두 고쳐야 합니다.
- **CSS/JS를 고친 뒤**에는 모든 페이지의 `?v=숫자`를 하나 올려야 방문자 브라우저가 새 파일을 받습니다.
- **사진**: 아래 파일명으로 `assets/img/`에 넣으면 바로 표시됩니다(없으면 빈 회색 박스).
  - `hero.jpg`
  - `members/prof-1.jpg` … `prof-4.jpg`
  - `gallery/2412-1.jpg` … `2412-3.jpg`, `gallery/2206-1.jpg` … `2206-3.jpg`

## 구조
```
index.html            Home          → /MYSTER/
about/index.html      About         → /MYSTER/about/
members/index.html    Members       → /MYSTER/members/
notice/index.html     Notice        → /MYSTER/notice/   (특정 공지: /MYSTER/notice/#web)
gallery/index.html    Gallery       → /MYSTER/gallery/  (특정 앨범: /MYSTER/gallery/#album-2412)
contact/index.html    Contact       → /MYSTER/contact/
assets/css/style.css
assets/js/main.js     콘텐츠 렌더링 + 공지 펼치기 + 갤러리 앨범 스크롤
data/content.js       공지 / 멤버 / 앨범 데이터
```

## 로컬 미리보기
저장소 폴더에서 `python3 -m http.server`를 실행한 뒤 http://localhost:8000/ 을 여세요.
