# Release Process Documentation

This document outlines the steps required to make a release in our project. The release process is designed to ensure consistency and manageability, minimizing errors during deployment.

## Steps for Release

### Step 1: Update Version Numbers

- Update the `version` attribute in the `package.json` file located in the root directory of the `develop` branch.
- Also update the version number displayed on the index page of the application located in /src/static/pages/index.html to reflect the new release version.
- Run the script to update the version:
  `. scripts/version.sh`

### Step 2: Push Changes to GitHub

- Commit the changes with a message, for example: `Release X.X.X`.
- Push the updated `develop` branch to GitHub

### Step 3: Create Pull Request

* On GitHub, navigate to the repository's main page.
* Click on 'Pull requests' and then 'New pull request'.
* Set `base: master` and `compare: develop` to merge changes from `develop` into `master`.
* Set title to `Release X.X.X`
* Click 'Create pull request'.

### Step 4: Merge Develop into Master

* Review the changes one last time to ensure everything is in order.
* Merge the pull request into the `master` branch.
* This merge will trigger the Continuous Deployment (CD) pipeline to deploy the changes to production.

### Step 5: Create a New Tag on GitHub

* Go to the 'Tags' section of your GitHub repository.
* Click on 'Releases' then 'Draft a new release'.
* Tag version: Enter `X.X.X` to match the release version.
* Target: Select `master` as the target branch.

### Step 6: Add Description to the Tag

* Use the following format to describe the release:

  ```
  ### Release Date
  TT.MM.YYYY

  ### New Features
  **Title of new Feature**
  - Description of new Feature

  ### Bug Fixes
  - Bug fix 1
  - Bug fix 2
  ```
* Fill in the actual release date, list new features and any bug fixes included in this release.
* Once completed, click 'Publish release'.

## Conclusion

By following these steps, you ensure that each release is documented, versioned, and deployed correctly to the production environment. This process helps maintain the integrity and traceability of the production releases.
