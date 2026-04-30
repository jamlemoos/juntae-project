import { useState, useEffect } from 'react';
import { readAllProjectDrafts, type ProjectDraftEntry } from '../detail/hooks/useProjectDraft';

export type { ProjectDraftEntry };

export function useProjectDrafts(): ProjectDraftEntry[] {
  const [drafts, setDrafts] = useState<ProjectDraftEntry[]>(() => readAllProjectDrafts());

  useEffect(() => {
    function handleFocus() {
      setDrafts(readAllProjectDrafts());
    }
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  return drafts;
}
