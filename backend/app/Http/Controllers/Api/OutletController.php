<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OutletResource;
use App\Models\Outlet;
use Illuminate\Http\JsonResponse;

class OutletController extends Controller
{
    /**
     * @OA\Get(
     *     path="/outlets",
     *     tags={"Outlets"},
     *     summary="Daftar outlet",
     *     description="Mengembalikan semua outlet/lokasi layanan HelmetWash.",
     *     operationId="getOutlets",
     *     @OA\Response(
     *         response=200,
     *         description="Daftar outlet berhasil didapat",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="outlets",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="HelmetWash Pusat"),
     *                     @OA\Property(property="address", type="string", example="Jl. Raya No. 1, Jakarta"),
     *                     @OA\Property(property="phone", type="string", example="08123456789"),
     *                     @OA\Property(property="open_hours", type="string", example="08.00 - 20.00")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'outlets' => OutletResource::collection(Outlet::query()->orderBy('id')->get()),
        ]);
    }
}
