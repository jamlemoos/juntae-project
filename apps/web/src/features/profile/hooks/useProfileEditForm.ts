import { useRef, useState } from 'react';
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
  draftSkillNames: string[];
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
  addSkill: (name: string) => void;
  removeSkill: (name: string) => void;
  save: () => Promise<void>;
};

const EMPTY_FIELDS: ProfileEditFormValues = {
  name: '',
  email: '',
  bio: '',
  city: '',
  headline: '',
  availability: 'available',
  draftSkillNames: [],
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

  // Always reflects the latest fields value — prevents stale closures in save()
  const fieldsRef = useRef<ProfileEditFormValues>(EMPTY_FIELDS);
  fieldsRef.current = fields;

  function startEdit() {
    setFields({
      name: user?.name ?? '',
      email: user?.email ?? '',
      bio: user?.bio ?? '',
      city: user?.city ?? '',
      headline: myProfile?.headline ?? '',
      availability: myProfile?.availability ?? 'available',
      draftSkillNames: user?.skills?.map((s) => s.name) ?? [],
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

  function addSkill(name: string) {
    const normalized = name.trim().toLowerCase();
    if (!normalized) return;
    setFields((prev) => {
      if (prev.draftSkillNames.some((s) => s.toLowerCase() === normalized)) return prev;
      return { ...prev, draftSkillNames: [...prev.draftSkillNames, normalized] };
    });
  }

  function removeSkill(name: string) {
    setFields((prev) => ({
      ...prev,
      draftSkillNames: prev.draftSkillNames.filter((s) => s !== name),
    }));
  }

  async function save() {
    const currentFields = fieldsRef.current;
    if (!user) return;

    const errs: Record<string, string> = {};
    const nameErr = validateName(currentFields.name);
    if (nameErr) errs.name = nameErr;
    const emailErr = validateEmail(currentFields.email);
    if (emailErr) errs.email = emailErr;
    const cityErr = validateCity(currentFields.city);
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
          name: currentFields.name,
          email: currentFields.email,
          bio: currentFields.bio,
          city: currentFields.city,
          skillNames: currentFields.draftSkillNames,
        },
      });
      await upsertProfileMutation.mutateAsync({
        headline: currentFields.headline.trim(),
        availability: currentFields.availability,
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
    addSkill,
    removeSkill,
    save,
  };
}
