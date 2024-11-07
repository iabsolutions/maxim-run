const core = require('@actions/core');
const axios = require('axios');

async function run() {
  try {

    // Run URL
    const runUrl = "https://www.maximcloud.io/api/run-test"

    // Post body
    var body = {};

    // Convert all input variables into a JSON object
    for (const [key, value] of Object.entries(core.getInputMap())) {
      body[key] = value;
    }

    // Get API key input
    const apiKey = core.getInput('api-key');
    if (!apiKey) {
      throw new Error('API key is required');
    }

    // Check if ngrok URUL is provided
    const ngrokUrl = core.getInput('ngrok-url');
    if (ngrokUrl) {
      runUrl = ngrokUrl;
    }

    // Make a request to Maxim Cloud API
    const response = await axios.post(runUrl + '?api_key=' + apiKey, body);

    // Check for success response
    if (response.status !== 200) {
      throw new Error(`Request failed with status code: ${response.status}`);
    }

    // Check for success response
    if (response.data !== 'success') {
      throw new Error(`Request failed with message: ${response.data}`);
    }

    // Log and output the result
    console.log(`Test triggered successfully: ${response.data}`);
    core.setOutput('result', response.data);
    core.setOutput('success', true);
    core.setOutput('message', 'Test triggered successfully');

  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();