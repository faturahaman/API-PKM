# Analisis Mendalam & Low-Level Arsitektur Server (NestJS)

Dokumen ini membedah cara kerja server hingga ke level konsep arsitektur, siklus hidup request, dan eksekusi kode di balik layar.

---

## 1. Core Concept: Dependency Injection (DI) & Inversion of Control (IoC)

Di `agenda.controller.ts`, Anda melihat ini:
```typescript
constructor(private readonly agendaService: AgendaService) {}
```
**Apa yang sebenarnya terjadi di sini?**
Ini bukan sekadar parameter fungsi biasa. Ini adalah **Dependency Injection**.
1.  **IoC Container**: NestJS memiliki "wadah" raksasa (Container) saat aplikasi start (`bootstrap()`).
2.  **Registration**: Saat `AgendaModule` di-load, NestJS mencatat: "Saya punya `AgendaService`".
3.  **Resolution**: Saat request masuk dan butuh `AgendaController`, NestJS melihat konstruktornya. "Oh, dia butuh `AgendaService`".
4.  **Injection**: NestJS mencari *instance* `AgendaService` yang sudah dibuat di memori, lalu menyuntikkannya ke Controller.
    *   *Low-level benefit*: Hemat memori (Singleton pattern - hanya 1 instance service untuk seluruh aplikasi) dan mudah dites (bisa diganti mock items).

---

## 2. Request Lifecycle (Siklus Hidup Permintaan)

Saat user klik "Simpan Agenda", data mengalir melewati lapisan-lapisan ini secara berurutan:

1.  **Incoming Request (HTTP)**: Paket data TCP masuk ke port 3002.
2.  **Middleware (Express Layer)**: `cors`, `body-parser`. Mengubah raw bits menjadi objek JSON JavaScript.
3.  **Guards (`@UseGuards`)**:
    *   **Low-Level**: Kode ini mengeksekusi `canActivate()`.
    *   Mengecek header `Authorization: Bearer <token>`.
    *   Memecah token JWT, memverifikasi tanda tangan kriptografi (Signature) menggunakan `JWT_SECRET`.
    *   Jika gagal: Langsung return `401 Unauthorized` (Controller tidak pernah disentuh).
4.  **Interceptors (Pre-Controller)**: Bisa memanipulasi data *sebelum* masuk controller.
5.  **Pipes (`ValidationPipe`)**:
    *   Disinilah **DTO** bekerja. Library `class-transformer` mengubah JSON polos menjadi instance Class `CreateAgendaDto`.
    *   Library `class-validator` mengecek metadata `@IsString()`, `@IsNotEmpty()`.
    *   Jika salah satu properti invalid, Pipe melempar `400 Bad Request` dan memutus aliran.
6.  **Controller (Method Handler)**: Akhirnya, fungsi `create()` Anda dipanggil.
7.  **Service**: Logika bisnis & interaksi DB.
8.  **Interceptors (Post-Controller)**: Memformat response sebelum dikirim balik.
9.  **Exception Filters**: Menangkap error (misal `NotFoundException`) dan memformatnya jadi JSON error yang rapi.

---

## 3. Bedah Syntax & Metadata (Reflection)

### `@Controller`, `@Get`, `@Post`
Syntax dengan awalan `@` adalah **Decorators**.
*   **Konsep**: Di TypeScript, decorator adalah sebuah *fungsi yang membungkus class/fungsi lain*.
*   **Low-Level**: Saat aplikasi di-compile, `@Get('agenda')` tidak mengubah cara kerja fungsi secara drastis, tapi dia **menempelkan metadata** ke fungsi tersebut.
*   **Reflection**: NestJS membaca metadata ini saat startup: "Fungsi `findAll` dilabeli `@Get`, berarti kalau ada request GET ke `/agenda`, jalankan fungsi ini."

### `async` dan `await`
```typescript
async findAll() {
  return await this.agendaModel.find();
}
```
*   **Event Loop**: Node.js itu *Single Threaded*. Dia cuma punya 1 tangan untuk kerja.
*   **Non-Blocking I/O**: Saat kode menyentuh database (`.find()`), Node.js tidak diam menunggu data diambil (yang bisa makan waktu 50ms - lambat bagi CPU).
*   **Promise**: Node.js melempar tugas ke Thread Pool (C++ level) dan lanjut mengerjakan request orang lain.
*   **Await**: Saat data DB siap, kode akan "bangun" lagi dan lanjut ke baris berikutnya. Ini membuat server bisa menangani ribuan request/detik meski cuma 1 thread.

---

## 4. Bedah Model & Mongoose (`schema`)

```typescript
@Prop({ required: true })
activity_name: string;
```
*   **Object Mapping (ODM)**: JavaScript taunya Object, MongoDB taunya BSON (Binary JSON). Mongoose bertugas menerjemahkan ini.
*   **Virtuals & Hooks**: Middleware database. Misalnya sebelum save, kita bisa set "hash password".
*   **PaginateModel**: Plugin tambahan yang membungkus query count (hitung total data) dan query limit (ambil sebagian data) dalam satu perintah efisien.

---

## 5. Studi Kasus Code: Update Agenda

```typescript
@Put(':id') // 1. Mapping URL params
update(@Param('id') id: string, @Body() updateData: UpdateAgendaDto) {
  // 2. JS Prototype Chain: updateData mewarisi sifat CreateAgendaDto via PartialType
  return this.agendaService.update(id, updateData);
}

// Service Lanjutan
async update(id: string, updateData: UpdateAgendaDto) {
  // 3. atomic operation: findByIdAndUpdate adalah operasi atomik di MongoDB.
  // { new: true } memaksa Mongo mengembalikan dokumen SETELAH diedit, bukan sebelumnya.
  const result = await this.agendaModel.findByIdAndUpdate(id, { $set: updateData }, { new: true });
}
```

---

## Kesimpulan Level
1.  **Level 1 (Code)**: Apa yang Anda tulis (Controller, Service).
2.  **Level 2 (Framework - NestJS)**: DI Container, Decorator Metadata, Guards, Pipes.
3.  **Level 3 (Runtime - Node.js)**: Event Loop, V8 Engine, Async/Promise.
4.  **Level 4 (Network/OS)**: TCP/IP, Thread Pool, Syscalls.

Dokumen ini fokus menjelaskan interaksi antara **Level 1** dan **Level 2** agar Anda paham "Magic" di balik NestJS.
