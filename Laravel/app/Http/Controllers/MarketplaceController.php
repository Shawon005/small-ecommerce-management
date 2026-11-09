<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\Product;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class MarketplaceController extends Controller
{
    private function storeThumbnail(Request $request, array $data): array
    {
        unset($data['thumbnail_file']);
        if ($request->hasFile('thumbnail_file')) {
            $path = $request->file('thumbnail_file')->store('product-images', 'public');
            abort_unless($path, 500, 'Could not save the image. Please try again.');
            $data['thumbnail'] = url('/storage/'.$path);
        }

        return $data;
    }

    private function admin(Request $r): void
    {
        abort_unless($r->user()->role === 'admin', 403, 'Administrator access required.');
    }

    private function owns(Request $r, Shop $shop): void
    {
        abort_unless($r->user()->role === 'admin' || $shop->owner_id === $r->user()->id, 403, 'You cannot manage this shop.');
    }

    public function login(Request $r)
    {
        $data = $r->validate(['email' => 'required|email', 'password' => 'required|string']);
        if (! Auth::attempt($data)) {
            return response()->json(['message' => 'The email or password is incorrect.'], 422);
        }
        $r->session()->regenerate();

        return response()->json($r->user());
    }

    public function logout(Request $r)
    {
        Auth::logout();
        $r->session()->invalidate();
        $r->session()->regenerateToken();

        return response()->json(['message' => 'Signed out.']);
    }

    public function storefront(Request $r)
    {
        $shops = Shop::where('is_active', true)->withCount(['listings' => fn ($q) => $q->where('is_active', true)])->get();
        $listings = Listing::with(['shop:id,name,slug', 'product:id,category,sku'])
            ->where('is_active', true)->whereHas('shop', fn ($q) => $q->where('is_active', true))
            ->when($r->filled('shop'), fn ($q) => $q->whereHas('shop', fn ($q) => $q->where('slug', $r->input('shop'))))
            ->when($r->filled('search'), fn ($q) => $q->where('name', 'like', '%'.$r->input('search').'%'))
            ->when($r->filled('category'), fn ($q) => $q->whereHas('product', fn ($q) => $q->where('category', $r->input('category'))))
            ->latest()->paginate(24);

        return response()->json(compact('shops', 'listings'));
    }

    public function dashboard(Request $r)
    {
        $shops = Shop::with('owner:id,name,email')->withCount('listings')
            ->when($r->user()->role !== 'admin', fn ($q) => $q->where('owner_id', $r->user()->id))->get();

        return response()->json([
            'shops' => $shops,
            'listings' => Listing::with(['shop:id,name', 'product:id,category,sku'])->whereIn('shop_id', $shops->pluck('id'))->latest()->get(),
            'products' => Product::with('creator:id,name')->withCount('listings')->latest()->get(),
            'owners' => $r->user()->role === 'admin' ? User::where('role', 'owner')->withCount('shops')->get() : [],
        ]);
    }

    public function saveShop(Request $r, ?Shop $shop = null)
    {
        $this->admin($r);
        $data = $r->validate([
            'name' => 'required|string|max:150',
            'slug' => ['required', 'alpha_dash', 'max:150', Rule::unique('shops')->ignore($shop?->id)],
            'description' => 'nullable|string|max:3000', 'is_active' => 'required|boolean',
            'owner_id' => ['required', Rule::exists('users', 'id')->where('role', 'owner')],
        ]);
        if ($shop) {
            $shop->update($data);
        } else {
            $shop = Shop::create($data);
        }

        return response()->json($shop);
    }

    public function deleteShop(Request $r, Shop $shop)
    {
        $this->admin($r);
        $shop->delete();

        return response()->noContent();
    }

    public function saveOwner(Request $r, ?User $owner = null)
    {
        $this->admin($r);
        abort_if($owner && $owner->role !== 'owner', 404);
        $data = $r->validate([
            'name' => 'required|string|max:150',
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($owner?->id)],
            'password' => [$owner ? 'nullable' : 'required', 'string', 'min:8', 'max:128'],
        ]);
        if (empty($data['password'])) {
            unset($data['password']);
        }
        if ($owner) {
            $owner->update($data);
        } else {
            $owner = User::create([...$data, 'role' => 'owner']);
        }

        return response()->json($owner);
    }

    public function deleteOwner(Request $r, User $owner)
    {
        $this->admin($r);
        abort_if($owner->role !== 'owner', 404);
        abort_if(Shop::where('owner_id', $owner->id)->exists(), 422, 'Reassign or delete this owner\'s shops first.');
        $owner->delete();

        return response()->noContent();
    }

    public function saveProduct(Request $r, ?Product $product = null)
    {
        if ($product) {
            abort_unless($r->user()->role === 'admin' || $product->created_by === $r->user()->id, 403);
        }
        $data = $r->validate([
            'name' => 'required|string|max:150',
            'sku' => ['required', 'string', 'max:80', Rule::unique('products')->ignore($product?->id)],
            'category' => 'required|string|max:80', 'description' => 'required|string|max:5000',
            'price' => 'required|numeric|min:0|max:9999999999.99|decimal:0,2',
            'thumbnail' => 'nullable|url:http,https|max:2048',
            'thumbnail_file' => 'nullable|image|mimes:jpg,jpeg,png,webp,gif|max:2048',
        ]);
        $data = $this->storeThumbnail($r, $data);
        if ($product) {
            $product->update($data);
        } else {
            $product = Product::create([...$data, 'created_by' => $r->user()->id]);
        }

        return response()->json($product);
    }

    public function deleteProduct(Request $r, Product $product)
    {
        $this->admin($r);
        $product->delete();

        return response()->noContent();
    }

    public function saveListing(Request $r, Shop $shop, ?Listing $listing = null)
    {
        $this->owns($r, $shop);
        abort_if($listing && $listing->shop_id !== $shop->id, 404);
        $data = $r->validate([
            'product_id' => ['required', 'exists:products,id', Rule::unique('listings')->where('shop_id', $shop->id)->ignore($listing?->id)],
            'name' => 'required|string|max:150', 'description' => 'required|string|max:5000',
            'price' => 'required|numeric|min:0|max:9999999999.99|decimal:0,2',
            'thumbnail' => 'nullable|url:http,https|max:2048', 'is_active' => 'required|boolean',
            'thumbnail_file' => 'nullable|image|mimes:jpg,jpeg,png,webp,gif|max:2048',
        ]);
        abort_if($listing && $listing->product_id !== (int) $data['product_id'], 422, 'A listing cannot switch catalog products.');
        $data = $this->storeThumbnail($r, $data);
        if ($listing) {
            $listing->update($data);
        } else {
            $listing = $shop->listings()->create($data);
        }

        return response()->json($listing);
    }

    public function deleteListing(Request $r, Shop $shop, Listing $listing)
    {
        $this->owns($r, $shop);
        abort_unless($listing->shop_id === $shop->id, 404);
        $listing->delete();

        return response()->noContent();
    }
}
