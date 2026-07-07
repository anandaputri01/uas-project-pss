<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Addon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AddonController extends Controller
{
    public function sync(Request $request): JsonResponse
    {
        $data = $request->validate([
            'addons'           => ['required', 'array'],
            'addons.*.id'      => ['required', 'string'],
            'addons.*.name'    => ['required', 'string'],
            'addons.*.price'   => ['required', 'integer', 'min:0'],
        ]);

        $keptSlugs = [];

        foreach ($data['addons'] as $item) {
            $keptSlugs[] = $item['id'];

            Addon::query()->updateOrCreate(
                ['slug' => $item['id']],
                [
                    'name'  => $item['name'],
                    'price' => $item['price'],
                ],
            );
        }

        Addon::query()->whereNotIn('slug', $keptSlugs)->delete();

        $addons = Addon::query()->orderBy('id')->get()->map(function ($addon) {
            return [
                'id' => $addon->slug,
                'name' => $addon->name,
                'price' => $addon->price,
            ];
        });

        return response()->json([
            'message' => 'Perubahan tambahan layanan disimpan',
            'addons'  => $addons,
        ]);
    }
}
