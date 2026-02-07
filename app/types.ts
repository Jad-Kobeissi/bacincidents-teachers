export interface TAdmin {
  id: number;
  username: string;
  password: string;
}

export interface TChild {
  id: number;
  name: string;
  grade: string;
  parentId: number;
  Parent: TParent;
  Incident: TIncident[];
}

export interface TIncident {
  id: number;
  title: string;
  description: string;
  category: Category;
  childId: number;
  occurredAt: Date;
  severity: number | null;
  type: Type;
  Child: TChild;
}

export interface TParent {
  id: number;
  name: string;
  email: string;
  Child: TChild[];
}

enum Category {
  Warning,
  Information,
  Urgent,
  Positive,
}

enum Type {
  positive,
  negative,
  informational,
}
