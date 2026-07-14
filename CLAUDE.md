# CLAUDE.md

## Project Rules

### Rule 1
Use semantic HTML elements for all interactive controls. Navigation actions must use `<button type="button">` instead of `<a>` elements.

### Rule 2
Every form must validate required fields, email format, password length, and password confirmation before submission.

### Rule 3
Every new feature must include React Testing Library tests before it is considered complete.

### Rule 4
Password fields must include a show/hide password toggle with accessible labels.

### Rule 5
Accessibility attributes such as aria-invalid, aria-describedby, aria-busy, and keyboard focus indicators must be included where appropriate.