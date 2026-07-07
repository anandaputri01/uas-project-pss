<?php

namespace App\Swagger;

/**
 * @OA\Info(
 *     title="HelmetWash API",
 *     version="1.0.0",
 *     description="REST API HelmetWash yang sinkron dengan model layanan, outlet, pesanan, dan riwayat status pada database.",
 *     @OA\Contact(name="HelmetWash Support", email="admin@helmetwash.test"),
 *     @OA\License(name="MIT", url="https://opensource.org/licenses/MIT")
 * )
 * @OA\Server(url=L5_SWAGGER_CONST_HOST, description="HelmetWash API Server")
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Masukkan token JWT yang didapat dari POST /api/login"
 * )
 * @OA\Tag(name="Auth", description="Autentikasi admin")
 * @OA\Tag(name="Catalog", description="Data katalog layanan, addon, dan opsi pengiriman")
 * @OA\Tag(name="Services", description="Manajemen paket layanan")
 * @OA\Tag(name="Outlets", description="Informasi lokasi outlet")
 * @OA\Tag(name="Orders", description="Pembuatan dan pemantauan pesanan")
 * @OA\Tag(name="Reports", description="Ringkasan laporan admin")
 *
 * @OA\Schema(
 *     schema="Service",
 *     type="object",
 *     @OA\Property(property="id", type="string", example="basic"),
 *     @OA\Property(property="name", type="string", example="Paket Basic"),
 *     @OA\Property(property="price", type="integer", example=25000),
 *     @OA\Property(property="desc", type="string", example="Cuci luar dalam + pengeringan"),
 *     @OA\Property(property="features", type="array", @OA\Items(type="string", example="Cuci busa"))
 * )
 * @OA\Schema(
 *     schema="Outlet",
 *     type="object",
 *     @OA\Property(property="name", type="string", example="HelmetWash Pusat"),
 *     @OA\Property(property="address", type="string", example="Jl. Raya No. 1, Jakarta"),
 *     @OA\Property(property="lat", type="number", format="float", example=-6.200000),
 *     @OA\Property(property="lng", type="number", format="float", example=106.816666)
 * )
 * @OA\Schema(
 *     schema="Order",
 *     type="object",
 *     @OA\Property(property="id", type="string", example="ORD-12345"),
 *     @OA\Property(property="customerName", type="string", example="Budi Santoso"),
 *     @OA\Property(property="phone", type="string", example="08123456789"),
 *     @OA\Property(property="serviceId", type="string", example="basic"),
 *     @OA\Property(property="serviceName", type="string", example="Paket Basic"),
 *     @OA\Property(property="addons", type="array", @OA\Items(type="string", example="antijamur")),
 *     @OA\Property(property="deliveryId", type="string", example="pickup"),
 *     @OA\Property(property="deliveryName", type="string", example="Pick-up & Delivery"),
 *     @OA\Property(property="address", type="string", example="Jl. Melati No. 5"),
 *     @OA\Property(property="priceBase", type="integer", example=25000),
 *     @OA\Property(property="priceAddons", type="integer", example=5000),
 *     @OA\Property(property="priceDelivery", type="integer", example=10000),
 *     @OA\Property(property="totalPrice", type="integer", example=40000),
 *     @OA\Property(property="status", type="string", example="Diterima"),
 *     @OA\Property(property="date", type="string", format="date-time", example="2026-07-02T10:30:00.000Z"),
 *     @OA\Property(property="payment", type="object", @OA\Property(property="method", type="string", example="qris"), @OA\Property(property="status", type="string", example="paid")),
 *     @OA\Property(property="history", type="array", @OA\Items(type="object", @OA\Property(property="status", type="string", example="Diterima"), @OA\Property(property="date", type="string", format="date-time", example="2026-07-02T10:30:00.000Z")))
 * )
 */
class ApiV1
{
    /**
     * @OA\Post(
     *     path="/api/login",
     *     tags={"Auth"},
     *     summary="Login admin",
     *     description="Login menggunakan username atau email dan password. Mengembalikan JWT Bearer Token.",
     *     operationId="login",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"username","password"},
     *             @OA\Property(property="username", type="string", example="admin"),
     *             @OA\Property(property="password", type="string", format="password", example="password123")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Login berhasil", @OA\JsonContent(
     *         @OA\Property(property="token", type="string", example="eyJ..."),
     *         @OA\Property(property="token_type", type="string", example="bearer"),
     *         @OA\Property(property="expires_in", type="integer", example=3600),
     *         @OA\Property(property="user", type="object", @OA\Property(property="name", type="string", example="Admin"), @OA\Property(property="role", type="string", example="admin")))
     *     ),
     *     @OA\Response(response=422, description="Kredensial tidak valid", @OA\JsonContent(
     *         @OA\Property(property="message", type="string", example="Login gagal. Periksa username dan password."),
     *         @OA\Property(property="errors", type="object")
     *     ))
     * )
     */
    public function login(): void
    {
    }

