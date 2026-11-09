<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MarketplaceTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private User $owner;

    private User $other;

    private Shop $shop;

    private Shop $otherShop;

    private Product $product;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->owner = User::factory()->create(['role' => 'owner']);
        $this->other = User::factory()->create(['role' => 'owner']);
        $this->shop = Shop::create(['name' => 'First Shop', 'slug' => 'first', 'owner_id' => $this->owner->id]);
        $this->otherShop = Shop::create(['name' => 'Second Shop', 'slug' => 'second', 'owner_id' => $this->other->id]);
        $this->product = Product::create($this->productData() + ['created_by' => $this->admin->id]);
    }

    private function productData(array $overrides = []): array
    {
        return array_replace(['name' => 'Catalog Mug', 'sku' => 'TEST-001', 'category' => 'Home & Living', 'description' => 'Original catalog details', 'price' => '20.00', 'thumbnail' => 'https://example.com/catalog.jpg'], $overrides);
    }

    private function listingData(array $overrides = []): array
    {
        return array_replace(['product_id' => $this->product->id, 'name' => 'My Shop Mug', 'description' => 'My custom shop details', 'price' => '29.50', 'thumbnail' => 'https://example.com/shop.jpg', 'is_active' => true], $overrides);
    }

    public function test_public_storefront_never_exposes_unassigned_catalog_products(): void
    {
        $this->getJson('/api/storefront')->assertOk()->assertJsonPath('listings.total', 0)->assertDontSee('Catalog Mug');
        $this->getJson('/api/dashboard')->assertUnauthorized();
        $this->postJson('/api/products', $this->productData())->assertUnauthorized();
    }

    private function imageUpload(): UploadedFile
    {
        return UploadedFile::fake()->createWithContent('product.png', base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII='));
    }

    public function test_products_support_uploads_replacement_and_switching_back_to_urls(): void
    {
        Storage::fake('public');
        $this->actingAs($this->owner);
        $payload = $this->productData(['sku' => 'UPLOAD-001']);
        $created = $this->post('/api/products', $payload + ['thumbnail_file' => $this->imageUpload()], ['Accept' => 'application/json'])->assertOk();
        $id = $created->json('id');
        $url = $created->json('thumbnail');
        $this->assertStringContainsString('/storage/product-images/', $url);
        Storage::disk('public')->assertExists('product-images/'.basename($url));
        $this->putJson("/api/products/{$id}", array_replace($payload, ['thumbnail' => $url, 'price' => '33.00']))->assertOk()->assertJsonPath('thumbnail', $url);
        $updated = $this->post("/api/products/{$id}", $payload + ['_method' => 'PUT', 'thumbnail_file' => $this->imageUpload()], ['Accept' => 'application/json'])->assertOk();
        $this->assertNotSame($url, $updated->json('thumbnail'));
        $this->putJson("/api/products/{$id}", $payload)->assertOk()->assertJsonPath('thumbnail', 'https://example.com/catalog.jpg');
    }

    public function test_listing_uploads_are_independent_and_can_reuse_catalog_uploads(): void
    {
        Storage::fake('public');
        $created = $this->actingAs($this->admin)->post('/api/products', $this->productData(['sku' => 'UPLOAD-002']) + ['thumbnail_file' => $this->imageUpload()], ['Accept' => 'application/json'])->assertOk();
        $catalogUrl = $created->json('thumbnail');
        $payload = $this->listingData(['product_id' => $created->json('id'), 'thumbnail' => $catalogUrl]);
        $listing = $this->actingAs($this->owner)->postJson("/api/shops/{$this->shop->id}/listings", $payload)->assertOk();
        $id = $listing->json('id');
        $updated = $this->post("/api/shops/{$this->shop->id}/listings/{$id}", $payload + ['_method' => 'PUT', 'thumbnail_file' => $this->imageUpload()], ['Accept' => 'application/json'])->assertOk();
        $this->assertNotSame($catalogUrl, $updated->json('thumbnail'));
        Storage::disk('public')->assertExists('product-images/'.basename($updated->json('thumbnail')));
        $this->assertSame($catalogUrl, Product::findOrFail($created->json('id'))->thumbnail);
        $this->getJson('/api/storefront')->assertJsonPath('listings.data.0.thumbnail', $updated->json('thumbnail'));
    }

    public function test_invalid_or_unauthorized_uploads_are_not_stored(): void
    {
        Storage::fake('public');
        $this->actingAs($this->owner);
        foreach ([UploadedFile::fake()->createWithContent('fake.jpg', '<?php echo 1;')->mimeType('text/x-php'), UploadedFile::fake()->create('too-large.png', 2049, 'image/png'), UploadedFile::fake()->createWithContent('unsafe.svg', '<svg xmlns="http://www.w3.org/2000/svg"></svg>')] as $file) {
            $this->post('/api/products', $this->productData(['sku' => 'INVALID-IMAGE']) + ['thumbnail_file' => $file], ['Accept' => 'application/json'])->assertUnprocessable()->assertJsonValidationErrors('thumbnail_file');
        }
        $this->post("/api/shops/{$this->otherShop->id}/listings", $this->listingData() + ['thumbnail_file' => $this->imageUpload()], ['Accept' => 'application/json'])->assertForbidden();
        $this->assertSame([], Storage::disk('public')->allFiles());
    }

    public function test_login_logout_and_invalid_credentials(): void
    {
        $this->postJson('/api/login', ['email' => $this->owner->email, 'password' => 'wrong'])->assertUnprocessable();
        $this->postJson('/api/login', ['email' => $this->owner->email, 'password' => 'password'])->assertOk()->assertJsonPath('role', 'owner')->assertJsonMissingPath('password');
        $this->getJson('/api/session')->assertJsonPath('user.id', $this->owner->id)->assertJsonStructure(['csrf_token']);
        $this->postJson('/api/logout')->assertOk();
        $this->getJson('/api/dashboard')->assertUnauthorized();
    }

    public function test_login_is_rate_limited(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/login', ['email' => 'missing@example.com', 'password' => 'wrong'])->assertUnprocessable();
        }
        $this->postJson('/api/login', ['email' => 'missing@example.com', 'password' => 'wrong'])->assertStatus(429);
    }

    public function test_owners_can_create_shared_products_but_cannot_impersonate_creators(): void
    {
        $payload = $this->productData(['sku' => 'OWNER-001', 'created_by' => $this->admin->id]);
        $this->actingAs($this->owner)->postJson('/api/products', $payload)->assertOk()->assertJsonPath('created_by', $this->owner->id);
        $this->actingAs($this->other)->getJson('/api/dashboard')->assertOk()->assertJsonFragment(['sku' => 'OWNER-001']);
        $this->getJson('/api/storefront')->assertJsonPath('listings.total', 0);
    }

    public function test_shop_customizations_are_independent_and_used_in_public_responses(): void
    {
        $response = $this->actingAs($this->owner)->postJson("/api/shops/{$this->shop->id}/listings", $this->listingData())->assertOk();
        $id = $response->json('id');
        $this->actingAs($this->other)->postJson("/api/shops/{$this->otherShop->id}/listings", $this->listingData(['name' => 'Other Shop Mug', 'price' => '35.00']))->assertOk();
        $this->actingAs($this->owner)->putJson("/api/shops/{$this->shop->id}/listings/{$id}", $this->listingData(['price' => '31.00']))->assertOk();
        $this->assertSame('20.00', $this->product->fresh()->price);
        $this->assertDatabaseHas('listings', ['shop_id' => $this->otherShop->id, 'price' => 35]);
        $this->getJson('/api/storefront?shop=first')->assertOk()->assertJsonPath('listings.total', 1)
            ->assertJsonPath('listings.data.0.name', 'My Shop Mug')->assertJsonPath('listings.data.0.price', '31.00')
            ->assertJsonPath('listings.data.0.description', 'My custom shop details')->assertJsonPath('listings.data.0.thumbnail', 'https://example.com/shop.jpg');
    }

    public function test_cross_shop_modifications_are_forbidden(): void
    {
        $listing = $this->shop->listings()->create($this->listingData());
        $this->actingAs($this->other)->postJson("/api/shops/{$this->shop->id}/listings", $this->listingData())->assertForbidden();
        $this->putJson("/api/shops/{$this->shop->id}/listings/{$listing->id}", $this->listingData())->assertForbidden();
        $this->deleteJson("/api/shops/{$this->shop->id}/listings/{$listing->id}")->assertForbidden();
        $this->putJson("/api/shops/{$this->otherShop->id}/listings/{$listing->id}", $this->listingData())->assertNotFound();
        $this->deleteJson("/api/shops/{$this->otherShop->id}/listings/{$listing->id}")->assertNotFound();
    }

    public function test_owner_dashboard_only_returns_their_shops_and_listings(): void
    {
        $this->shop->listings()->create($this->listingData());
        $this->otherShop->listings()->create($this->listingData(['name' => 'Private management listing']));
        $this->actingAs($this->owner)->getJson('/api/dashboard')->assertOk()->assertJsonCount(1, 'shops')->assertJsonCount(1, 'listings')->assertJsonCount(0, 'owners')->assertDontSee('Private management listing');
        $this->actingAs($this->admin)->getJson('/api/dashboard')->assertOk()->assertJsonCount(2, 'shops')->assertJsonCount(2, 'owners');
    }

    public function test_owners_cannot_manage_accounts_shops_or_delete_global_products(): void
    {
        $this->actingAs($this->owner)->postJson('/api/owners', [])->assertForbidden();
        $this->putJson("/api/owners/{$this->other->id}", [])->assertForbidden();
        $this->deleteJson("/api/owners/{$this->other->id}")->assertForbidden();
        $this->postJson('/api/shops', [])->assertForbidden();
        $this->putJson("/api/shops/{$this->shop->id}", [])->assertForbidden();
        $this->deleteJson("/api/shops/{$this->shop->id}")->assertForbidden();
        $this->putJson("/api/products/{$this->product->id}", $this->productData())->assertForbidden();
        $this->deleteJson("/api/products/{$this->product->id}")->assertForbidden();
    }

    public function test_hidden_listings_and_inactive_shops_are_not_public(): void
    {
        $this->shop->listings()->create($this->listingData(['is_active' => false]));
        $this->otherShop->listings()->create($this->listingData());
        $this->otherShop->update(['is_active' => false]);
        $this->getJson('/api/storefront')->assertOk()->assertJsonPath('listings.total', 0)->assertJsonCount(1, 'shops');
        $this->getJson('/api/storefront?shop=second')->assertJsonPath('listings.total', 0);
    }

    public function test_duplicate_assignments_invalid_prices_and_invalid_urls_are_rejected(): void
    {
        $this->actingAs($this->owner);
        $path = "/api/shops/{$this->shop->id}/listings";
        $this->postJson($path, $this->listingData(['price' => -1]))->assertUnprocessable()->assertJsonValidationErrors('price');
        $this->postJson($path, $this->listingData(['price' => '1.001']))->assertUnprocessable()->assertJsonValidationErrors('price');
        $this->postJson($path, $this->listingData(['thumbnail' => 'javascript:alert(1)']))->assertUnprocessable()->assertJsonValidationErrors('thumbnail');
        $this->postJson($path, $this->listingData())->assertOk();
        $this->postJson($path, $this->listingData())->assertUnprocessable()->assertJsonValidationErrors('product_id');
    }

    public function test_admin_can_manage_owner_accounts_and_protects_admin_accounts(): void
    {
        $this->actingAs($this->admin)->postJson('/api/owners', ['name' => 'New Owner', 'email' => 'new@example.com', 'password' => 'securepassword', 'role' => 'admin'])->assertOk()->assertJsonPath('role', 'owner');
        $owner = User::where('email', 'new@example.com')->firstOrFail();
        $this->assertTrue(Hash::check('securepassword', $owner->password));
        $this->putJson("/api/owners/{$owner->id}", ['name' => 'Updated Owner', 'email' => $owner->email, 'password' => ''])->assertOk();
        $this->assertTrue(Hash::check('securepassword', $owner->fresh()->password));
        $this->deleteJson("/api/owners/{$owner->id}")->assertNoContent();
        $this->deleteJson("/api/owners/{$this->owner->id}")->assertUnprocessable();
        $this->deleteJson("/api/owners/{$this->admin->id}")->assertNotFound();
    }

    public function test_admin_can_create_update_and_delete_shops_with_listing_cascades(): void
    {
        $this->actingAs($this->admin);
        $payload = ['name' => 'New shop', 'slug' => 'new-shop', 'owner_id' => $this->other->id, 'description' => 'A new shop', 'is_active' => true];
        $id = $this->postJson('/api/shops', $payload)->assertOk()->json('id');
        $this->putJson("/api/shops/{$id}", array_replace($payload, ['name' => 'Renamed shop']))->assertOk()->assertJsonPath('name', 'Renamed shop');
        Shop::findOrFail($id)->listings()->create($this->listingData());
        $this->deleteJson("/api/shops/{$id}")->assertNoContent();
        $this->assertDatabaseMissing('listings', ['shop_id' => $id]);
        $this->assertDatabaseHas('products', ['id' => $this->product->id]);
        $this->postJson('/api/shops', array_replace($payload, ['owner_id' => $this->admin->id]))->assertUnprocessable()->assertJsonValidationErrors('owner_id');
    }

    public function test_global_updates_preserve_shop_overrides_and_deleting_product_cascades(): void
    {
        $listing = $this->shop->listings()->create($this->listingData());
        $this->actingAs($this->admin)->putJson("/api/products/{$this->product->id}", $this->productData(['name' => 'Renamed catalog product', 'price' => '100.00']))->assertOk();
        $this->assertSame('My Shop Mug', $listing->fresh()->name);
        $this->assertSame('29.50', $listing->fresh()->price);
        $this->deleteJson("/api/products/{$this->product->id}")->assertNoContent();
        $this->assertDatabaseMissing('listings', ['id' => $listing->id]);
        $this->getJson('/api/storefront')->assertJsonPath('listings.total', 0);
    }

    public function test_owner_can_update_their_catalog_product_and_remove_a_listing(): void
    {
        $this->product->update(['created_by' => $this->owner->id]);
        $listing = $this->shop->listings()->create($this->listingData());
        $this->actingAs($this->owner)->putJson("/api/products/{$this->product->id}", $this->productData(['name' => 'Owner edited mug']))->assertOk();
        $this->deleteJson("/api/shops/{$this->shop->id}/listings/{$listing->id}")->assertNoContent();
        $this->assertDatabaseHas('products', ['id' => $this->product->id]);
    }

    public function test_storefront_search_category_shop_filter_and_pagination(): void
    {
        $this->shop->listings()->create($this->listingData());
        $this->otherShop->listings()->create($this->listingData(['name' => 'Unique second item']));
        $this->getJson('/api/storefront?search=Unique')->assertJsonPath('listings.total', 1)->assertJsonPath('listings.data.0.shop.slug', 'second');
        $this->getJson('/api/storefront?category=Stationery')->assertJsonPath('listings.total', 0);
        $this->getJson('/api/storefront?shop=first')->assertJsonPath('listings.total', 1);
        $this->getJson('/api/storefront?page=2')->assertJsonCount(0, 'listings.data');
    }

    public function test_seed_is_repeatable_and_contains_catalog_only_and_shared_examples(): void
    {
        $this->seed();
        $count = Product::count();
        $this->seed();
        $this->assertSame($count, Product::count());
        $vase = Product::where('sku', 'CG-009')->firstOrFail();
        $this->assertSame(0, $vase->listings()->count());
        $this->assertSame(2, Product::where('sku', 'CG-001')->firstOrFail()->listings()->count());
        $this->getJson('/api/storefront')->assertDontSee('Weekend Ceramic Vase');
    }
}
