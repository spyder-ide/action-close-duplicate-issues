const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
    const token = core.getInput("repo-token");
    const items_string = core.getInput("items");
    const items = JSON.parse(items_string);
    const context = github.context;
    const contextString = JSON.stringify(context, undefined, 2);
    console.log(`\nInformation: The event context\n ${contextString}`);

    if (!context.payload.pull_request && context.payload.action == "opened") {
      const issue_number = context.payload.issue.number;
      const body = context.payload.issue.body;

      for (let item of items) {
        if (!item.pattern || !item.reply) {
          console.log("\nWarning: Must provide 'pattern' and 'reply'!");
          return;
        }

        // Debugging
        const pattern = new RegExp(item.pattern);
        console.log(`\nDEBUG Pattern: ${pattern}`);
        console.log(`\nDEBUG Match: ${body.match(pattern)}`);
        const itemG = JSON.stringify(item, undefined, 2);
        console.log(`\nDEBUG Item: The item payload\n ${itemG}`);

        if (body && (body.match(pattern) || body.includes(item.pattern))) {
          const itemJ = JSON.stringify(item, undefined, 2);
          console.log(`\nInformation: The item payload\n ${itemJ}`);

          const octokit = new github.GitHub(token);
          const new_comment = octokit.issues.createComment({
            ...context.repo,
            issue_number: issue_number,
            body: item.reply
          });

          if (item.labels) {
            console.log("\nInformation: Adding labels!");
            const add_label = octokit.issues.addLabels({
              ...context.repo,
              issue_number: issue_number,
              labels: item.labels
            });
          }

          if (item.close != null && item.close) {
            console.log("\nClosing issue!");
            const close_issue = octokit.issues.update({
              ...context.repo,
              issue_number: issue_number,
              state: "closed",
              state_reason: "not_planned"
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