    /**
     * @OA\Get(
     *     path="/api/me",
     *     tags={"Auth"},
     *     summary="Profil user yang sedang login",
     *     description="Mengembalikan data user yang sedang terautentikasi.",
     *     operationId="me",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Data user berhasil didapat", @OA\JsonContent(
     *         @OA\Property(property="authenticated", type="boolean", example=true),
     *         @OA\Property(property="user", type="object", @OA\Property(property="name", type="string", example="Admin"), @OA\Property(property="role", type="string", example="admin")))
     *     ),
     *     @OA\Response(response=401, description="Tidak terautentikasi")
     * )
     */
    public function me(): void
    {
    }

    /**
     * @OA\Post(
     *     path="/api/logout",
     *     tags={"Auth"},
     *     summary="Logout admin",
     *     description="Mengakhiri sesi JWT yang sedang dipakai.",
     *     operationId="logout",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Logout berhasil", @OA\JsonContent(@OA\Property(property="message", type="string", example="Logged out"))),
     *     @OA\Response(response=401, description="Tidak terautentikasi")
     * )
     */
    public function logout(): void
    {
    }

    /**
     * @OA\Post(
     *     path="/api/refresh",
     *     tags={"Auth"},
     *     summary="Refresh JWT token",
     *     description="Menghasilkan token baru untuk sesi yang sedang aktif.",
     *     operationId="refresh",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Token berhasil diperbarui", @OA\JsonContent(
     *         @OA\Property(property="token", type="string", example="eyJ..."),
     *         @OA\Property(property="token_type", type="string", example="bearer"),
     *         @OA\Property(property="expires_in", type="integer", example=3600)
     *     )),
     *     @OA\Response(response=401, description="Token tidak valid atau sudah expired")
     * )
     */
    public function refresh(): void
    {
    }

    /**
     * @OA\Get(
     *     path="/api/catalog",
     *     tags={"Catalog"},
     *     summary="Ambil data katalog",
     *     description="Mengembalikan data katalog yang berasal dari konfigurasi aplikasi dan digunakan untuk form pemesanan.",
     *     operationId="getCatalog",
     *     @OA\Response(response=200, description="Data katalog berhasil didapat", @OA\JsonContent(
     *         @OA\Property(property="addons", type="array", @OA\Items(type="object", @OA\Property(property="id", type="string", example="antijamur"), @OA\Property(property="name", type="string", example="Anti Jamur & Bakteri"), @OA\Property(property="price", type="integer", example=10000))),
     *         @OA\Property(property="deliveryOptions", type="array", @OA\Items(type="object", @OA\Property(property="id", type="string", example="pickup"), @OA\Property(property="name", type="string", example="Pick-up & Delivery"), @OA\Property(property="price", type="integer", example=10000))),
     *         @OA\Property(property="orderSteps", type="array", @OA\Items(type="string", example="Diterima"))
     *     ))
     * )
     */
    public function catalog(): void
    {
    }

    /**
     * @OA\Get(
     *     path="/api/services",
     *     tags={"Services"},
     *     summary="Daftar layanan",
     *     description="Mengambil semua layanan yang tersimpan di tabel services.",
     *     operationId="getServices",
     *     @OA\Response(response=200, description="Daftar layanan berhasil didapat", @OA\JsonContent(
     *         @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Service"))
     *     ))
     * )
     */
    public function services(): void
    {
    }

