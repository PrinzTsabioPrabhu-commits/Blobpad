<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('note_shares', function (Blueprint $table) {
            $table->id();
            $table->foreignId('note_id')->constrained('notes')->cascadeOnDelete();
            $table->foreignId('shared_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('shared_with')->nullable()->constrained('users')->cascadeOnDelete(); // Null if public link share
            $table->enum('permission', ['viewer', 'editor'])->default('viewer');
            $table->string('share_token', 64)->nullable()->unique(); // For public link access (e.g. hash token)
            $table->timestamp('expires_at')->nullable(); // Optional link expiration
            $table->timestamps();

            $table->index('note_id');
            $table->index('shared_with');
            $table->index('share_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('note_shares');
    }
};
