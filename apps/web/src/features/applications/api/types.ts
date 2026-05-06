import type { PublicUserResponse } from '../../../shared/api/types';

export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export type ApplicationResponse = {
  id: string;
  message: string;
  status: ApplicationStatus;
  userId: string;
  projectRoleId: string;
  createdAt: string;
  updatedAt: string;
};

export type ApplicationDetailResponse = {
  id: string;
  message: string;
  status: ApplicationStatus;
  user: PublicUserResponse;
  projectRoleId: string;
  roleTitle: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateApplicationRequest = {
  projectRoleId: string;
  message: string;
};

export type UpdateApplicationRequest = {
  message: string;
};

export type UpdateApplicationStatusRequest = {
  status: 'ACCEPTED' | 'REJECTED';
};
