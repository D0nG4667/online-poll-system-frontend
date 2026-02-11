# Contributing to Plaude Poll

## 🌳 GitFlow Branching Strategy

Plaude Poll follows a strict **GitFlow** workflow to ensure stability and parallel development.

### Main Branches
- **`main`**: Production-ready code. Do not commit directly. Deploys to Production.
- **`develop`**: Integration branch for the next release. Deploys to Staging.

### Supporting Branches

#### 1. Feature Branches (`feature/*`)
- **Purpose**: New features or non-critical enhancements.
- **Source**: `develop`
- **Target**: `develop` (via Pull Request)
- **Naming**: `feature/feature-name` (e.g., `feature/auth-system`, `feature/poll-creation`)

#### 2. Bugfix Branches (`bugfix/*`)
- **Purpose**: Fixes for bugs found in `develop`.
- **Source**: `develop`
- **Target**: `develop`
- **Naming**: `bugfix/issue-description`

#### 3. Release Branches (`release/*`)
- **Purpose**: Preparation for a new production release (version bumping, final testing).
- **Source**: `develop`
- **Target**: `main` AND `develop`
- **Naming**: `release/vX.Y.Z`

#### 4. Hotfix Branches (`hotfix/*`)
- **Purpose**: Critical fixes for bugs in Production.
- **Source**: `main`
- **Target**: `main` AND `develop`
- **Naming**: `hotfix/incident-description`

---

## 📝 Commit Messages

We use **Semantic Commits** to automate versioning and changelogs.

Format: `<type>(<scope>): <subject>`

### Types
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries

### Examples
- `feat(auth): implement login page with z validation`
- `fix(ui): correct button padding on mobile`
- `docs(readme): add setup instructions`
- `chore(deps): upgrade next.js to 16.1`

---

## 🚀 Workflow Example

1. **Start a new feature**:
    ```bash
    git checkout develop
    git pull origin develop
    git checkout -b feature/my-cool-feature
    ```

2. **Commit changes**:
    ```bash
    git add .
    git commit -m "feat(poll): add websocket connection logic"
    ```

3. **Push & PR**:
    ```bash
    git push origin feature/my-cool-feature
    # Open Pull Request on GitHub targeting 'develop'
    ```
