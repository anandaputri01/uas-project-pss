<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class CatalogController extends Controller
{
    /**
     * @OA\Get(
     *     path="/catalog",
     *     tags={"Catalog"},
     *     summary="Ambil data katalog",
     *     description="Mengembalikan daftar addons, opsi pengiriman, dan langkah pemesanan.",
     *     operationId="getCatalog",
     *     @OA\Response(
     *         response=200,
     *         description="Data katalog berhasil didapat",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="addons",
     *                 type="array",
     *                 description="Daftar layanan tambahan (add-ons)",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="string", example="deodoran"),
     *                     @OA\Property(property="name", type="string", example="Deodoran Helm"),
     *                     @OA\Property(property="price", type="integer", example=5000)
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="deliveryOptions",
     *                 type="array",
     *                 description="Opsi pengiriman/pengambilan helm",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="string", example="antar-jemput"),
     *                     @OA\Property(property="name", type="string", example="Antar Jemput"),
     *                     @OA\Property(property="price", type="integer", example=10000)
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="orderSteps",
     *                 type="array",
     *                 description="Langkah-langkah cara pesan",
     *                 @OA\Items(type="string")
     *             )
     *         )
     *     )
     * )
     */
    public function index(): JsonResponse
    {
        // Format addons to match the previous structure: [['id' => '...', 'name' => '...', 'price' => ...], ...]
        $addons = \App\Models\Addon::query()->orderBy('id')->get()->map(function ($addon) {
            return [
                'id' => $addon->slug,
                'name' => $addon->name,
                'price' => $addon->price,
            ];
        });

        return response()->json([
            'addons'          => $addons,
            'deliveryOptions' => config('helmetwash.delivery_options'),
            'orderSteps'      => config('helmetwash.order_steps'),
        ]);
    }
}
