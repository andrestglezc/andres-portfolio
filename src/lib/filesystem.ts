// src/lib/filesystem.ts

export type FileType = 'txt' | 'json' | 'app' | 'pdf' | 'folder';

export interface FileNode {
  type: 'file';
  name: string;
  fileType: FileType;
  contentKey: string;
  icon?: string;
}

export interface FolderNode {
  type: 'folder';
  name: string;
  icon?: string;
  children: FSNode[];
}

export type FSNode = FileNode | FolderNode;

export const filesystem: FolderNode = {
  type: 'folder',
  name: 'Desktop',
  children: [
    {
      type: 'folder',
      name: 'Work',
      icon: '💼',
      children: [
        { type: 'file', name: 'TimPayneFans.app', fileType: 'app', contentKey: 'timpayne',  icon: '⚽' },
        { type: 'file', name: 'Perficient.app',  fileType: 'app', contentKey: 'perficient', icon: '🏢' },
        { type: 'file', name: 'SKY_Airline.app', fileType: 'app', contentKey: 'sky',        icon: '✈️' },
        { type: 'file', name: 'Entel_DS.app',    fileType: 'app', contentKey: 'entel',      icon: '📡' },
        { type: 'file', name: 'XPO_DS.app',       fileType: 'app', contentKey: 'xpo',        icon: '📦' },
        { type: 'file', name: 'GASCO.app',       fileType: 'app', contentKey: 'gasco',      icon: '⚡' },
        { type: 'file', name: 'Nsity.app',       fileType: 'app', contentKey: 'nsity',      icon: '🌿' },
      ],
    },
    {
      type: 'folder',
      name: 'About_Me',
      icon: '👤',
      children: [
        { type: 'file', name: 'bio.txt',        fileType: 'txt',  contentKey: 'bio',        icon: '📄' },
        { type: 'file', name: 'skills.json',    fileType: 'json', contentKey: 'skills',     icon: '{}' },
        { type: 'file', name: 'experience.txt', fileType: 'txt',  contentKey: 'experience', icon: '📄' },
      ],
    },
    { type: 'file', name: 'DOOM.exe',           fileType: 'app', contentKey: 'doom', icon: '🎮' },
    { type: 'file', name: 'AgeOfEmpires.exe',  fileType: 'app', contentKey: 'aoe',  icon: '⚔️' },
    { type: 'file', name: 'TheSims.exe',        fileType: 'app', contentKey: 'sims', icon: '🏠' },
    { type: 'file', name: 'README.txt',  fileType: 'txt', contentKey: 'readme',  icon: '📄' },
    { type: 'file', name: 'Resume.pdf',  fileType: 'pdf', contentKey: 'resume',  icon: '📋' },
    { type: 'file', name: 'Contact.txt', fileType: 'txt', contentKey: 'contact', icon: '✉️' },
    { type: 'file', name: 'Music.exe',   fileType: 'app', contentKey: 'music',   icon: '🎵' },
  ],
};

// Helper to find a node by name path e.g. ['Work', 'Perficient.app']
export function findNode(path: string[], tree: FolderNode = filesystem): FSNode | null {
  if (path.length === 0) return tree;
  const [head, ...rest] = path;
  const child = tree.children.find(c => c.name === head);
  if (!child) return null;
  if (rest.length === 0) return child;
  if (child.type === 'folder') return findNode(rest, child);
  return null;
}
