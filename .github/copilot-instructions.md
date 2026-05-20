---
name: conventional-commits
description: "Instructions for generating commit messages following the Conventional Commits specification (v1.0.0)."
---

# Conventional Commits Instructions

When generating or suggesting commit messages, always follow the Conventional Commits specification (v1.0.0).

## Structure

The commit message should be structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Allowed Types

Include one of the following types to describe the change:

- **feat**: A new feature for the user, not a new feature for builds or internal tools.
- **fix**: A bug fix for the user, not a fix to a build script.
- **docs**: Changes to the documentation.
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
- **refactor**: A code change that neither fixes a bug nor adds a feature.
- **perf**: A code change that improves performance.
- **test**: Adding missing tests or correcting existing tests.
- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm).
- **ci**: Changes to our CI configuration files and scripts (example scopes: GitHub Actions, Travis, Circle, BrowserStack, SauceLabs).
- **chore**: Other changes that don't modify src or test files.
- **revert**: Reverts a previous commit.

## Detailed Guidelines

1.  **Type and Scope**:
    -   The type must be one of the allowed types.
    -   Scopes should be provided in parentheses to provide additional contextual information.
2.  **Description**:
    -   Use the imperative, present tense: "change", not "changed" or "changes".
    -   Don't capitalize the first letter.
    -   No dot (.) at the end.
3.  **Body**:
    -   Use the imperative, present tense: "change", not "changed" or "changes".
    -   The body should include the motivation for the change and contrast this with previous behavior.
4.  **Breaking Changes**:
    -   Breaking changes must be indicated by an `!` after the type/scope (e.g., `feat(api)!: ...`) OR by `BREAKING CHANGE:` at the beginning of the footer section.
5.  **Footer**:
    -   The footer should contain additional issue references or metadata.
    -   Use the format `Refs: #<id>` or `Co-authored-by: <name> <email>`.

## Examples

-   `feat(auth): add google oauth provider`
-   `fix(parser): resolve unexpected token error`
-   `docs: correct typo in installation guide`
-   `feat!: drop support for Node.js 14`
-   `refactor(ui): consolidate button components`
