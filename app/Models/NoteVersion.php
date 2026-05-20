<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NoteVersion extends Model
{
    use HasFactory;

    // Only created_at is present in the database, no updated_at needed for versions
    const UPDATED_AT = null;

    protected $fillable = [
        'note_id',
        'user_id',
        'title',
        'content',
        'version_number',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'content' => 'array', // Historical content serialized as JSON
        ];
    }

    /**
     * Get the note this version belongs to.
     */
    public function note(): BelongsTo
    {
        return $this->belongsTo(Note::class);
    }

    /**
     * Get the user who saved/edited this version.
     */
    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
