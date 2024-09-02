# KWEB 면제 과제 실행 방법

이 프로젝트를 실행하기 위해서는 Node.js와 MySQL이 설치되어 있어야 합니다. 이 가이드는 윈도우 환경에 맞춰 작성되었습니다.

- [Node.js 다운로드](https://nodejs.org/en)
- [MySQL Installer 다운로드](https://dev.mysql.com/downloads/installer/)

### MySQL Installer 사용하여 설치 시:
MySQL Installer를 사용하여 다음 세 가지를 설치:
1. **MySQL Server** (8.0.39)
2. **MySQL Workbench** (8.0.38)
3. **Samples and Examples** (8.0.39)

MySQL Server 설정 시, 기본 설정을 사용하고, Authentication Method만 레거시 모드로 진행합니다.
- **Windows Service Name:** mysql2
- **Root Password:** qwer

(이미 설정이 되어 있다면, `.env` 파일을 수정하여 사용할 수 있습니다.)

## 프로젝트 실행 방법

1. **프로젝트 클론**
    - 터미널에서 다음 명령어를 사용하여 프로젝트를 클론합니다:
      ```bash
      git clone https://github.com/19jyun/web_proj
      ```

2. **의존성 설치**
    - 클론한 프로젝트 폴더로 이동한 후, 다음 명령어로 의존성을 설치합니다:
      ```bash
      npm install
      ```
    - 추가적으로, `dotenv` 패키지도 설치해야 합니다:
      ```bash
      npm install dotenv
      ```

3. **데이터베이스 설정**
    - `database` 폴더 내에 있는 `generate_tables.sql` 파일을 사용하여 데이터베이스를 설정합니다. 아래 두 가지 방법 중 하나를 선택하세요:
      
    **방법 1: MySQL Workbench를 통한 실행**
    1. MySQL Workbench를 실행합니다.
    2. `File > New Query Tab`을 선택합니다.
    3. `generate_tables.sql` 파일의 내용을 복사하여 붙여넣습니다.
    4. 쿼리를 실행합니다.

    **방법 2: MySQL CLI를 통한 실행**
    1. MySQL에 접속합니다.
    2. 다음 명령어로 스크립트를 실행합니다:
       ```sql
       SOURCE path\to\database\generate_tables.sql;
       ```

4. **데이터 복원 (선택 사항)**
    - 이미 생성된 데이터를 사용하려면, `backup.sql` 파일을 사용하여 데이터를 복원할 수 있습니다:
    
    **MySQL Workbench에서 복원**
    1. MySQL Workbench를 실행하고, 데이터베이스에 연결합니다.
    2. `Server > Data Import`를 선택합니다.
    3. `backup.sql` 파일을 선택합니다.
    4. 복원할 스키마(예: `blackboard`)를 선택합니다.
    5. `Start Import` 버튼을 클릭하여 복원 프로세스를 시작합니다.

5. **프로젝트 실행**
    - 프로젝트의 루트 디렉토리로 이동한 후, 다음 명령어로 서버를 실행합니다:
      ```bash
      node app.js
      ```

6. **웹 애플리케이션 접속**
    - 브라우저에서 [http://localhost:3000](http://localhost:3000)을 입력하여 접속합니다.

## 생성된 데이터 정보 (로그인 및 테스트용)

모든 계정의 ID와 비밀번호는 동일하게 설정되어 있습니다.

### 학생 계정
- **학생1:** ID: `qw`, PW: `qw`
- **학생2:** ID: `qwe`, PW: `qwe`
- **학생3:** ID: `qwer`, PW: `qwer`

### 교수 계정
- **교수1:** ID: `as`, PW: `as`
- **교수2:** ID: `asd`, PW: `asd`
- **교수3:** ID: `asdf`, PW: `asdf`
