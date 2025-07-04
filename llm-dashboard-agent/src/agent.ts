import { Agent, AgentOptions, Step, StepResult } from './core';
import { DashboardIntent, ICreateDetail, IOperationDetail } from './interface';
import { LLM } from './llm';
import { PromptTemplate } from './prompt';

export class DashboardAgent extends Agent {
  private llm: LLM;
  private logger = console;


  constructor(options: AgentOptions) {
    super(options);
    this.llm = new LLM(options.llmOptions);
  }

  async handleGoal(userQuery: string): Promise<StepResult> {
    //const userQuery = goal.description;

    // Step 1: Analyze user intent using LLM
    const intentAnalysisPrompt = new PromptTemplate(`
      Analyze the following user query to understand their intent regarding dashboard creation.
      Identify if the user wants to:
      1. Create a new dashboard (potentially with multiple charts).
      2. Modify settings for an existing chart.
      3. Apply filters or sorting to data.

      Provide the output as a JSON object with the following structure:
      {
        "intent": "create_dashboard" | "modify_chart" | "apply_data_operation",
        "details": {
          // Specific details based on intent
          // For "create_dashboard": { "dashboard_name": "...", "charts": [{ "type": "...", "data_source": "...", "metrics": "...", "dimensions": "..." }] }
          // For "modify_chart": { "chart_id": "...", "modifications": { "setting_name": "new_value" } }
          // For "apply_data_operation": { "target": "dashboard" | "chart", "target_id": "...", "operation_type": "filter" | "sort", "details": {} }
        }
      }

      User Query: "${userQuery}"
    `);

    const intentAnalysisResponse = await this.llm.generate(intentAnalysisPrompt.format());
    const intentData = JSON.parse(intentAnalysisResponse.text) as DashboardIntent;

    this.logger.info('Intent Analysis:', intentData);

    let nextSteps: Step[] = [];
    let result: StepResult;

    switch (intentData.action) {
      case 'create':
        // Step 2: If intent is to create a dashboard, generate steps for each chart
        const createDetails = intentData.details as ICreateDetail;
        const dashboardName = createDetails.dashboard_name || 'New Dashboard';
        this.logger.info(`Creating dashboard: ${dashboardName}`);

        for (const chart of createDetails.charts?? []) {
          const chartCreationPrompt = new PromptTemplate(`
            Based on the following chart details, generate the necessary steps to create this chart.
            Consider the chart type, data source, metrics, and dimensions.
            Provide the output as a JSON object with a "steps" array, where each step has a "type" and "description".

            Chart Details: ${JSON.stringify(chart)}
          `);
          const chartCreationResponse = await this.llm.generate(chartCreationPrompt.format());
          const chartSteps = JSON.parse(chartCreationResponse.text).steps;
          nextSteps.push(...chartSteps);
        }
        result = {
          status: 'success',
          message: `Dashboard "${dashboardName}" creation steps generated.`,
          nextSteps: nextSteps,
        };
        break;
      case 'modify':
        // Step 2: If intent is to modify a chart, generate steps for modification
        const modifyDetails = intentData.details as ICreateDetail;
        const chartId = modifyDetails.chart_id;
        const modifications = modifyDetails.modifications;
        this.logger.info(`Modifying chart: ${chartId} with changes:`, modifications);

        const chartModificationPrompt = new PromptTemplate(`
          Based on the following chart ID and modifications, generate the necessary steps to apply these changes.
          Provide the output as a JSON object with a "steps" array, where each step has a "type" and "description".

          Chart ID: "${chartId}"
          Modifications: ${JSON.stringify(modifications)}
        `);
        const chartModificationResponse = await this.llm.generate(chartModificationPrompt.format());
        nextSteps = JSON.parse(chartModificationResponse.text).steps;
        result = {
          status: 'success',
          message: `Chart "${chartId}" modification steps generated.`,
          nextSteps: nextSteps,
        };
        break;
      case 'filter':
      case 'sort':
        // Step 2: If intent isto apply a data operation, generate steps for it
        const details = intentData.details as IOperationDetail;
        const target = details.target;
        const targetId = details.targetId;
        const operationType = details.operationType;
        const operationDetails = details.details;
        this.logger.info(`Applying data operation (${operationType}) to ${target} ${targetId}:`, operationDetails);

        const dataOperationPrompt = new PromptTemplate(`
          Based on the following target (${target}, ID: "${targetId}"), operation type ("${operationType}"), and details, generate the necessary steps to apply this data operation.
          Provide the output as a JSON object with a "steps" array, where each step has a "type" and "description".

          Target: "${target}"
          Target ID: "${targetId}"
          Operation Type: "${operationType}"
          Operation Details: ${JSON.stringify(operationDetails)}
        `);
        const dataOperationResponse = await this.llm.generate(dataOperationPrompt.format());
        nextSteps = JSON.parse(dataOperationResponse.text).steps;
        result = {
          status: 'success',
          message: `Data operation (${operationType}) steps for ${target} "${targetId}" generated.`,
          nextSteps: nextSteps,
        };
        break;
      default:
        result = {
          status: 'error',
          message: 'Could not determine a clear intent from the user query.',
          nextSteps: [],
        };
        break;
    }

    return result;
  }

  async handleStep(step: Step): Promise<StepResult> {
    this.logger.info(`Executing step: ${step.description} (Type: ${step.type})`);

    // In a real scenario, you would have specific handlers for each step type
    // For now, we'll just simulate execution and log.
    switch (step.type) {
      case 'create_chart':
        // Simulate creating a chart
        this.logger.info(`Simulating chart creation: ${step.description}`);
        // You might interact with a dashboard API here
        return { status: 'success', message: `Chart "${step.description}" created successfully.` };
      case 'update_chart_settings':
        // Simulate updating chart settings
        this.logger.info(`Simulating updating chart settings: ${step.description}`);
        return { status: 'success', message: `Chart settings "${step.description}" updated successfully.` };
      case 'apply_filter':
        // Simulate applying a filter
        this.logger.info(`Simulating applying filter: ${step.description}`);
        return { status: 'success', message: `Filter "${step.description}" applied successfully.` };
      case 'apply_sort':
        // Simulate applying a sort
        this.logger.info(`Simulating applying sort: ${step.description}`);
        return { status: 'success', message: `Sort "${step.description}" applied successfully.` };
      default:
        this.logger.warn(`Unknown step type: ${step.type}. Simulating generic execution.`);
        return { status: 'success', message: `Step "${step.description}" executed (simulated).` };
    }
  }
}