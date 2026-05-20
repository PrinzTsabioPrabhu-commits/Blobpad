<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Attachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'note_id',
        'user_id',
        'file_name',
        'file_path',
        'file_size',
        'mime_type',
    ];

    /**
     * Get the note associated with the attachment.
     */
    public function note(): BelongsTo
    {
        return $this->belongsTo(Note::class);
    }

    /**
     * Get the user who uploaded the attachment.
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Helper to retrieve the public/storage URL of the uploaded file.
     */
    public function getUrlAttribute(): string
    {
        return Storage::url($this->file_path);
    }
}
