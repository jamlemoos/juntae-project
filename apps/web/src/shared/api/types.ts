export type SkillResponse = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type PublicUserResponse = {
  id: string;
  name: string;
  city: string;
  skills: SkillResponse[];
  createdAt: string;
};
