import { nanoid } from "nanoid";

export const generateId = (len?: number) => {
  return nanoid(len);
};
