import type { InputHTMLAttributes, ReactNode } from 'react';
import { Field } from '../../shared/ui/Field';

interface AuthFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  error?: string;
  hint?: string;
  rightLabel?: ReactNode;
}

export function AuthField(props: AuthFieldProps) {
  return <Field {...props} />;
}
