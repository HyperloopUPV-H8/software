# Contributing

This guide explains the methodology to follow when contributing to the repository.

These are some steps a member should take to make good contributions to the application:

1. [Open task issue](#1-open-task-issue)
2. [Understand the code](#2-understand-the-code)
3. [Make changes](#3-make-changes)
4. [Open pull request](#4-open-pull-request)
5. [Apply changes](#5-apply-changes)
6. [Merge changes](#6-merge-changes)

## 1. Open task issue

To keep track of changes, first create a *task* issue. These issues have the `Task` label and represent an unit of work.

Maybe someone else already created the issue and assigned it to you, or the issue is still unasigned and you want to work on it. In those cases you can skip this step and go ahead with the next one.

If the issue is not created yet, go to the issues page and create a new *task* issue. There are some guidelines you should try to follow:

* If the issue is specific to one module (e.g. backend, ethernet view, etc.) start the title with `[module_name]`, changing *module_name* to the appropiate one.
* Add the appropiate labels: is the issue related to the *frontend*, the *backend*, is it a *documentation* task? Try to identify these before creating the issue.
* Assign yourself (or the member who will work on it) so they get notified with updates and everyone knows what everyone is doing.
* Add the issue to the `Software H9` project to keep track of its progress.
* Assign the issue to a milestone if possible.
* Describe the task briefly. Write some lines on the task itself, what should be done, any details, notes on it, etc.
* Add related issues / PRs. This is not required, but is useful, specially when tasks get blocked by other tasks.
* Write down anything else related to the issue that might be relevant.

## 2. Understand the code

Once you have the issue, before actually getting to the coding part, think about what you are about to write or do. Take a moment, even a day, to understand all the code surrounding the issue, different approach to solve the issue, things that might be related, etc.

Of course don't become too obsessed with this, it's always best to try out something than having nothing done.

It is also recommended to ask other members their points of view, what they are doing, dependencies they might have, etc. To get more ideas and ensure your changes won't screw with other person changes.

Also make sure to take notes, maybe in `software-docs` or as a comment on the issue, with anything relevant you found from this research. It might even be necessary to open new issues if you find anything outside the scope of the task.

But once again, don't take more than a day doing this.

## 3. Make changes

Now is coding time!

Before writing any single line of code make sure of the following:

1. Ensure you are in the `develop` branch
2. Check you have the latest changes (run `git fetch`)
3. Pull all changes if the local is not up to date
4. Create a new branch (see [Branching](#branching))

### Branching

All changes to the app must be made to an unprotected branch, contributors should create at least one branch for each issue they work on so all the code written can be reviewed.

Issues involving muliple modules should have a branch per module.

When you create a new branch it is important to follow a set of rules to keep name consistent across the development process. These are the rules for the names:

* Names should start with the module they are related to like this: `module_name/branch_name`. Names not starting with a valid *module_name* won't be accepted by the repository rules. For valid module names ask the Software Lead.
* The branch name should link it to some issue, the best is to create issues with descriptive titles and use them as the branch name

Examples of good branch names are: `backend/tcp-keepalive-error`, `ethernet-view/swap-chart-library` or `packet-sender/improve-generation-algorithm`.

Some bad examples are: `abc`, `backend/minor-fixes` or `unrelated-module/some-feature`.

### writing code

With the latest changes ready, the new branch created, and everything set up, you are ready to write code at last. These are some guidelines on how to make good changes:

* Keep changes to the module you are working on, if your task involves multiple modules make the changes in the first module's branch and then switch to the second module's branch.
* Keep commits atomic. These are commits that change just one specific thing, allowing the app to be compiled before and after.
* Don't extend a branch life time, try to merge changes as soon as possible. If there are a lot of changes create multiple PRs and do it progresively.
* Keep PRs small. Of course there are exceptions to this and sometimes a PR will have more lines than others.
* Document what you do, dedicate some time to write down the why and how of your changes. Documentation not that related to the code should be written to `software-docs`.
* Try to test the code. Prepare at least a primitive test to ensure it works, of course, it is better if tests are automatic, but in some cases, it is just easier to check by hand.

## 4. Open pull request

*Phew*! That was a nice coding session.

When you think your changes are ready to be reviewed, create a Pull Request on GitHub.

First upload your code to the repository and navigate to GitHub. Once there go to the Pull Request tab in the repo and create a new PR.

**Make sure you are merging the changes from `your/branch` to `develop`.**

Set the title to the issue title if possible and specify again the module it changes by prepending `[module_name]` to the PR name, as in `[backend] Fix tcp Keepalive error`.

In the PR description write about your solution to the issue, what are the main changes, what should everyone know, how is the new code used. Keep the description simple but descriptive.

Then set the PR metadata: the asignee, related issues, reviewers, project, milestone, etc.

Once this is done, open the pull request either as Draft or as a regular PR.

Create a Draft PR when there are still changes to make, but you only expect to make small changes. This way people can start reviewing your code early and give you early feedback.

When the PR is ready for review, make sure to move the Project item to the PR column. Every day at 6pm there is a scheduled reminder on slack with the PRs pending a review, but you can also notify the reviewers about it.

## 5. Apply changes

Your PR had some comments on it requesting changes! Lets fix that!

When you receive feedback for the first time it might be difficult to understand that they are critizising the code and not you, the comments might be harsh but the reviewers do it with the best intention: to make sure the code of the project is good and to help you grow as a programmer.

Once you understand that, read every comment and try to think on what they commented.

Do their reasons make sense? Did they understand the reasons for the change? Do you think they are wrong?

If you feel the requested change doesn't make sense, comment on it explaining your reasons, discuss with them the probelm with the code and try to arrive to the best solution possible.

Are they right on their comment? Go back to step 3 and change it: improve that function declaration, make better variable names, etc.

When you have the chagnes upload the code again and ask again for their review until everything is resolved.

## 6. Merge changes

Wow! You did a great job with your contribution. Lets get it on production.

After the review process, the PR is ready to be merged, it might happen that during the time your PR was open new changes where added to the develop branch.

Before merging, pull those changes to your branch and fix any conflicts. This ensures everyithing is up to date always.

When there are no conflicts hit that merge button, with that your changes are on develop, and once a milestone is reached, the changes will be merged to main!

Don't forget to delete the feature branch once you are done, try keep the tree clean.

## Closing remarks

There are a lot of things covered here and this just explains the usual workflow, modifications to it might be made depending on the moment and some details are not explained. Take it with a grain of salt and make sure to ask any doubts to another member of the team.

Happy Coding!
