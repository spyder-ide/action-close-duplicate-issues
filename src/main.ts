const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
    const token = core.getInput("repo-token");
    const items_string = core.getInput("items");
    const items = JSON.parse(items_string);
    const context = github.context;
    const payload = JSON.stringify(context.payload, undefined, 2);
    console.log(`\nInformation: The event payload\n ${payload}`);

    if (!context.payload.pull_request && context.payload.action == "opened") {
      const issue_number = context.payload.issue.number;
      const body = context.payload.issue.body;

      for (let item of items) {
        if (!item.pattern || !item.reply) {
          console.log("\nWarning: Must provide 'pattern' and 'reply'!");
          return;
        }

        const pattern = new RegExp(item.pattern);

        if (body && body.match(pattern)) {
          const itemJ = JSON.stringify(item, undefined, 2);
          console.log(`\nInformation: The item payload\n ${itemJ}`);

          const octokit = new github.GitHub(token);
          const new_comment = octokit.issues.createComment({
            ...context.repo,
            issue_number: issue_number,
            body: item.reply
          });

          if (item.labels) {
            // Check if labels exist on repository
            const issueLabels = octokit.issues.listLabelsForRepo({
              ...context.repo,
            }) || [];

            const issueLabelsString = JSON.stringify(issueLabels, undefined, 2);
            console.log(
              `\nInformation: The labels payload\n ${issueLabelsString}`
            );

            for (let label of item.labels) {
              if (!issueLabels.some(issueLabel => label === issueLabel.name)) {
                console.log(
                  `\nWarning: Label "${label}" not found in repository!`
                );
              }
            }

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
              state: "closed"
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
