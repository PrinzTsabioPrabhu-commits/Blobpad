<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NoteAiMetadata extends Model
{
    use HasFactory;

    protected $table = 'note_ai_metadata';

    protected $fillable = [
        'note_id',
        'summary',
        'key_points',
        'tone_sentiment',
        'last_analyzed_hash',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'key_points' => 'array', // Automatically cast key takeaways list to array
        ];
    }

    /**
     * Get the note.
     */
    public function note(): BelongsTo
    {
        return $this->belongsTo(Note::class);
    }
}
