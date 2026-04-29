import type { WorkMode } from './types';

const WORK_MODE_LABELS: Record<WorkMode, string> = {
  remote: 'Remoto',
  presential: 'Presencial',
  hybrid: 'Híbrido',
};

export function formatWorkMode(workMode: WorkMode | '', city: string): string {
  if (!workMode) return '';
  const label = WORK_MODE_LABELS[workMode];
  if (workMode === 'remote') return label;
  const trimmedCity = city.trim();
  return trimmedCity ? `${trimmedCity} · ${label.toLowerCase()}` : label;
}
