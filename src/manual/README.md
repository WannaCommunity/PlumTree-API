# Manual Scripts

In some cases the regular user self service flow does not suffice. These scripts
are built to be ran locally by the developer to get around some of these issues.

## Download Tree

Some trees are just too big for our API endpoints to handle. This is due to
Lambda limitations. It's easier in these cases to run the `downloadTree.js`
script and give the user a download link via https://wetransfer.com/.

Expects the env vars `DOWNLOAD_TREE_USERNAME` and `DOWNLOAD_TREE_ID` to be set.
