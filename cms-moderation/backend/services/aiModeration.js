// ============================================================
// AI Moderation Scoring Service
// ------------------------------------------------------------
// This runs fully offline — no external AI API key needed — so it works
// out of the box. It scores a piece of content from 0 (clean) to 100
// (very risky) using a set of simple, explainable rules:
//   - flagged keyword matches (spam / abuse word list)
//   - link/URL density
//   - ALL CAPS ratio (shouting)
//   - excessive punctuation ("!!!", "???")
//   - repeated character spam ("soooooo")
//
// Because every rule is transparent, the dashboard can show the admin
// EXACTLY why something was flagged (the "risk_reasons" list), which
// matters a lot for an audit trail. If you later want to swap this for
// a real LLM-based classifier, replace the body of `scoreContent()` and
// keep the same return shape: { score, reasons }.
// ============================================================

const FLAGGED_KEYWORDS = [
  'scam', 'spam', 'click here', 'buy followers', 'free money',
  'crypto giveaway', 'hate', 'kill', 'idiot', 'stupid', 'racist',
  'nsfw', 'xxx', 'viagra', 'casino', 'bet now',
];

const URL_REGEX = /https?:\/\/[^\s]+/gi;

function scoreContent(text = '') {
  const reasons = [];
  let score = 0;
  const lower = text.toLowerCase();

  // 1. Flagged keywords (10 points each, capped)
  const keywordHits = FLAGGED_KEYWORDS.filter((kw) => lower.includes(kw));
  if (keywordHits.length > 0) {
    const pts = Math.min(keywordHits.length * 15, 45);
    score += pts;
    reasons.push(`Contains flagged term(s): ${keywordHits.join(', ')}`);
  }

  // 2. Link density
  const urls = text.match(URL_REGEX) || [];
  if (urls.length >= 2) {
    score += 25;
    reasons.push(`Contains ${urls.length} links (possible spam)`);
  } else if (urls.length === 1) {
    score += 8;
    reasons.push('Contains a link');
  }

  // 3. ALL CAPS ratio (only checked on longer text to avoid false positives on short titles)
  const letters = text.replace(/[^a-zA-Z]/g, '');
  if (letters.length > 12) {
    const capsRatio = (letters.match(/[A-Z]/g) || []).length / letters.length;
    if (capsRatio > 0.6) {
      score += 15;
      reasons.push('Excessive capitalization ("shouting")');
    }
  }

  // 4. Excessive punctuation
  if (/[!?]{3,}/.test(text)) {
    score += 10;
    reasons.push('Excessive punctuation (e.g. "!!!")');
  }

  // 5. Repeated character spam, e.g. "sooooo good"
  if (/(.)\1{4,}/.test(text)) {
    score += 8;
    reasons.push('Repeated-character spam pattern');
  }

  score = Math.max(0, Math.min(100, score));
  return { score, reasons };
}

// Convenience helper: turns a numeric score into a status suggestion.
// The dashboard still requires a human moderator to actually approve/reject —
// this is only a suggestion, never an auto-decision.
function suggestStatus(score) {
  if (score >= 60) return 'flagged';
  if (score >= 30) return 'pending';
  return 'pending';
}

module.exports = { scoreContent, suggestStatus };
