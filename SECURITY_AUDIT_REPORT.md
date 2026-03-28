# 🛡️ PROFITS PATROL - SECURITY AUDIT REPORT

**Generated:** 2026-01-28T00:30:57.539Z
**Total Files Scanned:** 64
**Total Issues Found:** 161

---

## 📊 EXECUTIVE SUMMARY

### Risk Score: 10120 / 10000

### Issue Breakdown
- 🔴 **CRITICAL**: 12
- 🟠 **HIGH**: 124
- 🟡 **MEDIUM**: 9
- 🟢 **LOW**: 16

### Overall Assessment
**❌ FAIL** - Critical vulnerabilities detected. DO NOT deploy to production.

---

## 🔥 TOP 10 CRITICAL FINDINGS


### 1. Hardcoded Secrets (CRITICAL)

- **Rule ID:** SEC-001
- **CWE:** CWE-798: Use of Hard-coded Credentials
- **File:** `src\data\mocks.ts`
- **Line:** 7
- **Description:** Hardcoded API keys, passwords, or tokens found

**Code Snippet:**
```typescript
password: '123', // Still needed for mock login, but separated
```

**Recommendation:** Move all secrets to environment variables

---

### 2. Hardcoded Secrets (CRITICAL)

- **Rule ID:** SEC-001
- **CWE:** CWE-798: Use of Hard-coded Credentials
- **File:** `src\data\mocks.ts`
- **Line:** 44
- **Description:** Hardcoded API keys, passwords, or tokens found

**Code Snippet:**
```typescript
password: '123',
```

**Recommendation:** Move all secrets to environment variables

---

### 3. Hardcoded Secrets (CRITICAL)

- **Rule ID:** SEC-001
- **CWE:** CWE-798: Use of Hard-coded Credentials
- **File:** `src\data\mocks.ts`
- **Line:** 56
- **Description:** Hardcoded API keys, passwords, or tokens found

**Code Snippet:**
```typescript
password: '123',
```

**Recommendation:** Move all secrets to environment variables

---

### 4. Hardcoded Secrets (CRITICAL)

- **Rule ID:** SEC-001
- **CWE:** CWE-798: Use of Hard-coded Credentials
- **File:** `src\data\mocks.ts`
- **Line:** 68
- **Description:** Hardcoded API keys, passwords, or tokens found

**Code Snippet:**
```typescript
password: '123',
```

**Recommendation:** Move all secrets to environment variables

---

### 5. Hardcoded Secrets (CRITICAL)

- **Rule ID:** SEC-001
- **CWE:** CWE-798: Use of Hard-coded Credentials
- **File:** `src\locales\ar.ts`
- **Line:** 118
- **Description:** Hardcoded API keys, passwords, or tokens found

**Code Snippet:**
```typescript
password: "كلمة المرور",
```

**Recommendation:** Move all secrets to environment variables

---

### 6. Hardcoded Secrets (CRITICAL)

- **Rule ID:** SEC-001
- **CWE:** CWE-798: Use of Hard-coded Credentials
- **File:** `src\locales\ar.ts`
- **Line:** 120
- **Description:** Hardcoded API keys, passwords, or tokens found

**Code Snippet:**
```typescript
enter_password: "أدخل كلمة المرور",
```

**Recommendation:** Move all secrets to environment variables

---

### 7. Hardcoded Secrets (CRITICAL)

- **Rule ID:** SEC-001
- **CWE:** CWE-798: Use of Hard-coded Credentials
- **File:** `src\locales\ar.ts`
- **Line:** 461
- **Description:** Hardcoded API keys, passwords, or tokens found

**Code Snippet:**
```typescript
password: "كلمة المرور",
```

**Recommendation:** Move all secrets to environment variables

---

### 8. Hardcoded Secrets (CRITICAL)

- **Rule ID:** SEC-001
- **CWE:** CWE-798: Use of Hard-coded Credentials
- **File:** `src\locales\en.ts`
- **Line:** 125
- **Description:** Hardcoded API keys, passwords, or tokens found

**Code Snippet:**
```typescript
password: "Password",
```

**Recommendation:** Move all secrets to environment variables

---

### 9. Hardcoded Secrets (CRITICAL)

- **Rule ID:** SEC-001
- **CWE:** CWE-798: Use of Hard-coded Credentials
- **File:** `src\locales\en.ts`
- **Line:** 127
- **Description:** Hardcoded API keys, passwords, or tokens found

**Code Snippet:**
```typescript
enter_password: "Enter password",
```

**Recommendation:** Move all secrets to environment variables

