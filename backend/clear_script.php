<?php $last = \App\Models\Order::latest()->first(); \Illuminate\Support\Facades\DB::table("order_addon")->where("order_id", "!=", $last->id)->delete();
