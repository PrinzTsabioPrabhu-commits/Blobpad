// CUSTOM ROUTE HELPERS — CatatIN Domain Routes
export const notes = () => '/notes';
export const noteCreate = () => '/notes/create';
export const noteShow = (id: number) => `/notes/${id}`;
export const noteEdit = (id: number) => `/notes/${id}/edit`;
export const folders = () => '/folders';
export const folderShow = (id: number) => `/folders/${id}`;
export const tags = () => '/tags';
export const favorites = () => '/favorites';
export const favoriteToggle = (noteId: number) => `/favorites/${noteId}/toggle`;
export const trash = () => '/trash';
export const trashRestore = (id: number) => `/trash/${id}/restore`;
export const trashDestroy = (id: number) => `/trash/${id}`;
export const search = () => '/search';