---

### 10. Hardcoded Secrets (CRITICAL)

- **Rule ID:** SEC-001
- **CWE:** CWE-798: Use of Hard-coded Credentials
- **File:** `src\locales\en.ts`
- **Line:** 416
- **Description:** Hardcoded API keys, passwords, or tokens found

**Code Snippet:**
```typescript
password: "Password",
```

**Recommendation:** Move all secrets to environment variables

---

## 📁 ISSUES BY FILE


### `src\features\game\components\game-templates\StockMarketTemplate.tsx` (Risk: 560)

- **Line 103**: [HIGH] Weak Random Number Generation
- **Line 107**: [HIGH] Weak Random Number Generation
- **Line 110**: [HIGH] Weak Random Number Generation
- **Line 113**: [HIGH] Weak Random Number Generation
- **Line 116**: [HIGH] Weak Random Number Generation
- **Line 119**: [HIGH] Weak Random Number Generation
- **Line 125**: [HIGH] Weak Random Number Generation
- **Line 141**: [HIGH] Weak Random Number Generation


### `src\features\game\components\UniversalBusinessGame.tsx` (Risk: 490)

- **Line 141**: [HIGH] console.log in Production
- **Line 166**: [HIGH] console.log in Production
- **Line 170**: [HIGH] console.log in Production
- **Line 199**: [HIGH] console.log in Production
- **Line 317**: [HIGH] Weak Random Number Generation
- **Line 134**: [HIGH] localStorage with Sensitive Data
- **Line 188**: [HIGH] localStorage with Sensitive Data


### `src\data\mocks.ts` (Risk: 360)

- **Line 7**: [CRITICAL] Hardcoded Secrets
- **Line 44**: [CRITICAL] Hardcoded Secrets
- **Line 56**: [CRITICAL] Hardcoded Secrets
- **Line 68**: [CRITICAL] Hardcoded Secrets


### `src\features\game\components\game-templates\SimulationTemplate.tsx` (Risk: 350)

- **Line 73**: [HIGH] console.log in Production
- **Line 95**: [HIGH] console.log in Production
- **Line 157**: [HIGH] Weak Random Number Generation
- **Line 51**: [HIGH] localStorage with Sensitive Data
- **Line 91**: [HIGH] localStorage with Sensitive Data


### `src\lib\analytics.ts` (Risk: 350)

- **Line 38**: [HIGH] console.log in Production
- **Line 56**: [HIGH] console.log in Production
- **Line 74**: [HIGH] console.log in Production
- **Line 78**: [HIGH] console.log in Production
- **Line 81**: [HIGH] console.log in Production


### `src\store\slices\gameSlice.ts` (Risk: 320)

- **Line 460**: [CRITICAL] BizCoins Manipulation
- **Line 473**: [CRITICAL] BizCoins Manipulation
- **Line 130**: [HIGH] console.log in Production
- **Line 261**: [HIGH] console.log in Production


### `src\features\admin\components\AdminDashboard.tsx` (Risk: 280)

- **Line 908**: [HIGH] console.log in Production
- **Line 109**: [HIGH] Weak Random Number Generation
- **Line 111**: [HIGH] Weak Random Number Generation
- **Line 296**: [HIGH] Weak Random Number Generation


### `src\features\game\components\game-templates\DefenseTemplate.tsx` (Risk: 280)

- **Line 43**: [HIGH] Weak Random Number Generation
- **Line 101**: [HIGH] Weak Random Number Generation
- **Line 104**: [HIGH] Weak Random Number Generation
- **Line 105**: [HIGH] Weak Random Number Generation


### `src\features\game\components\game-templates\ServiceTemplate.tsx` (Risk: 280)

- **Line 69**: [HIGH] Weak Random Number Generation
- **Line 76**: [HIGH] Weak Random Number Generation
- **Line 77**: [HIGH] Weak Random Number Generation
- **Line 80**: [HIGH] Weak Random Number Generation


### `src\features\tank\components\NegotiationBattle.tsx` (Risk: 280)

- **Line 60**: [HIGH] Weak Random Number Generation
- **Line 62**: [HIGH] Weak Random Number Generation
- **Line 80**: [HIGH] Weak Random Number Generation
- **Line 88**: [HIGH] Weak Random Number Generation


### `src\lib\ai\index.ts` (Risk: 280)

- **Line 31**: [HIGH] console.log in Production
- **Line 35**: [HIGH] console.log in Production
- **Line 43**: [HIGH] console.log in Production
- **Line 51**: [HIGH] console.log in Production


