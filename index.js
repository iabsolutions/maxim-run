const core = require('@actions/core');
const axios = require('axios');

async function run() {
  try {
    // Base URL for the API
    let runUrl = "https://www.maximcloud.io";

    // Post body object
    const body = {};

    // Retrieve all known inputs and add them to the body
    const inputs = ['repository', 'branch', 'pat', 'ngrok_url', 'api_key', 'replicas', 'k6_start_file'];
    for (const inputName of inputs) {
      const value = core.getInput(inputName);
      if (value) {
        body[inputName] = value;
      }
    }

    // Get test environment variables
    const testEnv = process.env['TEST_ENV'] || '';
    const relevantTestEnvVars = testEnv
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.includes('='))
      .reduce((acc, line) => {
        const [key, value] = line.split('=');
        acc[key] = value;
        return acc;
      }, {});

    // Add test environment variables to the body
    body['testEnv'] = relevantTestEnvVars;

    // Get the API key
    const apiKey = core.getInput('api_key');
    if (!apiKey) {
      throw new Error('API key is required');
    }

    // Check if ngrok URL is provided and override the default URL
    const ngrokUrl = core.getInput('ngrok_url');
    if (ngrokUrl) {
      runUrl = ngrokUrl;
    }

    // Make a POST request to Maxim Cloud API
    const response = await axios.post(`${runUrl}/api/run-test?api_key=${apiKey}`, body);

    // Check for success response
    if (response.status !== 200) {
      throw new Error(`Request failed with status code: ${JSON.stringify(response.status)}`);
    }

    // Check for success: {"success":true,"testId":123456}
    if (!response.data.success) {
      throw new Error(`Request failed with message: ${JSON.stringify(response.data)}`);
    }

    // Log and output the result
    console.log(`Test triggered successfully: ${JSON.stringify(response.data)}`);
    core.setOutput('result', JSON.stringify(response.data));
    core.setOutput('success', true);
    core.setOutput('message', 'Test triggered successfully');

  } catch (error) {
    core.setFailed(`Action failed with error: ${JSON.stringify(error)}`);
  }
}

run();
