export interface Diary {
  id?: string;
  title: string;
  type: "private" | "public";
  createdAt?: string;
  updateAt?: string;
  userId?: string;
  entryIds: string[] | null;
}
