<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'workspace_id',
        'name',
        'color',
    ];

    /**
     * Get the workspace that owns the tag.
     */
    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    /**
     * Get the notes that have this tag (Many-to-Many).
     */
    public function notes(): BelongsToMany
    {
        return $this->belongsToMany(Note::class);
    }
}
