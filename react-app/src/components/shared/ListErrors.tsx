import type { Errors } from '../../types';

interface ListErrorsProps {
  errors: Errors | null;
}

export function ListErrors({ errors }: ListErrorsProps) {
  if (!errors) {
    return null;
  }

  return (
    <ul className="error-messages">
      {Object.entries(errors.errors).map(([key, value]) => (
        <li key={key}>
          {key} {value}
        </li>
      ))}
    </ul>
  );
}
