# API Documentation

Base URL: `http://localhost:3000` (or as configured in environment)

## Authentication (`/auth`)

### Login
- **Method:** `POST`
- **Endpoint:** `/auth/login`
- **Description:**  Authenticate user and receive access token.
- **Request Body:**
    - `username`: string (required)
    - `password`: string (required, min 8 chars)

### Logout
- **Method:** `POST`
- **Endpoint:** `/auth/logout`
- **Description:** Logout and clear access token cookie.
- **Authorization:** Bearer Token (JWT)

---

## Admins (`/admin`)

### Get Profile
- **Method:** `GET`
- **Endpoint:** `/admin/profile`
- **Authorization:** Bearer Token (JWT)

### Get Dashboard
- **Method:** `GET`
- **Endpoint:** `/admin/dashboard`
- **Authorization:** Bearer Token (JWT)

### Update Profile
- **Method:** `PUT`
- **Endpoint:** `/admin/profile`
- **Description:** Update admin profile name and photo.
- **Authorization:** Bearer Token (JWT)
- **Request Body (Multipart/Form-Data):**
    - `name`: string (required)
    - `photo`: file (optional, image)

---

## Agenda (`/admin/agenda`)

### Create Agenda
- **Method:** `POST`
- **Endpoint:** `/admin/agenda`
- **Authorization:** Bearer Token (JWT)
- **Request Body:**
    - `activity_name`: string (required)
    - `date`: string (date YYYY-MM-DD, required)
    - `time`: string (string, required, e.g., "09:00 - 12:00")
    - `location`: string (required)
    - `effective_date`: string (optional)

### Get All Agendas
- **Method:** `GET`
- **Endpoint:** `/admin/agenda`
- **Query Params:**
    - `page`: number (default 1)
    - `limit`: number (default 10)

### Get One Agenda
- **Method:** `GET`
- **Endpoint:** `/admin/agenda/:id`

### Update Agenda
- **Method:** `PUT`
- **Endpoint:** `/admin/agenda/:id`
- **Authorization:** Bearer Token (JWT)
- **Request Body:** Same as Create Agenda (Partial Update)

### Delete Agenda
- **Method:** `DELETE`
- **Endpoint:** `/admin/agenda/:id`
- **Authorization:** Bearer Token (JWT)

---

## Album (`/admin/album`)

### Create Album
- **Method:** `POST`
- **Endpoint:** `/admin/album`
- **Authorization:** Bearer Token (JWT)
- **Request Body:**
    - `album_title`: string (required)
    - `description`: string (optional)
    - `album_cover`: string (optional)
    - `photo_ids`: array of strings (optional)

### Get All Albums
- **Method:** `GET`
- **Endpoint:** `/admin/album`
- **Query Params:**
    - `page`: number
    - `limit`: number

### Get One Album
- **Method:** `GET`
- **Endpoint:** `/admin/album/:id`

### Update Album
- **Method:** `PUT`
- **Endpoint:** `/admin/album/:id`
- **Authorization:** Bearer Token (JWT)
- **Request Body:** Partial update

### Delete Album
- **Method:** `DELETE`
- **Endpoint:** `/admin/album/:id`
- **Authorization:** Bearer Token (JWT)

---

## Banner (`/admin/banner`)

### Create Banner
- **Method:** `POST`
- **Endpoint:** `/admin/banner`
- **Authorization:** Bearer Token (JWT)
- **Request Body (Multipart/Form-Data):**
    - `image`: file (required)
    - `image_path`: string (optional)
    - `description`: string (optional)
    - `is_publish`: boolean (optional)

### Get All Banners
- **Method:** `GET`
- **Endpoint:** `/admin/banner`
- **Authorization:** Bearer Token (JWT)

### Get One Banner
- **Method:** `GET`
- **Endpoint:** `/admin/banner/:id`
- **Authorization:** Bearer Token (JWT)

