<?php

namespace Database\Seeders;

use App\Models\Addon;
use App\Models\Outlet;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@helmetwash.test'],
            [
                'name' => 'admin',
                'password' => 'admin123',
            ],
        );

        $services = [
            [
                'slug' => 'fast',
                'name' => 'Fast Clean',
                'price' => 40000,
                'description' => 'Cuci cepat luar & dalam, kering, wangi. (30-60 menit)',
                'features' => ['Cuci Shell Luar', 'Cuci Inner Padding (Surface)', 'Vakum Debu', 'Pewangi Standar'],
            ],
            [
                'slug' => 'steril',
                'name' => 'Sterilization Only',
                'price' => 45000,
                'description' => 'Fokus pembasmian bakteri & jamur dengan teknologi UV-C & Ozone.',
                'features' => ['UV-C Light Treatment', 'Ozone Sterilization', 'Anti-Bacterial Spray', 'Pewangi Premium'],
            ],
            [
                'slug' => 'deep',
                'name' => 'Deep Clean & Detailing',
                'price' => 60000,
                'description' => 'Perawatan total. Bongkar busa, detailing kerak, coating kaca.',
                'features' => ['Bongkar Total Busa', 'Cuci & Steam Busa', 'Detailing Sela-sela', 'Coating Visor (Efek Daun Talas)', 'UV Sterilization'],
            ],
        ];

        foreach ($services as $service) {
            Service::query()->updateOrCreate(['slug' => $service['slug']], $service);
        }

        $outlets = [
            ['name' => 'HelmetWash Pusat - Dekat UDINUS', 'lat' => -6.9897, 'lng' => 110.4201, 'address' => 'Area UDINUS, Semarang (sekitar Jl. Imam Bonjol)'],
            ['name' => 'HelmetWash Cabang - Dekat UNDIP', 'lat' => -7.0550, 'lng' => 110.4360, 'address' => 'Tembalang, dekat Kampus UNDIP, Semarang'],
            ['name' => 'HelmetWash Cabang - Dekat UNIKA', 'lat' => -6.9956, 'lng' => 110.4039, 'address' => 'Bendan Duwur, dekat UNIKA Soegijapranata, Semarang'],
            ['name' => 'HelmetWash Cabang - Dekat UNISULA', 'lat' => -6.9663, 'lng' => 110.4595, 'address' => 'Kaligawe, dekat Kampus UNISULA, Semarang'],
        ];

        foreach ($outlets as $outlet) {
            Outlet::query()->updateOrCreate(['name' => $outlet['name']], $outlet);
        }

        $addons = [
            ['slug' => 'antijamur', 'name' => 'Anti Jamur & Bakteri', 'price' => 10000],
            ['slug' => 'premium_scent', 'name' => 'Pewangi Premium', 'price' => 5000],
        ];

        foreach ($addons as $addon) {
            Addon::query()->updateOrCreate(['slug' => $addon['slug']], $addon);
        }
    }
}
