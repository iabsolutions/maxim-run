const core = require('@actions/core');
const axios = require('axios');

async function run() {
  try {

    // Initialize variables
    let statusResponse;

    // Base URL for the API
    let runUrl = "https://www.maximcloud.io";

    // Post body object
    const body = {};

    // Retrieve all known inputs and add them to the body
    const inputs = ['repository', 'branch', 'pat', 'ngrok-url', 'api-key', 'replicas', 'start-file', 'directory'];
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
    let response = await axios.post(`${runUrl}/api/run-test?api-key=${apiKey}`, body);

    // Check for success response
    if (response.status !== 200) {
      throw new Error(`Request failed with status code: ${JSON.stringify(response.status)}`);
    }

    // Check for success: {"success":true,"testId":123456}
    if (!response.data.success) {
      throw new Error(`Request failed with message: ${JSON.stringify(response.data)}`);
    }

    // Log and output the result
    // console.log(`Test triggered successfully: ${JSON.stringify(response.data)}`);
    console.log(`Test ID: ${response.data.testId}`);
    console.log(`Test URL: ${runUrl}/tests/${response.data.testId}`);

    // Wait until the test is completed
    let testStatus = 'REQUESTED';
    let updatedStatus = '';
    while (testStatus !== 'COMPLETED') {
      response = await axios.get(`${runUrl}/api/test-status?api-key=${apiKey}&testId=${response.data.testId}`);
      updatedStatus = response.data.test_status;
      // Log the test status only if it has changed
      if (updatedStatus !== testStatus) {
        console.log(`Test status: ${updatedStatus}`);
        testStatus = updatedStatus;
      }
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before checking again
    }

    // Coonsole outputs
    console.log(`NFR status: ${response.data.nfr_status}`);
    console.log(`Report URL: ${runUrl}/tests/${response.data.testId}`);

    // Output the result
    core.setOutput('debug', JSON.stringify(response.data));
    core.setOutput('testId', JSON.stringify(response.data.testId));
    core.setOutput('resultUrl', JSON.stringify(runUrl + '/tests/' + response.data.testId));
    core.setOutput('testStatus', JSON.stringify(response.data.test_status));
    core.setOutput('nfrStatus', JSON.stringify(response.data.nfr_status));
    core.setOutput('success', JSON.stringify(response.data.success));

    // Log the result
    statusResponse = "success";
    if (!response.data.success) {
      throw new Error(`Test failed`);
    }

    // Exit with success
    process.exit(0);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
