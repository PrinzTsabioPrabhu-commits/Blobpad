<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    /**
     * Get the user's default workspace, creating one if it doesn't exist.
     */
    private function getWorkspace(Request $request)
    {
        return $request->user()->ownedWorkspaces()->firstOrCreate(
            ['owner_id' => $request->user()->id],
            ['name' => 'Personal Workspace', 'description' => 'Workspace pribadi']
        );
    }

    /**
     * Display a listing of the user's favorite notes.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $workspace = $this->getWorkspace($request);

        $favorites = $user->favoriteNotes()
            ->where('workspace_id', $workspace->id)
            ->whereNull('notes.deleted_at')
            ->with(['folder:id,name', 'tags:id,name,color'])
            ->latest('favorite_notes.created_at')
            ->paginate(12);

        return Inertia::render('favorites/index', [
            'favorites' => $favorites,
        ]);
    }

    /**
     * Toggle the favorite status of a note.
     */
    public function toggle(Request $request, Note $note)
    {
        $workspace = $this->getWorkspace($request);

        // Verify note belongs to user's workspace
        if ($note->workspace_id !== $workspace->id) {
            abort(403, 'Catatan ini bukan milik workspace Anda.');
        }

        $request->user()->favoriteNotes()->toggle($note->id);

        return redirect()->back()
            ->with('success', 'Status favorit berhasil diubah!');
    }
}
