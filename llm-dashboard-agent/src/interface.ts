export interface DashboardIntent {
  action: "create" | "modify" | "filter" | "sort" | "unknown"; // 用户意图主动作
  charts?: ChartIntent[]; // 涉及的图表相关意图
  filters?: FilterIntent[]; // 全局或图表过滤器
  sorts?: SortIntent[]; // 排序要求
}

export interface ChartIntent {
  id?: string; // 图表唯一标识，modify时必填，create时可选
  action: "create" | "modify";
  type?: "bar" | "line" | "pie" | "table" | "scatter" | string; 
  title?: string; 
  dataSource?: string;
  metrics?: string[]; // 用作指标的字段
  dimensions?: string[]; // 维度字段
  visualSettings?: {
    colorScheme?: string; 
    legendVisible?: boolean;
    [key: string]: any;
  }
}

export interface FilterIntent {
  targetChartId?: string; // 不填表示全局过滤
  field: string;
  operator: "equals" | "not_equals" | "in" | "not_in" | "greater_than" | "less_than" | "between"; 
  value: string | number | (string | number)[];
}

export interface SortIntent {
  targetChartId?: string; 
  fields: {
    name: string;
    order: "asc" | "desc";
  }[];
}
