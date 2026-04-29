import { useState } from 'react';
import type { RoleDraft, RoleErrors } from '../types';

export function validateRolesForSubmit(roles: RoleDraft[]): RoleErrors[] {
  return roles.map((role) => ({
    title: role.title.trim() ? undefined : 'Nome do papel obrigatório',
    description: role.description.trim() ? undefined : 'Descrição obrigatória',
    status: role.status ? undefined : 'Selecione a situação',
  }));
}

export function useProjectRoles() {
  const [roles, setRoles] = useState<RoleDraft[]>([]);
  const [roleErrors, setRoleErrors] = useState<RoleErrors[]>([]);

  function addRole() {
    setRoles((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: '', description: '', status: '' },
    ]);
    setRoleErrors((prev) => [...prev, {}]);
  }

  function removeRole(id: string) {
    const idx = roles.findIndex((r) => r.id === id);
    if (idx === -1) return;
    setRoles((prev) => prev.filter((r) => r.id !== id));
    setRoleErrors((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateRole(id: string, field: 'title' | 'description' | 'status', value: string) {
    setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
    const idx = roles.findIndex((r) => r.id === id);

    if (idx === -1) return;

    const effectiveValue = field === 'status' ? value : value.trim();
    if (effectiveValue && roleErrors[idx]?.[field]) {
      setRoleErrors((prev) => prev.map((e, i) => (i === idx ? { ...e, [field]: undefined } : e)));
    }
  }

  function applyRoleValidation(): boolean {
    const errors = validateRolesForSubmit(roles);
    setRoleErrors(errors);
    return errors.every((e) => !e.title && !e.description && !e.status);
  }

  return { roles, roleErrors, addRole, removeRole, updateRole, applyRoleValidation };
}
