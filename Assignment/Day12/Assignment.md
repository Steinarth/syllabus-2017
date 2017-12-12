# Day 12 - Test Reports and Client Side Tests

### Test reports

Add capability to see test reports from all tests (unit tests - api tests - load tests) in Jenkins. The standard format for test reports is JUnitReport.

Use this package: [jasmine-reporters(https://github.com/larrymyers/jasmine-reporters
)
The packages should be added into your devDependencies using [npm](https://docs.npmjs.com/cli/install) or [yarn](https://yarnpkg.com/lang/en/docs/cli/add/)

To add the reporter in Node add this code to `jasmine-setup.js`:

```
var reporters = require('jasmine-reporters');
var junitReporter = new reporters.JUnitXmlReporter({
    savePath: 'PATH',
    consolidateAll: false
});
jasmine.getEnv().addReporter(junitReporter)
```

The test reports will be stored in the folder you specify under `PATH` after they have finished.

Use this plugin [JUnit Plugin](https://wiki.jenkins.io/display/JENKINS/JUnit+Plugin) to publish your reports on Jenkins.

### Playable game - client side test

**Before you start** There have been minor changes since yesterday to the week3 code that you need to pull into your application [see commit history](https://github.com/hgop/week3/commits/master)

TicCell implementation is incomplete along with the tests. Complete the implementation, fill out the incomplete test so that it tests the TicCell component.

# State

You are done when you have a passing test (that would fail if TicCell would not work) and the game is playable.
