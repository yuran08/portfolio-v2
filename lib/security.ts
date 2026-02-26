import { timingSafeEqual } from "node:crypto";

function toComparableBuffer(value: string, targetLength: number) {
  const source = Buffer.from(value, "utf8");
  const comparable = Buffer.alloc(targetLength);
  source.copy(comparable);
  return { source, comparable };
}

export function safeEqual(
  left: string | null | undefined,
  right: string | null | undefined,
) {
  if (typeof left !== "string" || typeof right !== "string") {
    return false;
  }

  const leftLength = Buffer.byteLength(left, "utf8");
  const rightLength = Buffer.byteLength(right, "utf8");
  const maxLength = Math.max(leftLength, rightLength, 1);

  const normalizedLeft = toComparableBuffer(left, maxLength);
  const normalizedRight = toComparableBuffer(right, maxLength);
  const equalLength =
    normalizedLeft.source.length === normalizedRight.source.length;
  const equalContent = timingSafeEqual(
    normalizedLeft.comparable,
    normalizedRight.comparable,
  );

  return equalLength && equalContent;
}