### `src\lib\ai\providers\GeminiProvider.ts` (Risk: 280)

- **Line 16**: [HIGH] console.log in Production
- **Line 42**: [HIGH] console.log in Production
- **Line 64**: [HIGH] console.log in Production
- **Line 89**: [HIGH] console.log in Production


### `src\services\logger.ts` (Risk: 280)

- **Line 27**: [HIGH] console.log in Production
- **Line 34**: [HIGH] console.log in Production
- **Line 40**: [HIGH] console.log in Production
- **Line 46**: [HIGH] console.log in Production
- **Line 29**: [LOW] TODO/FIXME Comments
- **Line 35**: [LOW] TODO/FIXME Comments
- **Line 41**: [LOW] TODO/FIXME Comments


### `src\locales\ar.ts` (Risk: 270)

- **Line 118**: [CRITICAL] Hardcoded Secrets
- **Line 120**: [CRITICAL] Hardcoded Secrets
- **Line 461**: [CRITICAL] Hardcoded Secrets


### `src\locales\en.ts` (Risk: 270)

- **Line 125**: [CRITICAL] Hardcoded Secrets
- **Line 127**: [CRITICAL] Hardcoded Secrets
- **Line 416**: [CRITICAL] Hardcoded Secrets


### `src\features\education\components\UniversalLessonEngine.tsx` (Risk: 210)

- **Line 201**: [HIGH] console.log in Production
- **Line 228**: [HIGH] console.log in Production
- **Line 125**: [HIGH] Weak Random Number Generation


### `src\features\game\components\game-templates\QualityControlTemplate.tsx` (Risk: 210)

- **Line 85**: [HIGH] Weak Random Number Generation
- **Line 86**: [HIGH] Weak Random Number Generation
- **Line 91**: [HIGH] Weak Random Number Generation


### `src\features\game\components\game-templates\TradingTemplate.tsx` (Risk: 210)

- **Line 47**: [HIGH] Weak Random Number Generation
- **Line 61**: [HIGH] Weak Random Number Generation
- **Line 83**: [HIGH] Weak Random Number Generation


### `src\features\hq\components\DifficultySelectModal.tsx` (Risk: 210)

- **Line 19**: [HIGH] console.log in Production
- **Line 20**: [HIGH] console.log in Production
- **Line 21**: [HIGH] console.log in Production


### `src\features\hq\components\KidMap.tsx` (Risk: 210)

- **Line 337**: [HIGH] Weak Random Number Generation
- **Line 339**: [HIGH] Weak Random Number Generation
- **Line 346**: [HIGH] Weak Random Number Generation


### `src\features\tank\logic\TheTankEngine.ts` (Risk: 210)

- **Line 98**: [HIGH] Weak Random Number Generation
- **Line 125**: [HIGH] Weak Random Number Generation
- **Line 135**: [HIGH] Weak Random Number Generation


### `src\hooks\useConfetti.ts` (Risk: 210)

- **Line 19**: [HIGH] Weak Random Number Generation
- **Line 31**: [HIGH] Weak Random Number Generation
- **Line 32**: [HIGH] Weak Random Number Generation


### `src\lib\ai\providers\DeepSeekProvider.ts` (Risk: 210)

- **Line 51**: [HIGH] console.log in Production
- **Line 74**: [HIGH] console.log in Production
- **Line 94**: [HIGH] console.log in Production


### `src\lib\ai\providers\OllamaProvider.ts` (Risk: 210)

- **Line 33**: [HIGH] console.log in Production
- **Line 59**: [HIGH] console.log in Production
- **Line 80**: [HIGH] console.log in Production


### `src\lib\ai\providers\OpenRouterProvider.ts` (Risk: 210)

- **Line 54**: [HIGH] console.log in Production
- **Line 77**: [HIGH] console.log in Production
- **Line 98**: [HIGH] console.log in Production


### `src\lib\gemini.ts` (Risk: 210)

- **Line 35**: [HIGH] Weak Random Number Generation
- **Line 36**: [HIGH] Weak Random Number Generation
- **Line 178**: [HIGH] Weak Random Number Generation


### `src\lib\stripe.ts` (Risk: 210)

- **Line 21**: [HIGH] console.log in Production
- **Line 28**: [HIGH] console.log in Production
- **Line 37**: [HIGH] console.log in Production


### `src\features\auth\components\ParentalGate.tsx` (Risk: 180)

- **Line 24**: [HIGH] Weak Random Number Generation
- **Line 25**: [HIGH] Weak Random Number Generation
- **Line 49**: [MEDIUM] Missing CSRF Protection


