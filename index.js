const core = require('@actions/core');
const axios = require('axios');

async function run() {
  try {
    // Base URL for the API
    let runUrl = "https://www.maximcloud.io";

    // Post body object
    const body = {};

    // Retrieve all known inputs and add them to the body
    const inputs = ['repository', 'branch', 'pat', 'ngrok-url', 'api-key'];
    for (const inputName of inputs) {
      const value = core.getInput(inputName);
      if (value) {
        body[inputName] = value;
      }
    }

    // Get the API key
    const apiKey = core.getInput('api-key');
    if (!apiKey) {
      throw new Error('API key is required');
    }

    // Check if ngrok URL is provided and override the default URL
    const ngrokUrl = core.getInput('ngrok-url');
    if (ngrokUrl) {
      runUrl = ngrokUrl;
    }

    // Make a POST request to Maxim Cloud API
    const response = await axios.post(`${runUrl}/api/run-test?api_key=${apiKey}`, body);

    // Check for success response
    if (response.status !== 200) {
      throw new Error(`Request failed with status code: ${response.status}`);
    }

    // Check for success: {"success":true,"testId":123456}
    if (!response.data.success) {
      throw new Error(`Request failed with message: ${response.data}`);
    }

    // Log and output the result
    console.log(`Test triggered successfully: ${response.data}`);
    core.setOutput('result', JSON.stringify(response.data));
    core.setOutput('success', true);
    core.setOutput('message', 'Test triggered successfully');

  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
