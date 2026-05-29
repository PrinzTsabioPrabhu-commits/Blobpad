<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Ekspor Catatan - CatatIN</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
        }
        h1 {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        .note {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        .note-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #000;
        }
        .note-meta {
            font-size: 12px;
            color: #666;
            margin-bottom: 10px;
        }
        .note-content {
            font-size: 14px;
            line-height: 1.5;
            background: #f9f9f9;
            padding: 10px;
            border: 1px solid #ddd;
            white-space: pre-wrap;
        }
    </style>
</head>
<body>
    <h1>Catatan Saya (CatatIN)</h1>
    <p style="text-align: center; font-size: 12px;">Diekspor pada: {{ now()->format('d M Y, H:i') }}</p>

    @foreach($notes as $note)
    <div class="note">
        <div class="note-title">{{ $note->title ?: 'Tanpa Judul' }}</div>
        <div class="note-meta">
            @if($note->folder)
                Folder: {{ $note->folder->name }} | 
            @endif
            Diperbarui: {{ $note->updated_at->format('d M Y, H:i') }}
        </div>
        <div class="note-content">{{ $note->content ?: '(Tidak ada isi)' }}</div>
    </div>
    @endforeach
</body>
</html>
