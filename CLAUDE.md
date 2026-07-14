# CLAUDE.md

## Project Rules

These rules were established after completing the authentication workflow assignment.

### Rule 1: Use controlled React components for forms
All form inputs should use React state (`useState`) instead of uncontrolled inputs. This keeps validation, form updates, and testing predictable.

### Rule 2: Use buttons for actions instead of anchor tags
Actions such as "Forgot Password", "Back to Login", and "Create Account" must use `<button type="button">` instead of `<a href="#">`. This improves accessibility and avoids ESLint accessibility warnings.

### Rule 3: Validate user input before submission
Forms must validate required fields, verify email format, and confirm matching passwords before submission. Validation errors should be shown to the user instead of allowing invalid data.

### Rule 4: Add automated tests for new features
Every new authentication feature should include React Testing Library tests to verify navigation, validation, and expected behavior before the feature is considered complete.

### Rule 5: Preserve existing functionality
When adding new features, ensure that Login, Signup, and other existing workflows continue to function correctly without regressions.