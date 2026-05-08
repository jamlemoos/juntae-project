import { ArrowRight } from 'lucide-react';
import { CompletionCard } from '../features/profile/components/CompletionCard';
import { ProfileHero } from '../features/profile/components/ProfileHero';
import { ProfileView } from '../features/profile/components/ProfileView';
import { ProfileEditForm } from '../features/profile/components/ProfileEditForm';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useProfileEditForm } from '../features/profile/hooks/useProfileEditForm';
import { useMyProfileQuery } from '../features/users/hooks/useProfileQuery';
import {
  getAvatarInitial,
  getMemberSince,
  getCompletionItems,
} from '../features/profile/utils/profileDisplay';

export function ProfilePage() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const form = useProfileEditForm();
  const { data: myProfile } = useMyProfileQuery();

  const avatarInitial = getAvatarInitial(user?.name);
  const memberSince = getMemberSince(user?.createdAt);
  const completionItems = getCompletionItems(user, myProfile);

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <ProfileHero
        name={user?.name}
        email={user?.email}
        avatarInitial={avatarInitial}
        memberSince={memberSince}
      />

      <section className="flex-1 bg-cream">
        <div className="mx-auto max-w-[1200px] px-6 pb-24">
          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-12 lg:col-span-8">
              {form.isEditing ? (
                <ProfileEditForm
                  fields={form.fields}
                  errors={form.errors}
                  saveError={form.saveError}
                  isSaving={form.isSaving}
                  onSetField={form.setField}
                  onAddSkill={form.addSkill}
                  onRemoveSkill={form.removeSkill}
                  onSave={() => void form.save()}
                  onCancel={form.cancelEdit}
                />
              ) : (
                <ProfileView user={user} profile={myProfile} onStartEdit={form.startEdit} />
              )}
            </div>

            <div className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <CompletionCard items={completionItems} onEdit={form.startEdit} />

                <div className="mt-5 rounded-[20px] bg-cream p-5 ring-1 ring-line">
                  <div className="mono text-[11px] uppercase tracking-[.22em] text-mute">conta</div>
                  <ul className="mt-3 divide-y divide-line text-[14px]">
                    <li className="py-3 first:pt-0 last:pb-0">
                      <button
                        type="button"
                        onClick={logout}
                        className="inline-flex w-full cursor-pointer items-center justify-between gap-2 text-error hover:text-red-700 transition-colors"
                      >
                        Sair da Juntaê
                        <span className="text-error">
                          <ArrowRight size={14} aria-hidden="true" />
                        </span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
