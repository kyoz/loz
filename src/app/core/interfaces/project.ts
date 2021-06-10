export interface Project {
  path: string;
  languages: string[];
  primaryLanguage: string;
  indentFormat?: string;
  autoSave?: boolean;
  lastModified: number;
}
