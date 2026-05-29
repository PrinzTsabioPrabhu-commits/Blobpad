<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\Attachment;
use App\Models\Folder;
use App\Models\Note;
use App\Models\NoteAiMetadata;
use App\Models\NoteShare;
use App\Models\NoteVersion;
use App\Models\Reminder;
use App\Models\SearchHistory;
use App\Models\Tag;
use App\Models\User;
use App\Models\UserPreference;
use App\Models\Workspace;
use App\Models\WorkspaceMember;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class WorkspaceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Seed Users
        $prinz = User::updateOrCreate(
            ['email' => 'prinz@blobpad.test'],
            [
                'name' => 'Prinz Tsabio',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );

        $collaborator = User::updateOrCreate(
            ['email' => 'collab@blobpad.test'],
            [
                'name' => 'Ahmad Fauzi',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );

        // 2. Seed User Preferences
        UserPreference::updateOrCreate(
            ['user_id' => $prinz->id],
            [
                'theme' => 'dark',
                'editor_font_size' => 16,
                'editor_line_wrap' => true,
                'auto_save_enabled' => true,
                'keybindings' => 'standard',
            ]
        );

        UserPreference::updateOrCreate(
            ['user_id' => $collaborator->id],
            [
                'theme' => 'system',
                'editor_font_size' => 14,
                'editor_line_wrap' => true,
                'auto_save_enabled' => true,
                'keybindings' => 'vim',
            ]
        );

        // 3. Seed Workspaces
        // Workspace Pribadi Prinz
        $personalWorkspace = Workspace::create([
            'name' => 'Personal Workspace',
            'description' => 'Ruang kerja pribadi Prinz Tsabio untuk menyimpan catatan harian dan draf rahasia.',
            'owner_id' => $prinz->id,
        ]);

        // Workspace Kolaborasi Tim
        $teamWorkspace = Workspace::create([
            'name' => 'Sinergi Dev Team',
            'description' => 'Workspace untuk kolaborasi tim teknis aplikasi Blobpad.',
            'owner_id' => $prinz->id,
        ]);

        // 4. Seed Workspace Collaboration (WorkspaceMember)
        WorkspaceMember::create([
            'workspace_id' => $teamWorkspace->id,
            'user_id' => $collaborator->id,
            'role' => 'editor', // Ahmad Fauzi adalah Editor
        ]);

        // 5. Seed Folders
        // Folder di Personal Workspace
        $workFolder = Folder::create([
            'workspace_id' => $personalWorkspace->id,
            'name' => 'Pekerjaan',
            'color' => '#FF5733', // Oranye merah
        ]);

        $personalFolder = Folder::create([
            'workspace_id' => $personalWorkspace->id,
            'name' => 'Catatan Pribadi',
            'color' => '#33FF57', // Hijau muda
        ]);

        // Nested folder (Subfolder) di bawah folder Pekerjaan
        $subWorkFolder = Folder::create([
            'workspace_id' => $personalWorkspace->id,
            'parent_id' => $workFolder->id,
            'name' => 'Desain Sistem',
            'color' => '#3357FF', // Biru
        ]);

        // Folder di Team Workspace
        $teamNotesFolder = Folder::create([
            'workspace_id' => $teamWorkspace->id,
            'name' => 'Sprint 1',
            'color' => '#9B59B6', // Ungu
        ]);

        // 6. Seed Tags
        $tagUrgent = Tag::create(['workspace_id' => $personalWorkspace->id, 'name' => 'Urgent', 'color' => '#E74C3C']);
        $tagIdea = Tag::create(['workspace_id' => $personalWorkspace->id, 'name' => 'Ide Baru', 'color' => '#F1C40F']);
        $tagReference = Tag::create(['workspace_id' => $personalWorkspace->id, 'name' => 'Referensi', 'color' => '#3498DB']);

        $tagSprint = Tag::create(['workspace_id' => $teamWorkspace->id, 'name' => 'Tech-Debt', 'color' => '#E67E22']);

        // 7. Seed Notes (JSON Content Block-based representation)
        // Note 1: Project Roadmap (dalam nested subfolder Pekerjaan -> Desain Sistem)
        $roadmapContent = [
            'type' => 'doc',
            'content' => [
                [
                    'type' => 'heading',
                    'attrs' => ['level' => 1],
                    'content' => [['type' => 'text', 'text' => 'Roadmap Pengembangan Backend Blobpad']],
                ],
                [
                    'type' => 'paragraph',
                    'content' => [['type' => 'text', 'text' => 'Berikut adalah daftar prioritas pengembangan arsitektur database backend.']],
                ],
                [
                    'type' => 'taskList',
                    'content' => [
                        [
                            'type' => 'taskItem',
                            'attrs' => ['checked' => true],
                            'content' => [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Rancang ERD tabel utama']]]],
                        ],
                        [
                            'type' => 'taskItem',
                            'attrs' => ['checked' => true],
                            'content' => [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Tentukan indexing, soft delete, dan foreign key constraint']]]],
                        ],
                        [
                            'type' => 'taskItem',
                            'attrs' => ['checked' => false],
                            'content' => [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Implementasi API controller & JWT Auth']]]],
                        ],
                    ],
                ],
            ],
        ];

        $noteRoadmap = Note::create([
            'workspace_id' => $personalWorkspace->id,
            'folder_id' => $subWorkFolder->id,
            'user_id' => $prinz->id,
            'title' => 'Roadmap Pengembangan Backend Blobpad',
            'content' => $roadmapContent,
            'color' => '#FFFFFF',
            'is_pinned' => true,
            'is_archived' => false,
        ]);

        // Note 2: Catatan Harian Belanja (dalam folder Catatan Pribadi)
        $groceriesContent = [
            'type' => 'doc',
            'content' => [
                [
                    'type' => 'heading',
                    'attrs' => ['level' => 2],
                    'content' => [['type' => 'text', 'text' => 'Daftar Belanja Bulanan']],
                ],
                [
                    'type' => 'bulletList',
                    'content' => [
                        ['type' => 'listItem', 'content' => [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Kopi Arabika Toraja 500g']]]]],
                        ['type' => 'listItem', 'content' => [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Susu Almond Tanpa Pemanis']]]]],
                        ['type' => 'listItem', 'content' => [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Buah Alpukat mentega 2kg']]]]],
                    ],
                ],
            ],
        ];

        $noteGroceries = Note::create([
            'workspace_id' => $personalWorkspace->id,
            'folder_id' => $personalFolder->id,
            'user_id' => $prinz->id,
            'title' => 'Belanja Bulanan',
            'content' => $groceriesContent,
            'color' => '#FCF3CF', // Kuning lembut
            'is_pinned' => false,
            'is_archived' => false,
        ]);

        // Note 3: Catatan Tim (Team Workspace)
        $teamSprintContent = [
            'type' => 'doc',
            'content' => [
                [
                    'type' => 'heading',
                    'attrs' => ['level' => 1],
                    'content' => [['type' => 'text', 'text' => 'Pembagian Tugas Sprint 1']],
                ],
                [
                    'type' => 'paragraph',
                    'content' => [['type' => 'text', 'text' => 'Catatan ini diisi bersama oleh seluruh kontributor dev team.']],
                ],
            ],
        ];

        $noteTeamSprint = Note::create([
            'workspace_id' => $teamWorkspace->id,
            'folder_id' => $teamNotesFolder->id,
            'user_id' => $prinz->id,
            'title' => 'Pembagian Tugas Sprint 1',
            'content' => $teamSprintContent,
            'color' => '#E8F8F5',
            'is_pinned' => true,
            'is_archived' => false,
        ]);

        // Note 4: Catatan yang sudah terhapus (Trash demo)
        $noteDeleted = Note::create([
            'workspace_id' => $personalWorkspace->id,
            'folder_id' => null,
            'user_id' => $prinz->id,
            'title' => 'Catatan Kuno Tak Terpakai',
            'content' => ['type' => 'doc', 'content' => [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Ini data usang.']]]]],
            'color' => '#FADBD8',
            'is_pinned' => false,
            'is_archived' => false,
            'deleted_at' => now()->subHours(2), // Soft deleted!
        ]);

        // 8. Associate Tags to Notes (Pivot `note_tag`)
        $noteRoadmap->tags()->attach([$tagUrgent->id, $tagReference->id]);
        $noteGroceries->tags()->attach([$tagIdea->id]);
        $noteTeamSprint->tags()->attach([$tagSprint->id]);

        // 9. Seed Favorite Notes (Prinz memfavoritkan note Roadmap dan Groceries)
        $prinz->favoriteNotes()->attach([$noteRoadmap->id, $noteGroceries->id]);

        // 10. Seed Note History / Versioning (Satu versi lama untuk Roadmap)
        $oldRoadmapContent = [
            'type' => 'doc',
            'content' => [
                [
                    'type' => 'heading',
                    'attrs' => ['level' => 1],
                    'content' => [['type' => 'text', 'text' => 'Draf Roadmap Backend']],
                ],
                [
                    'type' => 'paragraph',
                    'content' => [['type' => 'text', 'text' => 'Inisiasi draf awal arsitektur.']],
                ],
            ],
        ];

        NoteVersion::create([
            'note_id' => $noteRoadmap->id,
            'user_id' => $prinz->id,
            'title' => 'Draf Roadmap Backend',
            'content' => $oldRoadmapContent,
            'version_number' => 1,
            'created_at' => now()->subDay(),
        ]);

        // 11. Seed Note Share (Berbagi akses spesifik untuk note Groceries ke Collaborator)
        NoteShare::create([
            'note_id' => $noteGroceries->id,
            'shared_by' => $prinz->id,
            'shared_with' => $collaborator->id,
            'permission' => 'viewer', // Ahmad Fauzi hanya bisa melihat list groceries
        ]);

        // Berbagi via link publik untuk note Roadmap
        NoteShare::create([
            'note_id' => $noteRoadmap->id,
            'shared_by' => $prinz->id,
            'shared_with' => null, // Publik
            'permission' => 'viewer',
            'share_token' => Str::random(32),
            'expires_at' => now()->addWeeks(2),
        ]);

        // 12. Seed Reminders
        Reminder::create([
            'note_id' => $noteGroceries->id,
            'user_id' => $prinz->id,
            'remind_at' => now()->addDays(1)->setTime(10, 0, 0), // Besok jam 10 pagi
            'is_triggered' => false,
        ]);

        // 13. Seed Attachments
        Attachment::create([
            'note_id' => $noteRoadmap->id,
            'user_id' => $prinz->id,
            'file_name' => 'database_architecture_v1.pdf',
            'file_path' => 'attachments/database_architecture_v1.pdf',
            'file_size' => 1048576, // 1 MB
            'mime_type' => 'application/pdf',
        ]);

        // 14. Seed AI Metadata Summaries
        NoteAiMetadata::create([
            'note_id' => $noteRoadmap->id,
            'summary' => 'Dokumen ini menjabarkan peta jalan dan prioritas pengembangan infrastruktur backend aplikasi Blobpad, mencakup penyusunan ERD, migrasi, relasi antar-tabel database MySQL, dan pengembangan API.',
            'key_points' => [
                'Inisialisasi rancangan ERD tabel utama selesai.',
                'Prioritas saat ini adalah penulisan file migrasi database beserta penentuan indexes dan soft deletes.',
                'Langkah selanjutnya berfokus pada JWT authentication dan unit testing controller API.',
            ],
            'tone_sentiment' => 'professional & structured',
            'last_analyzed_hash' => md5(json_encode($roadmapContent)),
        ]);

        // 15. Seed Search History
        SearchHistory::create([
            'user_id' => $prinz->id,
            'workspace_id' => $personalWorkspace->id,
            'query' => 'Roadmap',
        ]);

        SearchHistory::create([
            'user_id' => $prinz->id,
            'workspace_id' => $personalWorkspace->id,
            'query' => 'Belanjaan',
        ]);

        // 16. Seed Activity Logs
        ActivityLog::create([
            'workspace_id' => $personalWorkspace->id,
            'user_id' => $prinz->id,
            'note_id' => $noteRoadmap->id,
            'action' => 'created',
            'description' => 'Membuat catatan Roadmap Backend.',
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        ]);

        ActivityLog::create([
            'workspace_id' => $personalWorkspace->id,
            'user_id' => $prinz->id,
            'note_id' => $noteRoadmap->id,
            'action' => 'shared',
            'description' => 'Membagikan akses publik untuk catatan Roadmap.',
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        ]);
    }
}
