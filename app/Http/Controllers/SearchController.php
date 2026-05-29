<?php

namespace App\Http\Controllers;

use App\Models\SearchHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
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
     * Search notes and display results with search history.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $workspace = $this->getWorkspace($request);

        $query = $request->input('q', '');
        $results = collect();

        if (! empty($query)) {
            $results = $workspace->notes()
                ->whereNull('deleted_at')
                ->where(function ($q) use ($query) {
                    $q->where('title', 'LIKE', "%{$query}%")
                        ->orWhere('content', 'LIKE', "%{$query}%");
                })
                ->with(['folder:id,name', 'tags:id,name,color'])
                ->orderByDesc('is_pinned')
                ->latest('updated_at')
                ->paginate(12)
                ->withQueryString();

            SearchHistory::create([
                'user_id' => $user->id,
                'workspace_id' => $workspace->id,
                'query' => $query,
            ]);
        }

        // Get recent search history (last 10 unique queries)
        $recentSearches = SearchHistory::where('user_id', $user->id)
            ->where('workspace_id', $workspace->id)
            ->latest('created_at')
            ->take(10)
            ->get(['id', 'query', 'created_at'])
            ->unique('query')
            ->values();

        return Inertia::render('search/index', [
            'results' => $results,
            'query' => $query,
            'recentSearches' => $recentSearches,
        ]);
    }
}
