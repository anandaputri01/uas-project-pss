<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * @OA\Schema(
 *     schema="Order",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="code", type="string", example="ORD-12345"),
 *     @OA\Property(property="customerName", type="string", example="Budi Santoso"),
 *     @OA\Property(property="phone", type="string", example="08123456789"),
 *     @OA\Property(property="serviceName", type="string", example="Paket Premium"),
 *     @OA\Property(property="addons", type="array", @OA\Items(type="string", example="deodoran")),
 *     @OA\Property(property="deliveryName", type="string", example="Antar Jemput"),
 *     @OA\Property(property="address", type="string", example="Jl. Melati No. 5"),
 *     @OA\Property(property="priceBase", type="integer", example=50000),
 *     @OA\Property(property="priceAddons", type="integer", example=5000),
 *     @OA\Property(property="priceDelivery", type="integer", example=10000),
 *     @OA\Property(property="totalPrice", type="integer", example=65000),
 *     @OA\Property(property="status", type="string", example="Diterima", enum={"Diterima","Dicuci","Selesai","Diantar"}),
 *     @OA\Property(property="createdAt", type="string", format="date-time", example="2025-01-15T10:30:00Z")
 * )
 *
 * @OA\Schema(
 *     schema="Service",
 *     type="object",
 *     @OA\Property(property="id", type="string", example="basic"),
 *     @OA\Property(property="name", type="string", example="Paket Basic"),
 *     @OA\Property(property="price", type="integer", example=25000),
 *     @OA\Property(property="description", type="string", example="Cuci luar dalam"),
 *     @OA\Property(property="features", type="array", @OA\Items(type="string", example="Cuci busa"))
 * )
 */
class OrderController extends Controller
{
    /**
     * @OA\Get(
     *     path="/admin/orders",
     *     tags={"Orders"},
     *     summary="Semua pesanan (Admin)",
     *     description="Mengambil seluruh daftar pesanan, urut dari terbaru. Memerlukan autentikasi admin.",
     *     operationId="getAllOrders",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Daftar pesanan berhasil didapat",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(ref="#/components/schemas/Order")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=401, description="Tidak terautentikasi")
     * )
     */
    public function index(): AnonymousResourceCollection
    {
        $orders = Order::query()
            ->with(['service', 'histories', 'addonItems', 'payment'])
            ->latest()
            ->get();

        return OrderResource::collection($orders);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'customerName'  => ['required', 'string', 'max:255'],
            'phone'         => ['required', 'string', 'max:30'],
            'serviceId'     => ['required', 'string', 'exists:services,slug'],
            'addons'        => ['nullable', 'array'],
            'addons.*'      => ['string', 'exists:addons,slug'],
            'deliveryId'    => ['required', 'string'],
            'address'       => ['nullable', 'string'],
            'paymentMethod' => ['required', 'string'],
        ]);

        $service  = Service::query()->where('slug', $data['serviceId'])->firstOrFail();
        $delivery = collect(config('helmetwash.delivery_options'))->firstWhere('id', $data['deliveryId']);

        if (! $delivery) {
            return response()->json(['message' => 'Metode pengiriman tidak valid.'], 422);
        }

        // Calculate addons and their snapshot prices
        $addonSlugs = $data['addons'] ?? [];
        $addons = \App\Models\Addon::whereIn('slug', $addonSlugs)->get();
        $priceAddons = $addons->sum('price');
        $totalPrice = $service->price + $priceAddons + $delivery['price'];

        $order = Order::query()->create([
            'code'           => $this->generateOrderCode(),
            'customer_name'  => $data['customerName'],
            'phone'          => $data['phone'],
            'service_id'     => $service->id,
            'service_name'   => $service->name,
            'delivery_id'    => $delivery['id'],
            'delivery_name'  => $delivery['name'],
            'address'        => $data['address'] ?: '-',
            'price_base'     => $service->price,
            'price_delivery' => $delivery['price'],
            'total_price'    => $totalPrice,
            'status'         => 'Diterima',
        ]);

        // Attach addons to pivot
        foreach ($addons as $addon) {
            $order->addonItems()->attach($addon->id, ['price' => $addon->price]);
        }

        // Create Payment record
        $order->payment()->create([
            'method' => $data['paymentMethod'],
            'amount' => $totalPrice,
            'status' => 'paid', // Default to paid for simplicity in this flow
        ]);

        OrderStatusHistory::query()->create([
            'order_id' => $order->id,
            'status'   => 'Diterima',
        ]);

        $order->load(['service', 'histories', 'addonItems', 'payment']);

        return response()->json([
            'message' => 'Pesanan berhasil dibuat',
            'order'   => new OrderResource($order),
        ], 201);
    }

    public function show(string $code): JsonResponse
    {
        $order = Order::query()
            ->with(['service', 'histories', 'addonItems', 'payment'])
            ->where('code', strtoupper($code))
            ->first();

        if (! $order) {
            return response()->json(['message' => 'Pesanan tidak ditemukan.'], 404);
        }

        return response()->json([
            'order' => new OrderResource($order),
        ]);
    }

    public function adminShow(string $code): JsonResponse
    {
        $order = Order::query()
            ->with(['service', 'histories', 'addonItems', 'payment'])
            ->where('code', strtoupper($code))
            ->first();

        if (! $order) {
            return response()->json(['message' => 'Pesanan tidak ditemukan.'], 404);
        }

        return response()->json([
            'order' => new OrderResource($order),
        ]);
    }

    /**
     * @OA\Patch(
     *     path="/admin/orders/{code}/status",
     *     tags={"Orders"},
     *     summary="Update status pesanan (Admin)",
     *     description="Memperbarui status pesanan dan mencatat ke riwayat status.",
     *     operationId="updateOrderStatus",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="code",
     *         in="path",
     *         required=true,
     *         description="Kode pesanan",
     *         @OA\Schema(type="string", example="ORD-12345")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"status"},
     *             @OA\Property(
     *                 property="status",
     *                 type="string",
     *                 enum={"Diterima","Dicuci","Selesai","Diantar"},
     *                 example="Dicuci"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Status pesanan diperbarui",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Status pesanan diperbarui"),
     *             @OA\Property(property="order", ref="#/components/schemas/Order")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Tidak terautentikasi"),
     *     @OA\Response(response=404, description="Pesanan tidak ditemukan"),
     *     @OA\Response(response=422, description="Validasi gagal")
     * )
     */
    public function updateStatus(Request $request, string $code): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', 'string', 'in:Diterima,Dicuci,Selesai,Diantar'],
        ]);

        $order = Order::query()->where('code', strtoupper($code))->first();

        if (! $order) {
            return response()->json(['message' => 'Pesanan tidak ditemukan.'], 404);
        }

        $order->update(['status' => $data['status']]);

        OrderStatusHistory::query()->create([
            'order_id' => $order->id,
            'status'   => $data['status'],
        ]);

        $order->load(['service', 'histories']);

        return response()->json([
            'message' => 'Status pesanan diperbarui',
            'order'   => new OrderResource($order),
        ]);
    }

    private function generateOrderCode(): string
    {
        do {
            $code = 'ORD-'.random_int(10000, 99999);
        } while (Order::query()->where('code', $code)->exists());

        return $code;
    }
}
