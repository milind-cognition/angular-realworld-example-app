// TODO: Migrate from Angular ListErrorsComponent
import type { Errors } from "../types";

export function ListErrors({ errors }: { errors: Errors | null }) {
  if (!errors) return null;
  const errorList = Object.keys(errors.errors).map(
    (key) => `${key} ${errors.errors[key]}`,
  );
  return (
    <ul className="error-messages">
      {errorList.map((error) => (
        <li key={error}>{error}</li>
      ))}
    </ul>
  );
}
