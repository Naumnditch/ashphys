/**
 * Rewrites one question's explanation into the structured house style with
 * the Claude API, then validates it. One automatic retry: if the first draft
 * fails validation, the issues are sent back and the model revises it.
 *
 * Server-only. Needs ANTHROPIC_API_KEY (already set on Vercel for receipt
 * scanning, see lib/receipts/analyze.ts).
 */

import Anthropic from '@anthropic-ai/sdk';
import { buildRewritePrompt, type RewriteInput } from './format';
import { validateExplanation, type ExpectedAnswer, type ValidationResult } from './validate';

export const REWRITE_MODEL = 'claude-opus-5-5';

export class RewriteNotConfiguredError extends Error {
  constructor() {
    super('ANTHROPIC_API_KEY is not set, so explanations cannot be rewritten automatically.');
  }
}

export interface RewriteOutcome {
  text: string;
  validation: ValidationResult;
  attempts: number;
}

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) throw new RewriteNotConfiguredError();
  client ??= new Anthropic({ maxRetries: 3, timeout: 120_000 });
  return client;
}

function textOf(message: Anthropic.Beta.BetaMessage): string {
  return message.content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()
    .replace(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n```$/, '$1')
    .trim();
}

async function ask(messages: Anthropic.Beta.BetaMessageParam[]): Promise<Anthropic.Beta.BetaMessage> {
  const message = await getClient().beta.messages.create({
    model: REWRITE_MODEL,
    max_tokens: 16000,
    output_config: { effort: 'medium' },
    // If a request is declined by a safety classifier, the API retries it on
    // a fallback model inside the same call.
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    messages,
  });
  if (message.stop_reason === 'refusal') throw new Error('The model declined to rewrite this explanation.');
  if (message.stop_reason === 'max_tokens') throw new Error('The rewrite was cut off before it finished.');
  return message;
}

export async function rewriteExplanation(input: RewriteInput, expected: ExpectedAnswer): Promise<RewriteOutcome> {
  const messages: Anthropic.Beta.BetaMessageParam[] = [{ role: 'user', content: buildRewritePrompt(input) }];
  let message = await ask(messages);
  let text = textOf(message);
  let validation = validateExplanation(text, expected);
  if (validation.ok) return { text, validation, attempts: 1 };

  messages.push(
    { role: 'assistant', content: message.content },
    {
      role: 'user',
      content: `This draft fails the website's checks:\n${validation.issues.map((i) => `- ${i}`).join('\n')}\n\nReply with the corrected worked solution only, in the same format.`,
    },
  );
  message = await ask(messages);
  text = textOf(message);
  validation = validateExplanation(text, expected);
  return { text, validation, attempts: 2 };
}
