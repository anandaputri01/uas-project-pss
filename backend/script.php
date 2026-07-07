<?php foreach(\App\Models\Order::all() as $o) { $a = \App\Models\Addon::inRandomOrder()->first(); if($a){$o->addonItems()->sync([$a->id => ["price" => $a->price]]);} }
