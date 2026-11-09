<?php

use Illuminate\Support\Facades\Route;

require __DIR__.'/marketplace.php';
Route::view('/{path?}', 'app')->where('path', '(?!api(?:/|$)).*')->name('login');
