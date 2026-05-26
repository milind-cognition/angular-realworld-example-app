import type { Errors } from "../types";

export function ListErrors({ errors }: { errors: Errors | null }) {
  if (!errors || !errors.errors) return null;

  const errorList = Object.entries(errors.errors).map(
    ([key, value]) => `${key} ${value}`,
  );

  if (errorList.length === 0) return null;

  return (
    <ul className="error-messages">
      {errorList.map((error) => (
        <li key={error}>{error}</li>
      ))}
    </ul>
  );
}