### `src\app\main.tsx` (Risk: 140)

- **Line 17**: [HIGH] console.log in Production
- **Line 18**: [HIGH] console.log in Production


### `src\components\feedback\ReloadPrompt.tsx` (Risk: 140)

- **Line 11**: [HIGH] console.log in Production
- **Line 14**: [HIGH] console.log in Production


### `src\features\game\components\game-templates\DrivingTemplate.tsx` (Risk: 140)

- **Line 57**: [HIGH] Weak Random Number Generation
- **Line 58**: [HIGH] Weak Random Number Generation


### `src\features\game\components\game-templates\SortingTemplate.tsx` (Risk: 140)

- **Line 32**: [HIGH] Weak Random Number Generation
- **Line 33**: [HIGH] Weak Random Number Generation


### `src\features\game\components\NewsTicker.tsx` (Risk: 140)

- **Line 13**: [HIGH] Weak Random Number Generation
- **Line 22**: [HIGH] Weak Random Number Generation


### `src\services\persistence\SupabaseAdapter.ts` (Risk: 140)

- **Line 13**: [HIGH] console.log in Production
- **Line 22**: [HIGH] console.log in Production
- **Line 77**: [LOW] TODO/FIXME Comments


### `src\features\auth\components\Auth.tsx` (Risk: 80)

- **Line 116**: [MEDIUM] Missing CSRF Protection
- **Line 203**: [MEDIUM] Missing CSRF Protection


### `src\features\marketing\components\StripePaymentPage.tsx` (Risk: 80)

- **Line 158**: [MEDIUM] Missing CSRF Protection
- **Line 191**: [MEDIUM] Missing CSRF Protection


### `src\app\App.tsx` (Risk: 70)

- **Line 249**: [HIGH] console.log in Production
- **Line 103**: [LOW] Disabled TypeScript Checks


### `src\components\feedback\ErrorBoundary.tsx` (Risk: 70)

- **Line 25**: [HIGH] console.log in Production


### `src\features\admin\components\AdminProjectPanel.tsx` (Risk: 70)

- **Line 54**: [HIGH] console.log in Production


### `src\features\education\components\GradeReview.tsx` (Risk: 70)

- **Line 57**: [HIGH] console.log in Production


### `src\features\education\components\ModuleRecap.tsx` (Risk: 70)

- **Line 81**: [HIGH] console.log in Production


### `src\features\education\components\TeacherDashboard.tsx` (Risk: 70)

- **Line 270**: [HIGH] Weak Random Number Generation


### `src\features\game\components\CoffeeCart.tsx` (Risk: 70)

- **Line 32**: [HIGH] Weak Random Number Generation
- **Line 91**: [LOW] Disabled TypeScript Checks


### `src\features\game\components\game-templates\AudienceMatcher.tsx` (Risk: 70)

- **Line 49**: [HIGH] Weak Random Number Generation


### `src\features\game\components\game-templates\MatchingTemplate.tsx` (Risk: 70)

- **Line 36**: [HIGH] Weak Random Number Generation


### `src\features\game\components\game-templates\OperationsTemplate.tsx` (Risk: 70)

- **Line 101**: [HIGH] Weak Random Number Generation
- **Line 162**: [LOW] Disabled TypeScript Checks


### `src\features\game\components\game-templates\PhysicsTemplate.tsx` (Risk: 70)

- **Line 77**: [HIGH] Weak Random Number Generation


### `src\features\game\components\game-templates\TimelineTemplate.tsx` (Risk: 70)

- **Line 33**: [HIGH] Weak Random Number Generation


### `src\features\game\components\LemonadeStand.tsx` (Risk: 70)

- **Line 45**: [HIGH] Weak Random Number Generation


### `src\features\marketing\components\CheckoutPage.tsx` (Risk: 70)

- **Line 37**: [HIGH] console.log in Production


### `src\features\scenarios\utils\bossLauncher.ts` (Risk: 70)

- **Line 20**: [HIGH] console.log in Production


### `src\features\tank\logic\AnalyticsService.ts` (Risk: 70)

- **Line 6**: [HIGH] console.log in Production


### `src\store\slices\educationSlice.ts` (Risk: 70)

- **Line 83**: [HIGH] console.log in Production


### `src\store\slices\userSlice.ts` (Risk: 70)

- **Line 244**: [HIGH] Weak Random Number Generation
- **Line 126**: [LOW] Disabled TypeScript Checks
- **Line 344**: [LOW] Disabled TypeScript Checks


