const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  core.debug('👋 Hello! You are an amazing person! 🙌')
  try {
    const token = core.getInput('token');
    const items_string = core.getInput('items');
    const items = JSON.parse(items_string);
    const context = github.context;

    if (context.payload.pull_request == null && context.payload.action == 'opened') {
      const issue_number = context.payload.issue.number;
      const body = context.payload.issue.body;

      for (let item of items) {
        if (body.includes(item.string)) {
          core.debug(item.string);
          core.debug(item.reply);
          core.debug(item.labels);

          if (item.string == null || item.reply == null) {
            core.debug('Must provide string and reply!');
            return
          }

          const octokit = new github.GitHub(token);
          const new_comment = octokit.issues.createComment({
            ...context.repo,
            issue_number: issue_number,
            body: item.reply,
          });

          if (item.label != null) {
            const add_label = octokit.issues.addLabels({
              ...context.repo,
              issue_number: issue_number,
              labels: item.labels
            });
          }

          break;
        }
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
