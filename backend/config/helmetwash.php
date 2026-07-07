<?php

return [
    'addons' => [
        ['id' => 'antijamur', 'name' => 'Anti Jamur & Bakteri', 'price' => 10000],
        ['id' => 'premium_scent', 'name' => 'Pewangi Premium', 'price' => 5000],
    ],

    'delivery_options' => [
        ['id' => 'none', 'name' => 'Antar Sendiri (Drop-off)', 'price' => 0],
        ['id' => 'pickup', 'name' => 'Pick-up & Delivery (Radius < 5km)', 'price' => 10000],
        ['id' => 'pickup_far', 'name' => 'Pick-up & Delivery (Radius 5-10km)', 'price' => 15000],
    ],

    'order_steps' => ['Diterima', 'Dicuci', 'Selesai', 'Diantar'],
];
