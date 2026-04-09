# Docker Quickstart Cho Nguoi Moi Clone Do An

Tai lieu nay huong dan chay do an Express TypeScript + MongoDB bang Docker sau khi vua clone repo.

## 1. Yeu cau truoc khi chay

- Da cai Docker Desktop (macOS/Windows) hoac Docker Engine (Linux).
- Lenh dung trong tai lieu la `docker compose` (khong phai `docker-compose`).

Kiem tra nhanh:

```bash
docker --version
docker compose version
```

## 2. Sau khi clone, can chuan bi gi

Tu thu muc goc du an:

```bash
cp .env.docker.example .env.docker
```

Mo file `.env.docker` va thay 2 bien bat buoc:

- `JWT_SECRET_ACCESS`
- `JWT_SECRET_REFRESH`

Luu y quan trong:

- `MONGO_URI` phai la dia chi trong Docker network, khong dung `127.0.0.1`.
- Gia tri hien tai dung duoc trong du an nay: `mongodb://express-tsproject-mongo:27017/minishop`.

## 3. Chay du an bang Docker

Build va start toan bo stack:

```bash
docker compose up -d --build
```

Kiem tra container:

```bash
docker compose ps
```

Xem log app:

```bash
docker compose logs -f app
```

Neu thanh cong, log app se co dang:

```text
Server running on port 8000
Connected to express-tsproject-mongo:27017
```

## 4. Truy cap dich vu

- API: http://localhost:8000
- MongoDB: localhost:27017

## 5. Lenh dung thuong xuyen

Dung stack:

```bash
docker compose down
```

Dung stack va xoa luon data Mongo volume:

```bash
docker compose down -v
```

Build lai rieng app image:

```bash
docker compose build app
```

Restart rieng app:

```bash
docker compose restart app
```

Xem cau hinh compose da resolve:

```bash
docker compose config
```

## 6. Loi thuong gap va cach sua

1. `docker-compose: command not found`

- Su dung lenh moi: `docker compose ...`
- Khong su dung lenh cu: `docker-compose ...`

2. App khong ket noi duoc MongoDB

- Kiem tra `MONGO_URI` trong `.env.docker`.
- Kiem tra mongo da healthy: `docker compose ps`.
- Kiem tra log app: `docker compose logs app --tail=100`.

3. App bao thieu bien JWT

- Dien gia tri that cho `JWT_SECRET_ACCESS` va `JWT_SECRET_REFRESH` trong `.env.docker`.

4. Trung port 8000 hoac 27017

- Doi `PORT` hoac `MONGO_PORT` trong `.env.docker`.
- Chay lai: `docker compose up -d --build`.

## 7. Quy uoc cho team

- Commit file `.env.docker.example` de chia se mau bien.
- Khong commit file `.env.docker` vi chua secret that.
- Nguoi moi clone repo chi can:

```bash
cp .env.docker.example .env.docker
docker compose up -d --build
```
