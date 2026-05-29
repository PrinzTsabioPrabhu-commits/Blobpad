<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TagController extends Controller
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
     * Verify a tag belongs to the user's workspace.
     */
    private function authorizeTag(Tag $tag, Request $request): void
    {
        $workspace = $this->getWorkspace($request);

        if ($tag->workspace_id !== $workspace->id) {
            abort(403, 'Tag ini bukan milik workspace Anda.');
        }
    }

    /**
     * Display a listing of tags.
     */
    public function index(Request $request)
    {
        $workspace = $this->getWorkspace($request);

        $tags = $workspace->tags()
            ->withCount('notes')
            ->orderBy('name')
            ->get();

        return Inertia::render('tags/index', [
            'tags' => $tags,
        ]);
    }

    /**
     * Store a newly created tag.
     */
    public function store(Request $request)
    {
        $workspace = $this->getWorkspace($request);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50'],
            'color' => ['nullable', 'string', 'max:7'],
        ]);

        $workspace->tags()->create([
            'name' => $validated['name'],
            'color' => $validated['color'] ?? null,
        ]);

        return redirect()->route('tags.index')
            ->with('success', 'Tag berhasil dibuat!');
    }

    /**
     * Update the specified tag.
     */
    public function update(Request $request, Tag $tag)
    {
        $this->authorizeTag($tag, $request);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50'],
            'color' => ['nullable', 'string', 'max:7'],
        ]);

        $tag->update([
            'name' => $validated['name'],
            'color' => $validated['color'] ?? $tag->color,
        ]);

        return redirect()->back()
            ->with('success', 'Tag berhasil diperbarui!');
    }

    /**
     * Remove the specified tag.
     */
    public function destroy(Request $request, Tag $tag)
    {
        $this->authorizeTag($tag, $request);

        // Detach the tag from all notes before deleting
        $tag->notes()->detach();

        $tag->delete();

        return redirect()->route('tags.index')
            ->with('success', 'Tag berhasil dihapus!');
    }
}
