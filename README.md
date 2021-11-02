<h1 align="center">
    Acknowledge Action
</h1>
A GitHub action workflow to greet people who they create their first issue or pull request on a repository and when a pull request is merged.

## 💎 Feature checklist
- [ ] Greet people who create their first issue
- [ ] Greet people who create their first pull request
- [ ] Greet people who make contributions i.e. when the pull request is accepted.

## Usage
Create a new .yaml file in .github/workflows at the root of your repository
The `repo-token` can be accessed using `${{secrets.GITHUB_TOKEN}}`
```yaml
name: "Acknowledge Action"
on: [issues]

jobs:
  acknowledge-action:
    runs-on: ubuntu-latest
    name: Acknowledge Action
    steps:
      - name: greet first issuers
        uses: kushgabani/acknowledge-action@v1
        with:
          repo-token: your-token-here
          issue-message: "YOUR CUSTOM ISSUE MESSAGE (default provided)"
          pr-message: "YOUR CUSTOM PR MESSAGE (default provided)"
```

## 📕 License
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)