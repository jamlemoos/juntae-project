import type { InputHTMLAttributes } from 'react';
import { Field } from '../../../shared/ui/Field';

interface ProjectFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  error?: string;
}

export function ProjectField(props: ProjectFieldProps) {
  return <Field {...props} />;
}
