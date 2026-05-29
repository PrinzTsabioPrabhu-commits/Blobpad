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
        Schema::create('note_ai_metadata', function (Blueprint $table) {
            $table->id();
            // Strict 1:1 relation with notes
            $table->foreignId('note_id')->unique()->constrained('notes')->cascadeOnDelete();

            $table->text('summary')->nullable();
            $table->json('key_points')->nullable(); // Array of key points/bullets
            $table->string('tone_sentiment')->nullable(); // Sentiment of note (e.g. professional, excited, neutral)
            $table->string('last_analyzed_hash', 32)->nullable(); // MD5 of content to determine if rewrite is needed

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('note_ai_metadata');
    }
};
