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
  childId: number;
  occurredAt: Date;
  severity: Severity;
  category: Category;
  Child: TChild;
}

export interface TParent {
  id: number;
  name: string;
  email: string;
  children: TChild[];
}
export interface TAdmin {
  id: number;
  identifier: string;
}

enum Category {
  Warning,
  Information,
  Positive,
  Urgent,
}
enum Severity {
  low,
  medium,
  high,
}
