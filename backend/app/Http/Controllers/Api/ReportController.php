<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

class ReportController extends Controller
{
    /**
     * @OA\Get(
     *     path="/admin/reports",
     *     tags={"Reports"},
     *     summary="Laporan dan statistik (Admin)",
     *     description="Mengembalikan ringkasan laporan: total pesanan, pendapatan, statistik per layanan, pengiriman, status, penggunaan addons, dan grafik pendapatan 7 hari terakhir.",
     *     operationId="getReports",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Data laporan berhasil didapat",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="summary",
     *                 type="object",
     *                 description="Ringkasan statistik",
     *                 @OA\Property(property="totalOrders", type="integer", example=150),
     *                 @OA\Property(property="totalRevenue", type="integer", example=7500000),
     *                 @OA\Property(property="avgOrder", type="integer", example=50000)
     *             ),
     *             @OA\Property(
     *                 property="byService",
     *                 type="array",
     *                 description="Statistik per layanan",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="count", type="integer", example=80),
     *                     @OA\Property(property="revenue", type="integer", example=4000000),
     *                     @OA\Property(property="name", type="string", example="Paket Premium")
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="byDelivery",
     *                 type="array",
     *                 description="Statistik per metode pengiriman",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="string", example="antar-jemput"),
     *                     @OA\Property(property="count", type="integer", example=70)
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="byStatus",
     *                 type="array",
     *                 description="Statistik per status pesanan",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="status", type="string", example="Selesai"),
     *                     @OA\Property(property="count", type="integer", example=120)
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="addonUsage",
     *                 type="array",
     *                 description="Statistik penggunaan addons",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="string", example="deodoran"),
     *                     @OA\Property(property="count", type="integer", example=45)
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="byDate",
     *                 type="array",
     *                 description="Pendapatan 7 hari terakhir",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="date", type="string", format="date", example="2025-01-15"),
     *                     @OA\Property(property="revenue", type="integer", example=350000)
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="orders",
     *                 type="array",
     *                 description="Semua data pesanan",
     *                 @OA\Items(ref="#/components/schemas/Order")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=401, description="Tidak terautentikasi")
     * )
     */
    public function index(): JsonResponse
    {
        $orders     = Order::query()->with(['service', 'histories', 'addonItems', 'payment'])->latest()->get();
        $ordersData = OrderResource::collection($orders)->resolve();

        $totalRevenue = $orders->sum('total_price');
        $totalOrders  = $orders->count();
        $avgOrder     = $totalOrders ? (int) round($totalRevenue / $totalOrders) : 0;

        $byService  = [];
        $byDelivery = [];
        $byStatus   = [];
        $addonUsage = [];
        $byDate     = [];

        foreach ($orders as $order) {
            $serviceKey = $order->service?->slug ?? 'unknown';
            $byService[$serviceKey] = $byService[$serviceKey] ?? [
                'count'   => 0,
                'revenue' => 0,
                'name'    => $order->service_name,
            ];
            $byService[$serviceKey]['count']   += 1;
            $byService[$serviceKey]['revenue'] += $order->total_price;

            $byDelivery[$order->delivery_id] = ($byDelivery[$order->delivery_id] ?? 0) + 1;
            $byStatus[$order->status]        = ($byStatus[$order->status] ?? 0) + 1;

            foreach ($order->addons ?? [] as $addonId) {
                $addonUsage[$addonId] = ($addonUsage[$addonId] ?? 0) + 1;
            }

            $dateKey         = $order->created_at->format('Y-m-d');
            $byDate[$dateKey] = ($byDate[$dateKey] ?? 0) + $order->total_price;
        }

        ksort($byDate);
        $dateList = array_slice($byDate, -7, null, true);

        return response()->json([
            'summary'    => [
                'totalOrders'   => $totalOrders,
                'totalRevenue'  => $totalRevenue,
                'avgOrder'      => $avgOrder,
            ],
            'byService'  => array_values(collect($byService)->sortByDesc('revenue')->all()),
            'byDelivery' => collect($byDelivery)->map(fn ($count, $id) => ['id' => $id, 'count' => $count])->values(),
            'byStatus'   => collect($byStatus)->map(fn ($count, $status) => ['status' => $status, 'count' => $count])->values(),
            'addonUsage' => collect($addonUsage)->map(fn ($count, $id) => ['id' => $id, 'count' => $count])->values(),
            'byDate'     => collect($dateList)->map(fn ($revenue, $date) => ['date' => $date, 'revenue' => $revenue])->values(),
            'orders'     => $ordersData,
        ]);
    }
}
