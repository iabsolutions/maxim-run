const core = require('@actions/core');
const axios = require('axios');

async function run() {
  try {
    // Get API key input
    const apiKey = core.getInput('api-key');
    if (!apiKey) {
      throw new Error('API key is required');
    }

    // Check for 'repository' input
    const repository = core.getInput('repository');
    if (!repository) {
      throw new Error('Repository is required');
    }

    // Check for 'branch' input and default to 'main' if not provided
    const branch = core.getInput('branch');
    if (!branch) {
      core.info('Branch not provided, defaulting to main');
      branch = 'main';
    }

    // Check for 'token' input and default to null if not provided
    const token = core.getInput('token');
    if (!token) {
      core.info('Token not provided, defaulting to null');
      token = null;
    }

    // Make a request to Maxim Cloud API
    const response = await axios.post('https://www.maximcloud.io/api/run-test?api_key=' + apiKey, 
    { 
        repository: repository,
        branch: branch,
        token: token
    });

    // Log and output the result
    console.log(`Test triggered successfully: ${response.data}`);
    core.setOutput('result', response.data);

    // Exit with success
    core.setOutput('success', true);
    core.setOutput('message', 'Test triggered successfully');

  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();