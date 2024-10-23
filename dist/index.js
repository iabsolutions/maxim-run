/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 721:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 358:
/***/ ((module) => {

module.exports = eval("require")("axios");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
const core = __nccwpck_require__(721);
const axios = __nccwpck_require__(358);

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
module.exports = __webpack_exports__;
/******/ })()
;