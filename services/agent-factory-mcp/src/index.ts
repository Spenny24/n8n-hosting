import crypto from 'node:crypto';

import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { OpenAI } from 'openai';
import { z } from 'zod';

dotenv.config();

const port = Number.parseInt(process.env.PORT ?? '3000', 10);
const allowOrigin = process.env.ALLOW_ORIGIN ?? '*';
const openAiApiKey = process.env.OPENAI_API_KEY;
const openAiModel = process.env.OPENAI_MODEL ?? 'gpt-4.1-mini';

if (!openAiApiKey) {
  throw new Error('OPENAI_API_KEY is required');
}

const openai = new OpenAI({ apiKey: openAiApiKey });

const agentIdeaSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  problem: z.string().min(1),
  persona: z.string().min(1),
  successCriteria: z.array(z.string()).min(1),
  stack: z.array(z.string()).optional().default([]),
  channels: z.array(z.string()).optional().default([]),
  value: z.string().optional(),
});

const contextSchema = z.object({
  priorArtifacts: z.array(z.string().url()).optional().default([]),
  notes: z.string().optional().default(''),
  airtableRecord: z.record(z.any()).optional(),
});

const planSchema = z.object({
  summary: z.string().min(1),
  implementationSteps: z.array(z.string()).min(1),
  governance: z.string().optional(),
  riskRegister: z.array(z.string()).optional().default([]),
});

const generateRequestSchema = z.object({
  idea: agentIdeaSchema,
  context: contextSchema,
  plan: planSchema,
});

const openAiResponseSchema = {
  name: 'agent_factory_manifest',
  schema: {
    type: 'object',
    required: ['projectName', 'summary', 'files'],
    additionalProperties: false,
    properties: {
      projectName: {
        type: 'string',
        description: 'Slugified project identifier (kebab-case).',
      },
      summary: {
        type: 'string',
        description: 'One paragraph summary of the agent design.',
      },
      files: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['path', 'contents'],
          additionalProperties: false,
          properties: {
            path: {
              type: 'string',
              description: 'Path of the file relative to the repo root.',
            },
            contents: {
              type: 'string',
              description: 'File contents encoded as UTF-8 text.',
            },
            description: {
              type: 'string',
              description: 'Short rationale for the file.',
            },
          },
        },
      },
      env: {
        type: 'object',
        additionalProperties: {
          type: 'string',
        },
        description: 'Environment variables required for the agent runtime.',
      },
      nextActions: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Optional checklist of follow-up actions.',
      },
    },
  },
};

const agentFactoryResponseSchema = z.object({
  projectName: z.string().min(1),
  summary: z.string().min(1),
  files: z
    .array(
      z.object({
        path: z.string().min(1),
        contents: z.string(),
        description: z.string().optional(),
        hash: z.string().optional(),
      }),
    )
    .min(1),
  env: z.record(z.string()).optional().default({}),
  nextActions: z.array(z.string()).optional().default([]),
});

const app = express();

app.use(
  cors({
    origin: allowOrigin === '*' ? true : allowOrigin.split(',').map((value) => value.trim()),
  }),
);
app.use(express.json({ limit: '2mb' }));

app.get('/healthz', (_req: Request, res: Response) => {
  res.json({ status: 'ok', model: openAiModel });
});

const systemPrompt = `You are an orchestration layer that produces production-ready agent boilerplate.
Return concise scaffolding that is instantly committable to git.
Honor the provided implementation steps and align dependencies with the declared stack.
Always include:
- README.md with architecture, env var instructions, and deployment steps.
- docker/ or container instructions when deployment hints are provided.
- src/ directory with entry point.
Favor TypeScript + Docker + n8n integrations when applicable.
`;

app.post('/generate', async (req: Request, res: Response) => {
  let parsed;
  try {
    parsed = generateRequestSchema.parse(req.body);
  } catch (error: unknown) {
    return res.status(400).json({
      error: 'Invalid payload',
      details: error instanceof Error ? error.message : error,
    });
  }

  try {
    const requestPayload = {
      model: openAiModel,
      reasoning: { effort: 'medium' },
      input: [
        {
          role: 'system',
          content: [
            {
              type: 'input_text',
              text: systemPrompt,
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: JSON.stringify(parsed, null, 2),
            },
          ],
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: openAiResponseSchema,
      },
    } as Record<string, unknown>;

    const response = await openai.responses.create(requestPayload as never);

    const outputText = response.output_text;

    if (!outputText) {
      throw new Error('OpenAI response did not contain output_text');
    }

    const manifest = agentFactoryResponseSchema.parse(JSON.parse(outputText));

    const filesWithHashes = manifest.files.map((file) => ({
      ...file,
      hash: file.hash ?? crypto.createHash('sha256').update(file.contents, 'utf8').digest('hex'),
    }));

    res.json({
      projectName: manifest.projectName,
      summary: manifest.summary,
      files: filesWithHashes,
      env: manifest.env,
      nextActions: manifest.nextActions,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to generate agent manifest', details: message });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Agent Factory MCP listening on port ${port}`);
});
