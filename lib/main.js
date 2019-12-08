"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const core = require('@actions/core');
const github = require('@actions/github');
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = core.getInput('token');
            const items_string = core.getInput('items');
            const items = JSON.parse(items_string);
            const context = github.context;
            if (context.payload.pull_request == null && context.payload.action == 'reopened') {
                // if (context.payload.pull_request == null && context.payload.action == 'opened') {
                const issue_number = context.payload.issue.number;
                const body = context.payload.issue.body;
                for (let item of items) {
                    if (body.includes(item.string)) {
                        if (item.string == null || item.reply == null) {
                            console.log('Must provide string and reply!');
                            return;
                        }
                        const octokit = new github.GitHub(token);
                        const new_comment = octokit.issues.createComment(Object.assign(Object.assign({}, context.repo), { issue_number: issue_number, body: item.reply }));
                        if (item.labels != null) {
                            console.log('Adding labels!');
                            const add_label = octokit.issues.addLabels(Object.assign(Object.assign({}, context.repo), { issue_number: issue_number, labels: item.labels }));
                        }
                        if (item.close != null && item.close) {
                            console.log('Closing issue!');
                            core.debug('Closing issue');
                            const close_issue = octokit.issues.update(Object.assign(Object.assign({}, context.repo), { issue_number: issue_number, state: 'closed' }));
                        }
                        break;
                    }
                }
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
