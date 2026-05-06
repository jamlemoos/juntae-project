import { useState } from 'react';
import { ApiError } from '../../../shared/api/http';
import { useAuth } from '../../auth/hooks/useAuth';
import { validateName, validateEmail, validateCity } from '../../auth/utils/authValidation';
import { useUpdateUserMutation } from '../../users/hooks/useUserMutations';
import { useMyProfileQuery, useUpsertProfileMutation } from '../../users/hooks/useProfileQuery';

export type ProfileEditFormValues = {
  name: string;
  email: string;
  bio: string;
  city: string;
  headline: string;
  availability: string;
  selectedSkillIds: string[];
};

export type UseProfileEditFormReturn = {
  fields: ProfileEditFormValues;
  errors: Record<string, string>;
  saveError: string | null;
  isSaving: boolean;
  isEditing: boolean;
  startEdit: () => void;
  cancelEdit: () => void;
  setField: <K extends keyof ProfileEditFormValues>(
    key: K,
    value: ProfileEditFormValues[K]
  ) => void;
  toggleSkill: (id: string) => void;
  save: () => Promise<void>;
};

const EMPTY_FIELDS: ProfileEditFormValues = {
  name: '',
  email: '',
  bio: '',
  city: '',
  headline: '',
  availability: 'available',
  selectedSkillIds: [],
};

export function useProfileEditForm(): UseProfileEditFormReturn {
  const user = useAuth((s) => s.user);
  const { data: myProfile } = useMyProfileQuery();
  const updateMutation = useUpdateUserMutation();
  const upsertProfileMutation = useUpsertProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [fields, setFields] = useState<ProfileEditFormValues>(EMPTY_FIELDS);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState<string | null>(null);

  function startEdit() {
    setFields({
      name: user?.name ?? '',
      email: user?.email ?? '',
      bio: user?.bio ?? '',
      city: user?.city ?? '',
      headline: myProfile?.headline ?? '',
      availability: myProfile?.availability ?? 'available',
      selectedSkillIds: user?.skills?.map((s) => s.id) ?? [],
    });
    setErrors({});
    setSaveError(null);
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
  }

  function setField<K extends keyof ProfileEditFormValues>(
    key: K,
    value: ProfileEditFormValues[K]
  ) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function toggleSkill(id: string) {
    setFields((prev) => ({
      ...prev,
      selectedSkillIds: prev.selectedSkillIds.includes(id)
        ? prev.selectedSkillIds.filter((x) => x !== id)
        : [...prev.selectedSkillIds, id],
    }));
  }

  async function save() {
    if (!user) return;

    const errs: Record<string, string> = {};
    const nameErr = validateName(fields.name);
    if (nameErr) errs.name = nameErr;
    const emailErr = validateEmail(fields.email);
    if (emailErr) errs.email = emailErr;
    const cityErr = validateCity(fields.city);
    if (cityErr) errs.city = cityErr;

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSaveError(null);
    try {
      await updateMutation.mutateAsync({
        id: user.id,
        data: {
          name: fields.name,
          email: fields.email,
          bio: fields.bio,
          city: fields.city,
          skillIds: fields.selectedSkillIds,
        },
      });
      await upsertProfileMutation.mutateAsync({
        headline: fields.headline.trim(),
        availability: fields.availability,
      });
      setIsEditing(false);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setSaveError('Esse e-mail já está em uso por outra conta.');
        } else if (err.status === 0) {
          setSaveError('Sem conexão. Verifique sua internet.');
        } else {
          setSaveError('Algo deu errado. Tente novamente.');
        }
      } else {
        setSaveError('Algo deu errado. Tente novamente.');
      }
    }
  }

  return {
    fields,
    errors,
    saveError,
    isSaving: updateMutation.isPending || upsertProfileMutation.isPending,
    isEditing,
    startEdit,
    cancelEdit,
    setField,
    toggleSkill,
    save,
  };
}
