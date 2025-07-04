import assert from "assert";
import { parseIntentResponse } from "../src/index";
import type { DashboardIntent } from "../src/types";

const sample: DashboardIntent = {
  action: "create",
  charts: [
    { type: "bar", title: "Sales by Region", xAxis: "region", yAxis: "sales" },
  ],
  filters: [{ field: "region", operator: "equals", value: "East" }],
  sorting: [{ field: "sales", direction: "desc" }],
};

const text = JSON.stringify(sample);
const result = parseIntentResponse(text);
assert.deepStrictEqual(result, sample);
console.log("parseIntentResponse test passed.");