### Update Banner
- **Method:** `PUT`
- **Endpoint:** `/admin/banner/:id`
- **Authorization:** Bearer Token (JWT)
- **Request Body (Multipart/Form-Data):**
    - `image`: file (optional)
    - Other fields from Create Banner

### Delete Banner
- **Method:** `DELETE`
- **Endpoint:** `/admin/banner/:id`
- **Authorization:** Bearer Token (JWT)

---

## Gallery (`/admin/gallery`)

### Create Gallery Image
- **Method:** `POST`
- **Endpoint:** `/admin/gallery`
- **Authorization:** Bearer Token (JWT)
- **Request Body (Multipart/Form-Data):**
    - `image`: file (required)
    - `image_title`: string (required)
    - `description`: string (optional)
    - `album_id`: string (optional)

### Get All Gallery Images
- **Method:** `GET`
- **Endpoint:** `/admin/gallery`
- **Query Params:**
    - `page`: number
    - `limit`: number
    - `no_album`: boolean (true/false)
    - `album_id`: string

### Update Gallery Album Association
- **Method:** `PUT`
- **Endpoint:** `/admin/gallery/album`
- **Authorization:** Bearer Token (JWT)
- **Request Body:**
    - `photo_ids`: array of strings
    - `album_id`: string

### Delete Gallery Image
- **Method:** `DELETE`
- **Endpoint:** `/admin/gallery/:id`
- **Authorization:** Bearer Token (JWT)

---

## News (`/admin/news`)

### Create News
- **Method:** `POST`
- **Endpoint:** `/admin/news`
- **Authorization:** Bearer Token (JWT)
- **Request Body (Multipart/Form-Data):**
    - `image`: file (required)
    - `username`: string (required)
    - `title`: string (required)
    - `content`: string (required)
    - `day`: string (required)
    - `date`: date string (required)
    - `clock`: string (required)

### Get All News
- **Method:** `GET`
- **Endpoint:** `/admin/news`
- **Query Params:**
    - `page`: number
    - `limit`: number
    - `search`: string

### Get One News
- **Method:** `GET`
- **Endpoint:** `/admin/news/:id`

### Update News
- **Method:** `PUT`
- **Endpoint:** `/admin/news/:id`
- **Authorization:** Bearer Token (JWT)
- **Request Body (Multipart/Form-Data):**
    - `image`: file (optional)
    - Other fields from Create News

### Delete News
- **Method:** `DELETE`
- **Endpoint:** `/admin/news/:id`
- **Authorization:** Bearer Token (JWT)

---

## Reviews (`/reviews`)

### Submit Review (Public)
- **Method:** `POST`
- **Endpoint:** `/reviews`
- **Request Body:**
    - `username`: string (optional)
    - `message`: string (required)
    - `category`: string (enum, required)

### Get Reviews (Admin)
- **Method:** `GET`
- **Endpoint:** `/reviews/admin`
- **Authorization:** Bearer Token (JWT)
- **Query Params:**
    - `page`: number
    - `limit`: number
    - `category`: string

### Update Review Status
- **Method:** `PUT`
- **Endpoint:** `/reviews/admin/:id/status`
- **Authorization:** Bearer Token (JWT)
- **Request Body:**
    - `is_publish`: boolean

---

## Video (`/admin/video`)

### Create Video
- **Method:** `POST`
- **Endpoint:** `/admin/video`
- **Authorization:** Bearer Token (JWT)
- **Request Body (Multipart/Form-Data):**
    - `video_file`: file (optional, if upload)
    - `video_title`: string (required)
    - `video_desc`: string (optional)
    - `embed_url`: string (optional, if embed)
    - `is_embed`: boolean (required)

### Get All Videos
- **Method:** `GET`
- **Endpoint:** `/admin/video`
- **Authorization:** Bearer Token (JWT)
- **Query Params:**
    - `page`: number
    - `limit`: number

### Delete Video
- **Method:** `DELETE`
- **Endpoint:** `/admin/video/:id`
- **Authorization:** Bearer Token (JWT)
