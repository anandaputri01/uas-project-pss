<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ServiceController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return ServiceResource::collection(Service::query()->orderBy('id')->get());
    }

    public function sync(Request $request): JsonResponse
    {
        $data = $request->validate([
            'services'           => ['required', 'array'],
            'services.*.id'      => ['required', 'string'],
            'services.*.name'    => ['required', 'string'],
            'services.*.price'   => ['required', 'integer', 'min:0'],
            'services.*.desc'    => ['nullable', 'string'],
            'services.*.features' => ['nullable', 'array'],
        ]);

        $keptSlugs = [];

        foreach ($data['services'] as $item) {
            $keptSlugs[] = $item['id'];

            Service::query()->updateOrCreate(
                ['slug' => $item['id']],
                [
                    'name'        => $item['name'],
                    'price'       => $item['price'],
                    'description' => $item['desc'] ?? '',
                    'features'    => $item['features'] ?? [],
                ],
            );
        }

        Service::query()->whereNotIn('slug', $keptSlugs)->delete();

        return response()->json([
            'message'  => 'Perubahan layanan disimpan',
            'services' => ServiceResource::collection(Service::query()->orderBy('id')->get()),
        ]);
    }
}
