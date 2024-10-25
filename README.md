
# Maxim Cloud API Test Trigger GitHub Action

This GitHub Action sends a test trigger request to the Maxim Cloud API, allowing you to execute tests or other commands defined within the Maxim Cloud platform.

## Usage

To use this action in your workflows, add the following to your GitHub Actions workflow YAML file:

```yaml
name: Run Maxim Cloud Test
on: [push, pull_request]

jobs:
  run-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Run Maxim Cloud Test Trigger
        uses: ./ # Or the repository name if hosted, e.g., `user/repo@v1`
        with:
          api-key: ${{ secrets.MAXIM_API_KEY }}
          # Add other inputs as needed
```

### Inputs

- **`api-key`** (required): The API key to authenticate with the Maxim Cloud API. Store this key securely using GitHub Secrets (e.g., `${{ secrets.MAXIM_API_KEY }}`).
- **Other inputs**: Any additional inputs passed will be converted into JSON and sent as the request body.

### Outputs

- **`result`**: Response message from Maxim Cloud API.
- **`success`**: Boolean flag set to `true` if the test was triggered successfully.
- **`message`**: Human-readable success message.

## Requirements

Ensure the following requirements are met before using this action:

- **Node.js** and **npm**: Necessary for building and running the action.
- **GitHub Secrets**: The API key (`MAXIM_API_KEY`) should be stored in GitHub Secrets for security.

## Makefile Commands

The Makefile provides commands to automate installation, building, and pushing the action:

- **`init`**: Installs dependencies.
  ```bash
  make init
  ```

- **`build`**: Installs dependencies and builds the action (runs `npm run build`).
  ```bash
  make build
  ```

- **`push`**: Builds the action and pushes it to the GitHub repository (runs `npm run push`).
  ```bash
  make push
  ```

## Development

To set up a local environment for testing and development:

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the action locally by invoking the `run` function directly, or use a tool like `act` to test GitHub Actions locally.

## Error Handling

The action will fail if:

- The **API key** is missing.
- The **Maxim Cloud API** returns a non-200 status code.
- The **response message** does not match `"success"`.

Errors are outputted as failure messages in the GitHub Actions log.

## Example Output

```plaintext
Test triggered successfully: success
```

This example log entry indicates the action completed successfully and that the Maxim Cloud API responded as expected.
