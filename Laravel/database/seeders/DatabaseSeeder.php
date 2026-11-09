<?php

namespace Database\Seeders;

use App\Models\Listing;
use App\Models\Product;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::transaction(function () {
            $admin = User::firstOrCreate(['email' => 'admin@example.com'], ['name' => 'Alex Morgan', 'password' => 'password', 'role' => 'admin']);
            $mia = User::firstOrCreate(['email' => 'owner@example.com'], ['name' => 'Mia Parker', 'password' => 'password', 'role' => 'owner']);
            $sam = User::firstOrCreate(['email' => 'sam@example.com'], ['name' => 'Sam Wilson', 'password' => 'password', 'role' => 'owner']);
            $shops = [
                Shop::firstOrCreate(['slug' => 'the-home-edit'], ['name' => 'The Home Edit', 'owner_id' => $mia->id, 'description' => 'Considered objects for comfortable spaces.']),
                Shop::firstOrCreate(['slug' => 'slow-studio'], ['name' => 'Slow Studio', 'owner_id' => $sam->id, 'description' => 'Simple things. Slower days.']),
                Shop::firstOrCreate(['slug' => 'field-and-form'], ['name' => 'Field & Form', 'owner_id' => $mia->id, 'description' => 'Everyday essentials with a natural touch.']),
            ];
            $rows = [
                ['Stoneware Everyday Mug', 'CG-001', 'Home & Living', 'A warm ceramic companion for your morning ritual. Finished with a soft, earthy glaze.', 24, 'photo-1514228742587-6b1558fcca3d'],
                ['The Everyday Tote', 'CG-002', 'Accessories', 'An uncomplicated cotton canvas carryall. Room for your essentials and a little extra.', 32, 'photo-1553062407-98eeb64c6a62'],
                ['Amber & Cedar Candle', 'CG-003', 'Home & Living', 'Slow down with warm amber and woodsy cedar. Hand poured for quiet evenings at home.', 28, 'photo-1603006905003-be475563bc59'],
                ['Linen Notebook Set', 'CG-004', 'Stationery', 'For ideas worth keeping. A pair of linen-bound notebooks with smooth, uncoated pages.', 18, 'photo-1531346878377-a5be20888e57'],
                ['Little Green Companion', 'CG-005', 'Lifestyle', 'Bring a little nature indoors. An easy-care houseplant in a minimal ceramic pot.', 22, 'photo-1459411552884-841db9b3cc2a'],
                ['Sunday Pour-Over', 'CG-006', 'Home & Living', 'A considered start to your day. A simple glass coffee maker for your favorite roast.', 46, 'photo-1495474472287-4d71bcdd2085'],
                ['Everyday Essentials Pouch', 'CG-007', 'Accessories', 'A compact companion for the things that matter. Soft fabric, considered details.', 16, 'photo-1544816155-12df9643f363'],
                ['Quiet Morning Journal', 'CG-008', 'Stationery', 'Space to pause, reflect, and make a little room for yourself. Your daily ritual, on paper.', 20, 'photo-1517842645767-c639042777db'],
                ['Weekend Ceramic Vase', 'CG-009', 'Home & Living', 'An organic silhouette for dried stems or fresh flowers. A small piece with a warm presence.', 36, 'photo-1578500494198-246f612d3b3d'],
            ];
            foreach ($rows as $i => [$name, $sku, $category, $description, $price, $photo]) {
                $product = Product::firstOrCreate(['sku' => $sku], compact('name', 'category', 'description', 'price') + ['created_by' => [$admin, $mia, $sam][$i % 3]->id, 'thumbnail' => "https://images.unsplash.com/{$photo}?auto=format&fit=crop&w=700&q=80"]);
                if ($i === 8) {
                    continue;
                } // Intentionally catalog-only, never public.
                $shop = $shops[$i % 3];
                Listing::firstOrCreate(['shop_id' => $shop->id, 'product_id' => $product->id], ['name' => $name, 'description' => $description, 'price' => $price, 'thumbnail' => $product->thumbnail]);
            }
            $first = Product::where('sku', 'CG-001')->first();
            Listing::firstOrCreate(['shop_id' => $shops[1]->id, 'product_id' => $first->id], ['name' => 'Slow Morning Stoneware Mug', 'description' => 'Our studio favorite, with a soft earthy glaze. Make every coffee a quiet moment.', 'price' => 26, 'thumbnail' => $first->thumbnail]);
        });
    }
}
