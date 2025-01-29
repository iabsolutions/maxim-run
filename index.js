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
    console.log(`Test ID: ${response.data.testId}`);
    console.log(`Test URL: ${runUrl}/tests/${response.data.testId}`);

    // Wait until the test is completed
    let testStatus = 'REQUESTED';
    while (testStatus !== 'COMPLETED') {
      const statusResponse = await axios.get(`${runUrl}/api/test-status?api_key=${apiKey}&testId=${response.data.testId}`);
      testStatus = statusResponse.data.test_status;
      console.log(`Test status: ${testStatus}`);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before checking again
    }

    // Output the result
    core.setOutput('Debug', JSON.stringify(statusResponse.data));
    core.setOutput('Test ID', JSON.stringify(statusResponse.data.testId));
    core.setOutput('Result URL', JSON.stringify(runUrl + '/tests/' + statusResponse.data.testId));
    core.setOutput('Test Status', JSON.stringify(statusResponse.data.test_status));
    core.setOutput('NFR Status', JSON.stringify(statusResponse.data.nfr_status));
    core.setOutput('success', JSON.stringify(statusResponse.data.success));

  } catch (error) {
    core.setFailed(`Action failed with error: ${JSON.stringify(error)}`);
  }
}

run();
