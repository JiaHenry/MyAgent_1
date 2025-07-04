export type NodeObject = Record<string, unknown>;

export interface ILLMResponse {
    success: boolean;
    text: string;
    error?: string;
}


export class Agent {
    constructor(public options: AgentOptions) {
        console.log(options);
    }
}

export interface AgentOptions {
    llmOptions: NodeObject;
    [key: string]: unknown;
}

//Goal, Step, StepResult, Workspace

export interface Goal {
    // TODO:
}

export interface Step {
    type: string;
    description: string;
    // TODO:
}


export interface StepResult {
          status: 'success' | 'error',
          message: string;   // `Data operation (${operationType}) steps for ${target} "${targetId}" generated.`,
          nextSteps?: Step[],
}