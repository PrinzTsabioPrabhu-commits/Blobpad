<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasFactory;

    // This is an audit trail; records are only inserted, not updated.
    const UPDATED_AT = null;

    protected $fillable = [
        'workspace_id',
        'user_id',
        'note_id',
        'action',
        'description',
        'ip_address',
        'user_agent',
    ];

    /**
     * Get the workspace where the action took place.
     */
    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    /**
     * Get the user who performed the action.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the related note, if applicable.
     */
    public function note(): BelongsTo
    {
        return $this->belongsTo(Note::class);
    }
}
