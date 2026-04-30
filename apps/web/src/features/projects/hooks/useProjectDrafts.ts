import { useState, useEffect } from 'react';
import { readAllProjectDrafts } from '../detail/hooks/useProjectDraft';
import type { ProjectData } from '../detail/types';

export type ProjectDraftEntry = {
  id: string;
  data: ProjectData;
};

export function useProjectDrafts(): ProjectDraftEntry[] {
  const [drafts, setDrafts] = useState<ProjectDraftEntry[]>([]);

  useEffect(() => {
    // sessionStorage is an external system; reading from it in an effect is correct.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrafts(readAllProjectDrafts());

    function handleFocus() {
      setDrafts(readAllProjectDrafts());
    }
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  return drafts;
}
