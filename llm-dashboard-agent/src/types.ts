export type DashboardAction = "create" | "modify" | "filter" | "sort";

export interface ChartIntent {
  type: string;
  title?: string;
  [key: string]: any;
}

export interface FilterIntent {
  field: string;
  operator: string;
  value: string | number | boolean | Array<string | number | boolean>;
}

export interface SortIntent {
  field: string;
  direction: "asc" | "desc";
}

export interface DashboardIntent {
  action: DashboardAction;
  charts?: ChartIntent[];
  filters?: FilterIntent[];
  sorting?: SortIntent[];
  [key: string]: any;
}