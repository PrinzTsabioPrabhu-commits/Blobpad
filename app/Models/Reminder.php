<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reminder extends Model
{
    use HasFactory;

    protected $fillable = [
        'note_id',
        'user_id',
        'remind_at',
        'is_triggered',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'remind_at' => 'datetime',
            'is_triggered' => 'boolean',
        ];
    }

    /**
     * Get the note.
     */
    public function note(): BelongsTo
    {
        return $this->belongsTo(Note::class);
    }

    /**
     * Get the user who will receive the reminder.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Local scope to query reminders that are due and haven't been triggered yet.
     */
    public function scopePending($query)
    {
        return $query->where('is_triggered', false)
            ->where('remind_at', '<=', now());
    }
}
