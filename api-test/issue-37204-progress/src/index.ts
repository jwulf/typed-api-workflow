#!/usr/bin/env tsx
/**
 * Fetch progress for GitHub issue camunda/camunda#37204.
 * Extracts the section titled "Test Scope & Checklist" and counts markdown checklist items.
 * Output format: totalChecked/totalItems percent%
 */

import https from 'node:https';

interface IssueResponse { body?: string }

const REPO = process.env.ISSUE_REPO || 'camunda/camunda';
const ISSUE = process.env.ISSUE_NUMBER || '37204';
const SECTION_TITLE = 'Test Scope & Checklist';

function fetchIssue(repo: string, issue: string): Promise<IssueResponse> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${repo}/issues/${issue}`,
      method: 'GET',
      headers: {
        'User-Agent': 'issue-progress-script',
        'Accept': 'application/vnd.github+json'
      }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', d => { data += d; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function extractSection(body: string, title: string): string | null {
  const lines = body.split(/\r?\n/);
  const startIdx = lines.findIndex(l => l.trim().toLowerCase().startsWith('###') && l.toLowerCase().includes(title.toLowerCase()));
  if (startIdx === -1) return null;
  let endIdx = lines.length;
  for (let i = startIdx + 1; i < lines.length; i++) {
    const t = lines[i].trim();
    if (/^#{2,}\s/.test(t)) { // next heading
      endIdx = i; break;
    }
  }
  return lines.slice(startIdx + 1, endIdx).join('\n');
}

async function main() {
  const issue = await fetchIssue(REPO, ISSUE);
  const body = issue.body || '';
  const section = extractSection(body, SECTION_TITLE) || body; // fallback to full body if section not found
  const checkboxRe = /- \[( |x|X)\] /g;
  let match: RegExpExecArray | null;
  let total = 0; let checked = 0;
  while ((match = checkboxRe.exec(section)) !== null) {
    total++;
    if (match[1].toLowerCase() === 'x') checked++;
  }
  const percent = total === 0 ? 0 : Math.round((checked / total) * 100);
  const output = `${checked}/${total} ${percent}%`;
  console.log(output);
  if (process.env.ISSUE_PROGRESS_VERBOSE === '1') {
    console.log(`Section scanned: ${SECTION_TITLE}`);
  }
}

main().catch(err => {
  console.error('Failed to compute issue progress:', err);
  process.exit(1);
});