    /**
     * @OA\Put(
     *     path="/api/admin/services",
     *     tags={"Services"},
     *     summary="Sinkronisasi layanan (Admin)",
     *     description="Memperbarui daftar layanan dari payload yang dikirim admin dan menyimpan ke tabel services.",
     *     operationId="syncServices",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"services"},
     *             @OA\Property(property="services", type="array", @OA\Items(type="object", required={"id","name","price"}, @OA\Property(property="id", type="string", example="basic"), @OA\Property(property="name", type="string", example="Paket Basic"), @OA\Property(property="price", type="integer", example=25000), @OA\Property(property="desc", type="string", nullable=true, example="Cuci luar dalam"), @OA\Property(property="features", type="array", nullable=true, @OA\Items(type="string", example="Cuci busa"))))
     *         )
     *     ),
     *     @OA\Response(response=200, description="Layanan berhasil disinkronisasi", @OA\JsonContent(
     *         @OA\Property(property="message", type="string", example="Perubahan layanan disimpan"),
     *         @OA\Property(property="services", type="array", @OA\Items(ref="#/components/schemas/Service"))
     *     )),
     *     @OA\Response(response=401, description="Tidak terautentikasi"),
     *     @OA\Response(response=422, description="Validasi gagal")
     * )
     */
    public function syncServices(): void
    {
    }

    /**
     * @OA\Put(
     *     path="/api/admin/addons",
     *     tags={"Catalog"},
     *     summary="Sinkronisasi tambahan layanan (Admin)",
     *     description="Memperbarui seluruh daftar tambahan layanan. Yang tidak disertakan akan dihapus.",
     *     operationId="syncAddons",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"addons"},
     *             @OA\Property(
     *                 property="addons",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     required={"id","name","price"},
     *                     @OA\Property(property="id", type="string", example="antijamur"),
     *                     @OA\Property(property="name", type="string", example="Anti Jamur & Bakteri"),
     *                     @OA\Property(property="price", type="integer", example=10000)
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response=200, description="Tambahan layanan berhasil disinkronisasi"),
     *     @OA\Response(response=401, description="Tidak terautentikasi"),
     *     @OA\Response(response=422, description="Validasi gagal")
     * )
     */
    public function syncAddons(): void
    {
    }

    /**
     * @OA\Get(
     *     path="/api/outlets",
     *     tags={"Outlets"},
     *     summary="Daftar outlet",
     *     description="Mengambil seluruh data outlet yang tersimpan di tabel outlets.",
     *     operationId="getOutlets",
     *     @OA\Response(response=200, description="Daftar outlet berhasil didapat", @OA\JsonContent(
     *         @OA\Property(property="outlets", type="array", @OA\Items(ref="#/components/schemas/Outlet"))
     *     ))
     * )
     */
    public function outlets(): void
    {
    }

    /**
     * @OA\Get(
     *     path="/api/admin/orders",
     *     tags={"Orders"},
     *     summary="Semua pesanan (Admin)",
     *     description="Mengambil seluruh pesanan yang tersimpan di tabel orders beserta riwayat status.",
     *     operationId="getAllOrders",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Daftar pesanan berhasil didapat", @OA\JsonContent(
     *         @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Order"))
     *     )),
     *     @OA\Response(response=401, description="Tidak terautentikasi")
     * )
     */
    public function adminOrders(): void
    {
    }

    /**
     * @OA\Get(
     *     path="/api/admin/orders/{code}",
     *     tags={"Orders"},
     *     summary="Lihat detail pesanan (Admin)",
     *     description="Mengambil detail pesanan lengkap beserta riwayat status dan pembayarannya. Endpoint ini dilindungi (butuh autentikasi admin).",
     *     operationId="adminGetOrder",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="code", in="path", required=true, description="Kode pesanan", @OA\Schema(type="string", example="ORD-12345")),
     *     @OA\Response(response=200, description="Detail pesanan berhasil didapat", @OA\JsonContent(
     *         @OA\Property(property="order", ref="#/components/schemas/Order")
     *     )),
     *     @OA\Response(response=401, description="Tidak terautentikasi"),
     *     @OA\Response(response=404, description="Pesanan tidak ditemukan")
     * )
     */
    public function adminGetOrder(): void
    {
    }

    /**
     * @OA\Post(
     *     path="/api/orders",
     *     tags={"Orders"},
     *     summary="Buat pesanan baru",
     *     description="Menyimpan pesanan ke tabel orders dan membuat riwayat status awal.",
     *     operationId="createOrder",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"customerName","phone","serviceId","deliveryId","paymentMethod"},
     *             @OA\Property(property="customerName", type="string", example="Budi Santoso"),
     *             @OA\Property(property="phone", type="string", example="08123456789"),
     *             @OA\Property(property="serviceId", type="string", example="basic"),
     *             @OA\Property(property="addons", type="array", nullable=true, @OA\Items(type="string", example="antijamur")),
     *             @OA\Property(property="deliveryId", type="string", example="pickup"),
     *             @OA\Property(property="address", type="string", nullable=true, example="Jl. Melati No. 5"),
     *             @OA\Property(property="paymentMethod", type="string", example="qris")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Pesanan berhasil dibuat", @OA\JsonContent(
     *         @OA\Property(property="message", type="string", example="Pesanan berhasil dibuat"),
     *         @OA\Property(property="order", ref="#/components/schemas/Order")
     *     )),
     *     @OA\Response(response=422, description="Validasi gagal atau metode pengiriman tidak valid")
     * )
     */
    public function createOrder(): void
    {
    }

