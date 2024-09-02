KWEB 면제 과제 실행 방법

1. git clone https://github.com/19jyun/web_proj 을 통해 해당 레포지토리에 있는 프로젝트를 클론

2. git-bash 또는 다른 command line을 통해 npm install (package.json에 명시되어 있는 의존성을 한번에 설치)

3. Database 폴더 내에 있는 generate_tables.sql에 명시되어 있는 sql 쿼리를 실행 / 아래 두 가지 방식 중 하나를 택해서 실행하시면 됩니다.
    3.1.1 MySQL Workbench 실행
    3.1.2 File > New Query Tab
    3.1.3 SQL 스크립트 붙여넣기
    3.1.4 스크립트 실행

    3.2.1 MySQL에 접속
    3.2.2 SOURCE ~~database\generate_tables.sql; 를 통해 스크립트 실행

4(optional). 이미 생성되어 있는 데이터를 사용하고 싶을시, backup.sql 파일을 사용하시면 됩니다.
    4.1.1 MySQL Workbench를 열고 데이터베이스에 연결
    4.1.2 Server > Data Import
    4.1.3 ~~database\backup.sql 선택
    4.1.4 복원할 스키마(blackboard) 선택
    4.1.5 Start Import를 클릭하여 복원 프로세스 시작

5. root directory로 이동 후 node app.js 실행

6. URL에 localhost:3000 입력 후 이동

___________________________________

생성되어 있는 데이터 (로그인 및 테스트의 용이함을 위해 ID와 PW 모두 통일했습니다)

학생1: qw
학생2: qwe
학생3: qwer

교수1: as
교수2: asd
교수3: asdf