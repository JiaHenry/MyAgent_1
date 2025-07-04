export class PromptTemplate {
    private readonly prompt: string;

    public constructor(prompt: string) {
        this.prompt = prompt;
    }

    public format() {
        // const response = await openAI.chat.completions.create({ model: "gpt-4o", messages: [{role: "user", content: prompt}] });
        // const jsonRaw = response.choices[0].message.content;
        // return JSON.parse(jsonRaw);
        // TODO, use LLM to help detect indent
        return { 
            model: "gpt-4o", 
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ] 
        };
    }

}
