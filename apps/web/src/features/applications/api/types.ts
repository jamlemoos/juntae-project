import type { PublicUserResponse } from '../../../shared/api/types';

export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

// Returned by: POST /applications, GET /applications, GET /applications/:id,
// PUT /applications/:id, PATCH /applications/:id/status.
export type ApplicationResponse = {
  id: string;
  message: string;
  status: ApplicationStatus;
  userId: string;
  projectRoleId: string;
  createdAt: string;
  updatedAt: string;
};

// Returned by: GET /projects/:id/applications (project owner only).
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

// message is required by the backend (validate:"required,min=10").
// projectRoleId maps to backend field project_role_id.
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
