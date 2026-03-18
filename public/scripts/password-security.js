// ============================================================
//  PASSWORD SECURITY PROTOCOL
// ============================================================

// --- 1. ENTROPY CALCULATOR ---
function calcEntropy(password) {
  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/[0-9]/.test(password)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(password)) pool += 32;
  return pool ? Math.round(password.length * Math.log2(pool)) : 0;
}

// --- 2. STRENGTH SCORER (returns 0–4) ---
function scorePassword(password) {
  if (!password) return -1;

  let score = 0;
  if (password.length >= 8)          score++;
  if (password.length >= 16)         score++;
  if (/[A-Z]/.test(password))        score++;
  if (/[a-z]/.test(password))        score++;
  if (/[0-9]/.test(password))        score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return 0; // Very weak
  if (score <= 3) return 1; // Weak
  if (score <= 4) return 2; // Fair
  if (score <= 5) return 3; // Strong
  return 4;                 // Very strong
}

const STRENGTH_LABELS = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'];
const STRENGTH_COLORS = ['#dc3545', '#fd7e14', '#ffc107', '#20c997', '#51cf66'];

// --- 3. REQUIREMENTS CHECKER ---
function checkRequirements(password) {
  return {
    minLength:    password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber:    /[0-9]/.test(password),
    hasSymbol:    /[^a-zA-Z0-9]/.test(password),
    recommended:  password.length >= 16,
  };
}

// --- 4. SMART TIP GENERATOR ---
function getSecurityTip(password) {
  if (!password)                      return null;
  if (password.length < 8)           return 'Use at least 8 characters.';
  if (!/[A-Z]/.test(password))       return 'Add uppercase letters.';
  if (!/[a-z]/.test(password))       return 'Add lowercase letters.';
  if (!/[0-9]/.test(password))       return 'Add at least one number.';
  if (!/[^a-zA-Z0-9]/.test(password)) return 'Add a special character (!@#$%^&*).';
  if (password.length < 16)          return 'Use 16+ characters for best security.';
  return null; // All good!
}

// --- 5. FULL ANALYSIS (combines everything) ---
function analyzePassword(password) {
  const score = scorePassword(password);
  return {
    score,
    label:        score >= 0 ? STRENGTH_LABELS[score] : 'No password',
    entropy:      calcEntropy(password),
    requirements: checkRequirements(password),
    tip:          getSecurityTip(password),
    isValid:      score >= 2, // Fair or better (changed from 3 to allow Fair passwords)
  };
}

// --- 6. SECURE PASSWORD GENERATOR ---
function generatePassword(length = 20) {
  const lower  = 'abcdefghijklmnopqrstuvwxyz';
  const upper  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums   = '0123456789';
  const syms   = '!@#$%^&*_+-=?';
  const all    = lower + upper + nums + syms;

  // Guarantee at least one of each character type
  let password = [
    lower[Math.floor(Math.random() * lower.length)],
    upper[Math.floor(Math.random() * upper.length)],
    nums[Math.floor(Math.random() * nums.length)],
    syms[Math.floor(Math.random() * syms.length)],
  ];

  for (let i = 4; i < length; i++) {
    password.push(all[Math.floor(Math.random() * all.length)]);
  }

  // Shuffle to avoid predictable positions
  return password.sort(() => Math.random() - 0.5).join('');
}
