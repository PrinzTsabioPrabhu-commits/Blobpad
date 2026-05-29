<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained('workspaces')->cascadeOnDelete();
            $table->foreignId('folder_id')->nullable()->constrained('folders')->nullOnDelete(); // Set null if folder is deleted to preserve notes
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete(); // Creator of the note

            $table->string('title')->nullable(); // Blank notes are allowed in modern editors
            $table->longText('content')->nullable(); // JSON block editor tree
            $table->string('color', 7)->nullable(); // Hex color for note cards

            $table->boolean('is_pinned')->default(false);
            $table->boolean('is_archived')->default(false);

            $table->timestamps();
            $table->softDeletes(); // Trash mechanism

            // Indexes for optimizing filters and queries
            $table->index('workspace_id');
            $table->index('folder_id');
            $table->index('user_id');

            // Fulltext search index for fast note contents search (only if MySQL is used)
            if (DB::getDriverName() === 'mysql') {
                $table->fullText(['title', 'content']);
            } else {
                // Fallback index for other drivers like SQLite (unit testing)
                $table->index('title');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