### `src\utils\safeCallback.ts` (Risk: 70)

- **Line 15**: [HIGH] console.log in Production


### `src\features\admin\components\AdminBookManager.tsx` (Risk: 40)

- **Line 98**: [MEDIUM] Missing CSRF Protection


### `src\features\dashboard\components\CreateBountyModal.tsx` (Risk: 40)

- **Line 56**: [MEDIUM] Missing CSRF Protection


### `src\features\education\components\JoinClassModal.tsx` (Risk: 40)

- **Line 49**: [MEDIUM] Missing CSRF Protection


### `src\features\education\components\ProjectSubmitter.tsx` (Risk: 40)

- **Line 292**: [MEDIUM] Missing CSRF Protection


### `src\features\admin\components\AdminLiveSessionManager.tsx` (Risk: 0)

- **Line 154**: [LOW] Disabled TypeScript Checks


### `src\features\admin\components\AdminVideoManager.tsx` (Risk: 0)

- **Line 108**: [LOW] Disabled TypeScript Checks


### `src\features\game\components\game-templates\RepairTemplate.tsx` (Risk: 0)

- **Line 71**: [LOW] TODO/FIXME Comments


### `src\features\game\components\GameEngine.tsx` (Risk: 0)

- **Line 91**: [LOW] Disabled TypeScript Checks
- **Line 205**: [LOW] Disabled TypeScript Checks
- **Line 207**: [LOW] Disabled TypeScript Checks


### `src\services\payment\PaymentService.ts` (Risk: 0)

- **Line 29**: [LOW] TODO/FIXME Comments


---

## 🔧 REMEDIATION CHECKLIST

### Immediate Actions (Critical)
- [ ] Fix **Hardcoded Secrets** in `src\data\mocks.ts:7`
- [ ] Fix **Hardcoded Secrets** in `src\data\mocks.ts:44`
- [ ] Fix **Hardcoded Secrets** in `src\data\mocks.ts:56`
- [ ] Fix **Hardcoded Secrets** in `src\data\mocks.ts:68`
- [ ] Fix **Hardcoded Secrets** in `src\locales\ar.ts:118`
- [ ] Fix **Hardcoded Secrets** in `src\locales\ar.ts:120`
- [ ] Fix **Hardcoded Secrets** in `src\locales\ar.ts:461`
- [ ] Fix **Hardcoded Secrets** in `src\locales\en.ts:125`
- [ ] Fix **Hardcoded Secrets** in `src\locales\en.ts:127`
- [ ] Fix **Hardcoded Secrets** in `src\locales\en.ts:416`
- [ ] Fix **BizCoins Manipulation** in `src\store\slices\gameSlice.ts:460`
- [ ] Fix **BizCoins Manipulation** in `src\store\slices\gameSlice.ts:473`

### High Priority
- [ ] Address **console.log in Production** in `src\app\App.tsx:249`
- [ ] Address **console.log in Production** in `src\app\main.tsx:17`
- [ ] Address **console.log in Production** in `src\app\main.tsx:18`
- [ ] Address **console.log in Production** in `src\components\feedback\ErrorBoundary.tsx:25`
- [ ] Address **console.log in Production** in `src\components\feedback\ReloadPrompt.tsx:11`
- [ ] Address **console.log in Production** in `src\components\feedback\ReloadPrompt.tsx:14`
- [ ] Address **console.log in Production** in `src\features\admin\components\AdminDashboard.tsx:908`
- [ ] Address **Weak Random Number Generation** in `src\features\admin\components\AdminDashboard.tsx:109`
- [ ] Address **Weak Random Number Generation** in `src\features\admin\components\AdminDashboard.tsx:111`
- [ ] Address **Weak Random Number Generation** in `src\features\admin\components\AdminDashboard.tsx:296`

### Before Production Deployment
- [ ] Run `npm audit` and fix all vulnerabilities
- [ ] Conduct manual code review of authentication logic
- [ ] Test all file upload validations
- [ ] Verify Stripe integration uses server-side pricing
- [ ] Confirm parental consent mechanism is tamper-proof
- [ ] Enable error monitoring (Sentry/LogRocket)
- [ ] Set up rate limiting on all API endpoints
- [ ] Configure HTTPS-only with HSTS headers
- [ ] Review and remove all console.log statements
- [ ] Conduct penetration testing

---

## 📚 REFERENCES

- [OWASP Top 10 (2021)](https://owasp.org/Top10/)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)
- [COPPA Compliance Guide](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions)
- [React Security Best Practices](https://react.dev/learn/security)

---

**END OF REPORT**
