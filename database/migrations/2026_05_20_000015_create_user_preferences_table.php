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
        Schema::create('user_preferences', function (Blueprint $table) {
            $table->id();
            // Strict 1:1 relation with users
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            
            $table->string('theme', 20)->default('system'); // system, light, dark
            $table->unsignedInteger('editor_font_size')->default(14);
            $table->boolean('editor_line_wrap')->default(true);
            $table->boolean('auto_save_enabled')->default(true);
            $table->string('keybindings', 20)->default('standard'); // standard, vim, emacs
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_preferences');
    }
};
