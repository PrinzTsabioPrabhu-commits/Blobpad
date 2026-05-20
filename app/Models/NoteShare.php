<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NoteShare extends Model
{
    use HasFactory;

    protected $fillable = [
        'note_id',
        'shared_by',
        'shared_with',
        'permission',
        'share_token',
        'expires_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
        ];
    }

    /**
     * Get the shared note.
     */
    public function note(): BelongsTo
    {
        return $this->belongsTo(Note::class);
    }

    /**
     * Get the user who shared the note.
     */
    public function sharer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'shared_by');
    }

    /**
     * Get the user who received access (null for public link shares).
     */
    public function recipient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'shared_with');
    }

    /**
     * Check if the sharing token has expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }
}
