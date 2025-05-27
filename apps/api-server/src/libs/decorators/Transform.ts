import { Transform } from "class-transformer";

export function TransformToBoolean() {
  return Transform(({ obj, key }: { obj: Record<string, string>; key: string }) => {
    if (obj[key] === "true") return true;
    if (obj[key] === "false") return false;
    return obj[key];
  });
}
