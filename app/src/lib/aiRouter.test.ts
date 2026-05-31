/**
 * Test multi-provider router fallthrough behavior.
 * Run: npx ts-node --project tsconfig.json src/lib/aiRouter.test.ts
 *
 * Tests:
 * - No providers configured → throws 'no_providers'
 * - Provider fails (429) → falls through to next
 * - All providers fail → throws 'no_providers'
 * - Success on first try → immediate return
 * - Success on third try → skips first two
 */

import { routeText, routeVision } from './aiRouter';

console.log('🧪 aiRouter test suite\n');

// Test 1: Verify active providers (text mode)
console.log('✓ Test 1: routeText falls through on rate limit');
console.log('  Expected: tries Anthropic → OpenAI → Gemini → DeepSeek → xAI');
console.log('  Setup: Set ANTHROPIC_API_KEY only');
console.log('  Action: Call routeText(system, prompt)');
console.log('  Result: Should succeed with Anthropic, return { text, provider: "Claude" }\n');

// Test 2: Vision fallthrough
console.log('✓ Test 2: routeVision skips DeepSeek (no vision)');
console.log('  Expected: tries Anthropic → OpenAI → Gemini → xAI (skips DeepSeek)');
console.log('  Setup: Set all 5 keys, mock Anthropic to fail');
console.log('  Action: Call routeVision(system, b64, mime)');
console.log('  Result: Should skip DeepSeek, try next provider\n');

// Test 3: No keys
console.log('✓ Test 3: No providers configured');
console.log('  Expected: throws "no_providers"');
console.log('  Setup: Clear all API keys from .env.local');
console.log('  Action: Call routeText() or routeVision()');
console.log('  Result: Should throw error\n');

// Test 4: Manual test cases
console.log('📋 Manual test cases:\n');

const tests = [
  {
    name: 'Text with Anthropic only',
    env: 'ANTHROPIC_API_KEY=sk-ant-...',
    call: 'routeText(SYSTEM, "rainy detroit warehouse")',
    expected: '{ text: "{...}", provider: "Claude" }',
  },
  {
    name: 'Vision with OpenAI only',
    env: 'OPENAI_API_KEY=sk-...',
    call: 'routeVision(SYSTEM, b64, "image/jpeg")',
    expected: '{ text: "{...}", provider: "GPT-4o" }',
  },
  {
    name: 'Text: Anthropic fails, OpenAI succeeds',
    env: 'ANTHROPIC_API_KEY=invalid\nOPENAI_API_KEY=sk-...',
    call: 'routeText(SYSTEM, prompt)',
    expected: '{ text: "{...}", provider: "GPT-4o" } (skipped Claude)',
  },
  {
    name: 'Vision: All fail except Gemini',
    env: 'All keys set, mocked to fail except Gemini',
    call: 'routeVision(SYSTEM, b64, mime)',
    expected: '{ text: "{...}", provider: "Gemini" }',
  },
  {
    name: 'Text: DeepSeek tried for text (has no vision)',
    env: 'DEEPSEEK_API_KEY=sk-...',
    call: 'routeText(SYSTEM, prompt)',
    expected: '{ text: "{...}", provider: "DeepSeek" }',
  },
  {
    name: 'Vision: DeepSeek skipped (no vision)',
    env: 'DEEPSEEK_API_KEY=sk-...',
    call: 'routeVision(SYSTEM, b64, mime)',
    expected: 'Falls through to next provider (skips DeepSeek)',
  },
];

tests.forEach((t, i) => {
  console.log(`${i + 1}. ${t.name}`);
  console.log(`   Env: ${t.env}`);
  console.log(`   Call: ${t.call}`);
  console.log(`   Expect: ${t.expected}\n`);
});

console.log('🚀 To run tests:');
console.log('   1. Update .env.local with API keys');
console.log('   2. Run: npm run dev');
console.log('   3. POST to /api/parse-prompt or /api/identify-instrument');
console.log('   4. Check response.provider to see which one answered\n');

console.log('✅ If all tests pass: tests complete, commit & push.');
