import { Injectable } from '@nestjs/common';
import { createAgent } from 'langchain';
import { InMemoryStore } from '@langchain/langgraph';
import { GetRecipeByUsecase } from '../../recipes/application/get-recipe-by.usecase';
import { createRecipeLookupTool } from '../infrastructure/tools/recipe-lookup.tool';

@Injectable()
export class AgentUseCase {
  agent: any;

  constructor(private readonly recipe: GetRecipeByUsecase) {
    this.agent = createAgent({
      model: 'openai:gpt-4o',
      tools: [createRecipeLookupTool(this.recipe)],
      store: new InMemoryStore(),
      systemPrompt: `
                You are a helpful chef assistant. Be concise and accurate.
                You can only answer questions using information obtained
                from tools you have access to. If no tool is relevant, you
                must refuse to answer.
            `,
    });
  }

  async *call(message: string): AsyncGenerator<string> {
    const stream = await this.agent.stream({
      messages: [{ role: 'user', content: message }],
    });
    for await (const chunk of stream) {
      yield chunk.content
    }
  }
}
