<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserPreference extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'theme',
        'editor_font_size',
        'editor_line_wrap',
        'auto_save_enabled',
        'keybindings',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'editor_font_size' => 'integer',
            'editor_line_wrap' => 'boolean',
            'auto_save_enabled' => 'boolean',
        ];
    }

    /**
     * Get the user who owns these preferences.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
