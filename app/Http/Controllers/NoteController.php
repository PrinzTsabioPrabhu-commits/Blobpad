<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\Folder;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class NoteController extends Controller
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
     * Verify a note belongs to the user's workspace.
     */
    private function authorizeNote(Note $note, Request $request): void
    {
        $workspace = $this->getWorkspace($request);

        if ($note->workspace_id !== $workspace->id) {
            abort(403, 'Catatan ini bukan milik workspace Anda.');
        }
    }

    /**
     * Display a listing of notes.
     */
    public function index(Request $request)
    {
        $workspace = $this->getWorkspace($request);

        $query = $workspace->notes()
            ->whereNull('deleted_at')
            ->with(['folder:id,name', 'tags:id,name,color']);

        // Filter by folder
        if ($request->filled('folder_id')) {
            $query->where('folder_id', $request->input('folder_id'));
        }

        // Filter by tag
        if ($request->filled('tag_id')) {
            $query->whereHas('tags', fn($q) => $q->where('tags.id', $request->input('tag_id')));
        }

        // Sorting
        $sortField = $request->input('sort', 'updated_at');
        $sortDirection = $request->input('direction', 'desc');

        if (in_array($sortField, ['title', 'updated_at', 'created_at'])) {
            $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
        } else {
            $query->latest('updated_at');
        }

        // Pinned notes first
        $query->orderByDesc('is_pinned');

        $notes = $query->paginate(12)->withQueryString();

        $folders = $workspace->folders()->orderBy('name')->get(['id', 'name', 'color']);
        $tags = $workspace->tags()->orderBy('name')->get(['id', 'name', 'color']);

        return Inertia::render('notes/index', [
            'notes' => $notes,
            'folders' => $folders,
            'tags' => $tags,
            'filters' => $request->only(['folder_id', 'tag_id', 'sort', 'direction']),
        ]);
    }

    /**
     * Show the form for creating a new note.
     */
    public function create(Request $request)
    {
        $workspace = $this->getWorkspace($request);

        $folders = $workspace->folders()->orderBy('name')->get(['id', 'name', 'color']);
        $tags = $workspace->tags()->orderBy('name')->get(['id', 'name', 'color']);

        return Inertia::render('notes/create', [
            'folders' => $folders,
            'tags' => $tags,
        ]);
    }

    /**
     * Store a newly created note.
     */
    public function store(Request $request)
    {
        $workspace = $this->getWorkspace($request);

        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'content' => ['nullable'],
            'folder_id' => ['nullable', 'exists:folders,id'],
            'color' => ['nullable', 'string', 'max:7'],
            'is_pinned' => ['nullable', 'boolean'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['exists:tags,id'],
        ]);

        // Validate folder belongs to workspace
        if (!empty($validated['folder_id'])) {
            $folder = Folder::find($validated['folder_id']);
            if (!$folder || $folder->workspace_id !== $workspace->id) {
                abort(422, 'Folder tidak valid.');
            }
        }

        // Generate title from content if not provided (for quick notes)
        $title = $validated['title'] ?? null;
        if (!$title && !empty($validated['content'])) {
            // Use first 50 characters of content as title
            $title = substr(strip_tags($validated['content']), 0, 50);
            if (strlen($validated['content']) > 50) {
                $title .= '...';
            }
        }
        $title = $title ?? 'Untitled';

        $note = $workspace->notes()->create([
            'user_id' => $request->user()->id,
            'title' => $title,
            'content' => $validated['content'] ?? null,
            'folder_id' => $validated['folder_id'] ?? null,
            'color' => $validated['color'] ?? null,
            'is_pinned' => $validated['is_pinned'] ?? false,
        ]);

        // Sync tags if provided
        if (!empty($validated['tags'])) {
            // Validate all tags belong to the workspace
            $validTagIds = $workspace->tags()->whereIn('id', $validated['tags'])->pluck('id');
            $note->tags()->sync($validTagIds);
        }

        // Quick create from dashboard — redirect back
        if ($request->boolean('quick')) {
            return redirect()->route('dashboard')
                ->with('success', 'Catatan berhasil dibuat!');
        }

        return redirect()->route('notes.show', $note)
            ->with('success', 'Catatan berhasil dibuat!');
    }

    /**
     * Display the specified note.
     */
    public function show(Request $request, Note $note)
    {
        $this->authorizeNote($note, $request);

        $workspace = $this->getWorkspace($request);

        $note->load(['folder:id,name,color', 'tags:id,name,color']);

        $folders = $workspace->folders()->orderBy('name')->get(['id', 'name', 'color']);
        $tags = $workspace->tags()->orderBy('name')->get(['id', 'name', 'color']);

        // Check if current user has favorited this note
        $isFavorited = $request->user()->favoriteNotes()->where('note_id', $note->id)->exists();

        return Inertia::render('notes/show', [
            'note' => $note,
            'folders' => $folders,
            'tags' => $tags,
            'isFavorited' => $isFavorited,
        ]);
    }

    /**
     * Show the form for editing the specified note.
     */
    public function edit(Request $request, Note $note)
    {
        // Redirect to show page which doubles as edit
        return redirect()->route('notes.show', $note);
    }

    /**
     * Update the specified note.
     */
    public function update(Request $request, Note $note)
    {
        $this->authorizeNote($note, $request);

        $workspace = $this->getWorkspace($request);

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'content' => ['nullable'],
            'folder_id' => ['nullable', 'exists:folders,id'],
            'color' => ['nullable', 'string', 'max:7'],
            'is_pinned' => ['nullable', 'boolean'],
            'is_archived' => ['nullable', 'boolean'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['exists:tags,id'],
        ]);

        // Validate folder belongs to workspace
        if (isset($validated['folder_id']) && $validated['folder_id'] !== null) {
            $folder = Folder::find($validated['folder_id']);
            if (!$folder || $folder->workspace_id !== $workspace->id) {
                abort(422, 'Folder tidak valid.');
            }
        }

        $note->update(array_filter([
            'title' => $validated['title'] ?? null,
            'content' => array_key_exists('content', $validated) ? $validated['content'] : null,
            'folder_id' => array_key_exists('folder_id', $validated) ? $validated['folder_id'] : null,
            'color' => array_key_exists('color', $validated) ? $validated['color'] : null,
            'is_pinned' => $validated['is_pinned'] ?? null,
            'is_archived' => $validated['is_archived'] ?? null,
        ], fn($value) => $value !== null));

        // Handle explicit field clears (set to null)
        if ($request->has('folder_id') && $request->input('folder_id') === null) {
            $note->update(['folder_id' => null]);
        }
        if ($request->has('color') && $request->input('color') === null) {
            $note->update(['color' => null]);
        }

        // Sync tags if provided
        if ($request->has('tags')) {
            $validTagIds = $workspace->tags()->whereIn('id', $validated['tags'] ?? [])->pluck('id');
            $note->tags()->sync($validTagIds);
        }

        return redirect()->back()
            ->with('success', 'Catatan berhasil diperbarui!');
    }

    /**
     * Soft delete the specified note.
     */
    public function destroy(Request $request, Note $note)
    {
        $this->authorizeNote($note, $request);

        $note->delete();

        return redirect()->route('notes.index')
            ->with('success', 'Catatan dipindahkan ke sampah.');
    }
}
