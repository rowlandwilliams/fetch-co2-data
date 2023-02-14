# AWS Lambda to automate collection of historic atmospheric CO2 levels data

This function makes a request to a url and transforms the data returned from it into a required format. The data is then uploaded as a json to AWS S3.

Steps to get up and running:

```
- Create a bucket on S3 with named matching the relevant variable name in .env.template.
- npm install
- Run npm run scrape to run the data fetching function in isolation.
- Run npm run invoke:local to run the entire function locally.
- Run serverless deploy --aws-profile <aws-profile-name> to deploy.

```