    /**
     * @OA\Get(
     *     path="/api/orders/{code}",
     *     tags={"Orders"},
     *     summary="Cek status pesanan",
     *     description="Mengambil detail pesanan berdasarkan kode pesanan yang tersimpan di tabel orders.",
     *     operationId="getOrder",
     *     @OA\Parameter(name="code", in="path", required=true, description="Kode pesanan", @OA\Schema(type="string", example="ORD-12345")),
     *     @OA\Response(response=200, description="Detail pesanan berhasil didapat", @OA\JsonContent(
     *         @OA\Property(property="order", ref="#/components/schemas/Order")
     *     )),
     *     @OA\Response(response=404, description="Pesanan tidak ditemukan", @OA\JsonContent(
     *         @OA\Property(property="message", type="string", example="Pesanan tidak ditemukan.")
     *     ))
     * )
     */
    public function getOrder(): void
    {
    }

    /**
     * @OA\Patch(
     *     path="/api/admin/orders/{code}/status",
     *     tags={"Orders"},
     *     summary="Update status pesanan (Admin)",
     *     description="Memperbarui status pesanan dan mencatat perubahan ke tabel order_status_histories.",
     *     operationId="updateOrderStatus",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="code", in="path", required=true, description="Kode pesanan", @OA\Schema(type="string", example="ORD-12345")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"status"},
     *             @OA\Property(property="status", type="string", enum={"Diterima","Dicuci","Selesai","Diantar"}, example="Dicuci")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Status pesanan diperbarui", @OA\JsonContent(
     *         @OA\Property(property="message", type="string", example="Status pesanan diperbarui"),
     *         @OA\Property(property="order", ref="#/components/schemas/Order")
     *     )),
     *     @OA\Response(response=401, description="Tidak terautentikasi"),
     *     @OA\Response(response=404, description="Pesanan tidak ditemukan"),
     *     @OA\Response(response=422, description="Validasi gagal")
     * )
     */
    public function updateOrderStatus(): void
    {
    }

    /**
     * @OA\Get(
     *     path="/api/admin/reports",
     *     tags={"Reports"},
     *     summary="Laporan dan statistik (Admin)",
     *     description="Mengembalikan ringkasan laporan berdasarkan data pesanan yang ada di database.",
     *     operationId="getReports",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Data laporan berhasil didapat", @OA\JsonContent(
     *         @OA\Property(property="summary", type="object", @OA\Property(property="totalOrders", type="integer", example=150), @OA\Property(property="totalRevenue", type="integer", example=7500000), @OA\Property(property="avgOrder", type="integer", example=50000)),
     *         @OA\Property(property="byService", type="array", @OA\Items(type="object", @OA\Property(property="count", type="integer", example=80), @OA\Property(property="revenue", type="integer", example=4000000), @OA\Property(property="name", type="string", example="Paket Premium"))),
     *         @OA\Property(property="byDelivery", type="array", @OA\Items(type="object", @OA\Property(property="id", type="string", example="pickup"), @OA\Property(property="count", type="integer", example=70))),
     *         @OA\Property(property="byStatus", type="array", @OA\Items(type="object", @OA\Property(property="status", type="string", example="Selesai"), @OA\Property(property="count", type="integer", example=120))),
     *         @OA\Property(property="addonUsage", type="array", @OA\Items(type="object", @OA\Property(property="id", type="string", example="antijamur"), @OA\Property(property="count", type="integer", example=45))),
     *         @OA\Property(property="byDate", type="array", @OA\Items(type="object", @OA\Property(property="date", type="string", format="date", example="2026-07-02"), @OA\Property(property="revenue", type="integer", example=350000))),
     *         @OA\Property(property="orders", type="array", @OA\Items(ref="#/components/schemas/Order"))
     *     )),
     *     @OA\Response(response=401, description="Tidak terautentikasi")
     * )
     */
    public function reports(): void
    {
    }
}