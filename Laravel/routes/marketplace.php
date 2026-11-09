<?php

use App\Http\Controllers\MarketplaceController as Market;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('api')->group(function () {
    Route::get('storefront', [Market::class, 'storefront']);
    Route::get('session', fn (Request $r) => response()->json(['user' => $r->user(), 'csrf_token' => csrf_token()]));
    Route::post('login', [Market::class, 'login'])->middleware('throttle:5,1');
    Route::middleware('auth')->group(function () {
        Route::post('logout', [Market::class, 'logout']);
        Route::get('dashboard', [Market::class, 'dashboard']);
        Route::post('shops', [Market::class, 'saveShop']);
        Route::put('shops/{shop}', [Market::class, 'saveShop']);
        Route::delete('shops/{shop}', [Market::class, 'deleteShop']);
        Route::post('owners', [Market::class, 'saveOwner']);
        Route::put('owners/{owner}', [Market::class, 'saveOwner']);
        Route::delete('owners/{owner}', [Market::class, 'deleteOwner']);
        Route::post('products', [Market::class, 'saveProduct']);
        Route::put('products/{product}', [Market::class, 'saveProduct']);
        Route::delete('products/{product}', [Market::class, 'deleteProduct']);
        Route::post('shops/{shop}/listings', [Market::class, 'saveListing']);
        Route::put('shops/{shop}/listings/{listing}', [Market::class, 'saveListing']);
        Route::delete('shops/{shop}/listings/{listing}', [Market::class, 'deleteListing']);
    });
});
