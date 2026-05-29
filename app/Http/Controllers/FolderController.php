<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FolderController extends Controller
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
     * Verify a folder belongs to the user's workspace.
     */
    private function authorizeFolder(Folder $folder, Request $request): void
    {
        $workspace = $this->getWorkspace($request);

        if ($folder->workspace_id !== $workspace->id) {
            abort(403, 'Folder ini bukan milik workspace Anda.');
        }
    }

    /**
     * Display a listing of folders.
     */
    public function index(Request $request)
    {
        $workspace = $this->getWorkspace($request);

        $folders = $workspace->folders()
            ->withCount(['notes' => fn ($q) => $q->whereNull('deleted_at')])
            ->orderBy('name')
            ->get();

        return Inertia::render('folders/index', [
            'folders' => $folders,
        ]);
    }

    /**
     * Store a newly created folder.
     */
    public function store(Request $request)
    {
        $workspace = $this->getWorkspace($request);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'color' => ['nullable', 'string', 'max:7'],
            'parent_id' => ['nullable', 'exists:folders,id'],
        ]);

        if (! empty($validated['parent_id'])) {
            $parent = Folder::find($validated['parent_id']);
            if (! $parent || $parent->workspace_id !== $workspace->id) {
                abort(422, 'Folder induk tidak valid.');
            }
        }

        $workspace->folders()->create([
            'name' => $validated['name'],
            'color' => $validated['color'] ?? null,
            'parent_id' => $validated['parent_id'] ?? null,
        ]);

        return redirect()->route('folders.index')
            ->with('success', 'Folder berhasil dibuat!');
    }

    /**
     * Display the specified folder with its notes.
     */
    public function show(Request $request, Folder $folder)
    {
        $this->authorizeFolder($folder, $request);

        $workspace = $this->getWorkspace($request);

        $notes = $folder->notes()
            ->whereNull('deleted_at')
            ->with(['tags:id,name,color'])
            ->orderByDesc('is_pinned')
            ->latest('updated_at')
            ->paginate(12);

        $folder->loadCount(['notes' => fn ($q) => $q->whereNull('deleted_at')]);

        return Inertia::render('folders/show', [
            'folder' => $folder,
            'notes' => $notes,
        ]);
    }

    /**
     * Update the specified folder.
     */
    public function update(Request $request, Folder $folder)
    {
        $this->authorizeFolder($folder, $request);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'color' => ['nullable', 'string', 'max:7'],
        ]);

        $folder->update([
            'name' => $validated['name'],
            'color' => $validated['color'] ?? $folder->color,
        ]);

        return redirect()->back()
            ->with('success', 'Folder berhasil diperbarui!');
    }

    /**
     * Remove the specified folder.
     */
    public function destroy(Request $request, Folder $folder)
    {
        $this->authorizeFolder($folder, $request);

        // Detach notes from folder (set folder_id to null) before deleting
        $folder->notes()->update(['folder_id' => null]);

        $folder->delete();

        return redirect()->route('folders.index')
            ->with('success', 'Folder berhasil dihapus!');
    }
}
