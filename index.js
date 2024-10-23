const core = require('@actions/core');
const axios = require('axios');

async function run() {
  try {
    // Get API key input
    const apiKey = core.getInput('api-key');

    // // Make a request to Maxim Cloud API
    // const response = await axios.post('https://www.maximcloud.io/api/v1/run-test', null, {
    //   headers: {
    //     'Authorization': `Bearer ${apiKey}`
    //   }
    // });

    // // Log and output the result
    // console.log(`Test triggered successfully: ${response.data}`);
    // core.setOutput('result', response.data);

    // Mock output and send a test ID for consumption by other actions
    console.log('Test triggered successfully: 123456789');
    core.setOutput('result', '123456789');

    // Exit with success
    core.setOutput('success', true);
    core.setOutput('message', 'Test triggered successfully');

  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();