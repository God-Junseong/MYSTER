/*
 * MYSTER 사이트 콘텐츠
 * ------------------------------------------------------------
 * 공지, 멤버, 갤러리 내용은 이 파일만 고치면 됩니다.
 * 사진은 assets/img/ 아래에 같은 파일명으로 넣으면 자동으로 표시됩니다.
 */
window.MYSTER = {
  /* 공지사항: 위에 있을수록 최신 글입니다. 번호(No.)는 자동으로 매겨집니다. */
  notices: [
    {
      id: 'web',
      title: 'MYSTER 홈페이지를 오픈했습니다',
      date: '2026.11.22',
      body: '미팅 소식, 멤버, 사진을 이곳에서 확인하실 수 있습니다.',
    },
  ],

  /* 교수진: photo는 assets/img/ 기준 경로, home/orcid는 링크 주소입니다. */
  members: [
    { name: '이름, Ph.D.', affiliation: '소속 대학교', photo: 'members/prof-1.jpg', home: '#', orcid: '#' },
    { name: '이름, Ph.D.', affiliation: '소속 대학교', photo: 'members/prof-2.jpg', home: '#', orcid: '#' },
    { name: '이름, Ph.D.', affiliation: '소속 대학교', photo: 'members/prof-3.jpg', home: '#', orcid: '#' },
    { name: '이름, Ph.D.', affiliation: '소속 대학교', photo: 'members/prof-4.jpg', home: '#', orcid: '#' },
  ],

  /* 갤러리 앨범: 위에 있을수록 최신 앨범입니다.
     홈 화면 미리보기는 첫 앨범의 1·2번 사진, 둘째 앨범의 1번 사진을 씁니다. */
  albums: [
    {
      key: '2412',
      date: '2024.12',
      title: 'MYSTER 미팅',
      photos: ['gallery/2412-1.jpg', 'gallery/2412-2.jpg', 'gallery/2412-3.jpg'],
    },
    {
      key: '2206',
      date: '2022.06',
      title: 'MYSTER 첫 미팅',
      photos: ['gallery/2206-1.jpg', 'gallery/2206-2.jpg', 'gallery/2206-3.jpg'],
    },
  ],
};
