# AI Workflow Comparison

## Overview

This assignment compares two different AI-assisted development workflows while building the same React authentication interface.

- **Round 1** was created using a single, vague AI prompt with minimal guidance.
- **Round 2** was created using a detailed prompt, implementation planning, constraints, verification, testing, and multiple review iterations.

The goal was to compare the quality of the generated code, UI consistency, accessibility, correctness, maintainability, and the amount of manual review required.

---

# Round 1

## Workflow

Round 1 was generated using a single, simple prompt without providing detailed requirements, file references, implementation constraints, or verification steps.

The generated application included:

- Login form
- Signup form
- Basic client-side validation
- Password visibility toggle

The implementation worked, but several usability, accessibility, and UI issues remained.

---

## Observed Issues

### 1. Inconsistent UI

The Login and Signup screens had different card heights and spacing, making the interface look inconsistent.

### 2. Scrollbar Appeared

The authentication card contained a vertical scrollbar even though the content should fit naturally inside the card.

### 3. Forgot Password Was Incomplete

The "Forgot Password" text existed but clicking it did not open a reset password workflow.

### 4. No Password Confirmation

Signup only asked for one password, increasing the possibility of user mistakes.

### 5. Basic Validation Only

Validation was limited and did not cover several common edge cases.

### 6. No Loading Feedback

Submitting forms showed no loading state, making the interface feel unresponsive.

### 7. No Success Feedback

Users received little visual confirmation after completing actions.

### 8. No Automated Testing

No React Testing Library tests were generated.

### 9. Accessibility Problems

Interactive text used non-semantic elements instead of accessible buttons.

---

# Round 2

## Workflow

Round 2 followed a structured AI development workflow.

Instead of asking AI to simply generate code, the process included:

1. Understanding the existing authentication component.
2. Creating an implementation plan.
3. Adding new functionality.
4. Preserving existing behaviour.
5. Improving accessibility.
6. Adding automated tests.
7. Running tests for verification.
8. Reviewing the generated code.
9. Refining the UI until it matched the original design.

This resulted in a much more complete and reliable implementation.

---

# Improvements in Round 2

## UI Improvements

Compared to Round 1, several visual improvements were made.

- Consistent card size across Login, Signup, and Reset Password screens.
- Removed unnecessary scrolling inside the authentication card.
- Better spacing between form fields.
- Improved alignment throughout the interface.
- More polished visual appearance.
- Restored original thumbnail styling after accessibility changes.
- Restored the original password field appearance while keeping accessible button elements.
- Consistent styling across all authentication screens.

---

## Functional Improvements

Round 2 introduced several new features.

### Complete Forgot Password Workflow

Users can now:

- Open the Reset Password page.
- Enter their email.
- Enter a new password.
- Confirm the new password.
- Return to the Login screen.

---

### Improved Signup

Signup now includes:

- Confirm Password field
- Password matching validation
- Better error handling

---

### Better Validation

Validation now handles:

- Empty fields
- Invalid email format
- Password mismatch
- Missing required values

---

### Simulated Authentication

Authentication is now simulated using **localStorage**, allowing user registration and login without a backend.

---

### Loading States

Buttons display loading states during simulated requests, improving user experience.

---

### Success and Error Messages

Users receive clear feedback after successful or failed actions.

---

### Clickable Image Gallery

Thumbnail images now correctly update the large preview image.

---

# Accessibility Improvements

Round 2 also improves accessibility.

Changes include:

- Replaced clickable `<a>` elements with semantic `<button>` elements.
- Better keyboard navigation.
- Screen-reader friendly labels.
- Appropriate ARIA attributes.
- Proper autocomplete attributes.
- Focus indicators.
- Reduced accessibility warnings.

---

# Testing and Verification

Unlike Round 1, Round 2 includes automated testing using **React Testing Library**.

The following behaviours were verified:

- Login renders by default.
- Signup page opens correctly.
- Signup returns to Login.
- Forgot Password page opens.
- Reset Password returns to Login.

All tests passed successfully.

---

# AI Mistakes I Caught

Although Round 2 produced significantly better results, it still required manual review.

## 1. Accessibility Issues

The AI initially used anchor elements for interactive actions.

These were replaced with semantic buttons.

---

## 2. Missing Automated Tests

The first implementation did not include tests.

I requested React Testing Library tests and verified all of them manually.

---

## 3. Incomplete Forgot Password Workflow

The initial implementation required additional prompting before it correctly handled:

- Email validation
- Password confirmation
- Navigation
- Success messages

---

## 4. UI Regression

One iteration accidentally changed the original design.

The updated code worked correctly, but:

- Thumbnail buttons changed appearance.
- Password eye icons became oversized.
- Some spacing and styling differed from the original interface.

I refined the prompts so the AI restored the original UI while preserving all functional and accessibility improvements.

---

# Round 1 vs Round 2

| Feature | Round 1 | Round 2 |
|----------|----------|----------|
| Login | ✅ | ✅ |
| Signup | ✅ | ✅ |
| Forgot Password | ❌ | ✅ |
| Confirm Password | ❌ | ✅ |
| Validation | Basic | Complete |
| localStorage Authentication | ❌ | ✅ |
| Loading State | ❌ | ✅ |
| Success Messages | ❌ | ✅ |
| Clickable Thumbnails | ❌ | ✅ |
| Accessibility Improvements | ❌ | ✅ |
| Automated Tests | ❌ | ✅ |
| UI Consistency | Basic | Improved |

---

# Review Effort

Round 1 was quick to generate but required significant manual review and additional implementation work.

Round 2 took longer because planning, testing, verification, and multiple refinement prompts were used. However, it reduced debugging time and produced a cleaner, more maintainable, accessible, and reliable application.

---

# Conclusion

This assignment demonstrated that prompt quality has a significant impact on AI-generated code.

Round 1 produced a basic implementation that required substantial manual improvements.

Round 2 required more planning and refinement but generated a much more complete solution with improved UI consistency, accessibility, validation, testing, and maintainability.

The additional effort spent designing better prompts ultimately reduced manual debugging and produced a higher-quality application.

---

# Iterations

## Round 1

- One AI prompt
- Minimal review
- No testing
- Basic implementation

---

## Round 2

Multiple iterations were performed:

- Planned implementation before coding.
- Added Forgot Password workflow.
- Added Confirm Password validation.
- Improved localStorage authentication.
- Added loading states.
- Improved validation.
- Fixed accessibility issues.
- Added automated tests.
- Verified all tests.
- Restored original UI after accessibility improvements.
- Updated documentation.
- Reviewed final implementation before committing.

## Documentation

- WORKFLOW.md → AI workflow comparison
- CLAUDE.md → Project rules