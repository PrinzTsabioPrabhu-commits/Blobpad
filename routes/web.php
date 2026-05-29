<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\TrashController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('export', [DashboardController::class, 'export'])->name('export');

    // Notes CRUD
    Route::resource('notes', NoteController::class);

    // Folders CRUD
    Route::resource('folders', FolderController::class)->except(['edit']);

    // Tags CRUD
    Route::resource('tags', TagController::class)->except(['edit', 'show']);

    // Favorites
    Route::get('favorites', [FavoriteController::class, 'index'])->name('favorites.index');
    Route::post('favorites/{note}/toggle', [FavoriteController::class, 'toggle'])->name('favorites.toggle');

    // Trash
    Route::get('trash', [TrashController::class, 'index'])->name('trash.index');
    Route::post('trash/{id}/restore', [TrashController::class, 'restore'])->name('trash.restore');
    Route::delete('trash/{id}', [TrashController::class, 'forceDestroy'])->name('trash.destroy');

    // Search
    Route::get('search', [SearchController::class, 'index'])->name('search.index');
});

require __DIR__.'/settings.php';
