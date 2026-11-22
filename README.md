# MYSTER

Multidisciplinary Young Scientists Talk Exposure-Response — https://god-junseong.github.io/MYSTER/

빌드 단계 없는 정적 사이트입니다(HTML + CSS + 바닐라 JS).

## 내용 고치기
- **공지 · 멤버 · 갤러리**: `data/content.js`만 고치면 됩니다.
- **About · Contact 문구, 홈 히어로 문구**: `index.html`에서 직접 고칩니다.
- **사진**: 아래 파일명으로 `assets/img/`에 넣으면 바로 표시됩니다(없으면 빈 회색 박스).
  - `hero.jpg`
  - `members/prof-1.jpg` … `prof-4.jpg`
  - `gallery/2412-1.jpg` … `2412-3.jpg`, `gallery/2206-1.jpg` … `2206-3.jpg`

## 구조
```
index.html            해시 라우팅 (#home, #about, #members, #notice, #gallery, #contact)
assets/css/style.css
assets/js/main.js     라우팅 + 공지 펼치기 + 갤러리 앵커 스크롤
data/content.js       공지 / 멤버 / 앨범 데이터
```

## 로컬 미리보기
`index.html`을 브라우저로 바로 열거나 `python3 -m http.server`로 띄우세요.
