<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrashController extends Controller
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
     * Display a listing of soft-deleted notes.
     */
    public function index(Request $request)
    {
        $workspace = $this->getWorkspace($request);

        $trashedNotes = $workspace->notes()
            ->onlyTrashed()
            ->with(['folder:id,name'])
            ->latest('deleted_at')
            ->paginate(12);

        return Inertia::render('trash/index', [
            'trashedNotes' => $trashedNotes,
        ]);
    }

    /**
     * Restore a soft-deleted note.
     */
    public function restore(Request $request, int $id)
    {
        $workspace = $this->getWorkspace($request);

        $note = Note::onlyTrashed()->findOrFail($id);

        // Verify note belongs to user's workspace
        if ($note->workspace_id !== $workspace->id) {
            abort(403, 'Catatan ini bukan milik workspace Anda.');
        }

        $note->restore();

        return redirect()->route('trash.index')
            ->with('success', 'Catatan berhasil dipulihkan!');
    }

    /**
     * Permanently delete a soft-deleted note.
     */
    public function forceDestroy(Request $request, int $id)
    {
        $workspace = $this->getWorkspace($request);

        $note = Note::onlyTrashed()->findOrFail($id);

        // Verify note belongs to user's workspace
        if ($note->workspace_id !== $workspace->id) {
            abort(403, 'Catatan ini bukan milik workspace Anda.');
        }

        $note->tags()->detach();
        $note->favoritedBy()->detach();

        $note->forceDelete();

        return redirect()->route('trash.index')
            ->with('success', 'Catatan berhasil dihapus permanen!');
    }
}
