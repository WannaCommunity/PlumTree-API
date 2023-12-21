# Plum Tree API

> Wait, I'm Having One Of Those Things, You Know, A Headache With Pictures.

Repo for the plum tree backend (API).

Written in [NodeJS][nodejs] and deployed to [Lambda functions][lambda] +
[API Gateway][apigateway] using the [Serverless framework][serverless].

## Running

### DB Setup

If the environment variables `MONGO_PASSWORD` and `MONGO_USER` exist the code
will attempt to connect to the live Mongo Atlas cluster. Otherwise it will try
to connect to a local instance of Mongo DB.

To run against a local DB unset the user and password variables.

```
unset MONGO_PASSWORD
unset MONGO_USER
```

Then use Docker to pull and run MongoDB locally.

```
docker run --name plum-tree-mongo -p 27017:27017 -v ~/plumtree/data/db:/data/db -d mongo:4.4.6
```

The above does a few things:

1. It will pull the `mongo:4.4.6` if not already available locally
1. It starts mongo on port `27017` and exposes so you can connect via `mongodb://localhost:27017`
1. It setups a volume for the mongo data to your home directory + `plumtree/data/db` so stopping and restarting the container will retain any saved data
1. It names the container `plum-tree-mongo`
1. It runs the container in the background (remove the `-d` arg when running to see the logs)


To stop the DB container run `docker stop plum-tree-mongo && docker rm plum-tree-mongo`

### Start The API

#### Expected Environment Variables

> 📍 Tip: use a `.env` file to set these variables

| Name | Description | Example Value |
| ---- | ----------- | ------------- |
| `STATE_BUCKET` | S3 bucket name where serverless stores state | `plum-tree-state` |
| `AWS_ACCOUNT_ID` | AWS account ID where IAM policies from infrastructure code was deployed | 123456789000 |
| `STACK` | Color or name of stack to deploy to | `blue` |
| `JWT_SECRET` | A secret to encrypt JWTs with | `foobar` |
| `SMTP_ENDPOINT` | SMTP endpoint used to send emails (e.g. forgot passwords) | `email-smtp.eu-west-1.amazonaws.com` |
| `SMTP_USERNAME` | SMTP username used to send emails | `foo` |
| `SMTP_PASSWORD` | SMTP password used to send emails | `bar` |
| `DOMAIN` | The plum trees domain | `theplumtreeapp.com` |
| `UPLOAD_BUCKET_INPUT` | S3 bucket name where uploads are first saved to be processed, images here are deleted later using life cycles | `uploads-input` |
| `UPLOAD_BUCKET_PROCESSED` | S3 bucket name where processed uploaded images end up | `uploads-processed` |

The Plum Tree uses a [blue/green][bluegreen] deploy mechanism. This means Serverless expects at least the `STACK` environment variable to be set.

You also need to set the `JWT_SECRET`. Be sure to keep using the same value for sessions to remain valid each time you start the API.

The other variables are not required to start the API but some functionality may not work e.g. emails if SMTP related variables are not set.

#### Running

Run `npm start`.

## Run With Live DB Locally

:warning: Not recommended incase you fudge something up in live.

```
export STACK=green
export API_GATEWAY_NAME=plum-tree-$STACK
export API_GATEWAY_ID=$(aws apigateway get-rest-apis --profile plum-tree --output text --query "items[?name == '$API_GATEWAY_NAME'] | [0].id")
export API_ROOT_RESOURCE_ID=$(aws apigateway get-resources --profile plum-tree --rest-api-id=$API_GATEWAY_ID --output text --query "items[?path=='/'].id")

export JWT_SECRET=*****
export MONGO_USER=*****
export MONGO_PASSWORD=*****
```

[nodejs]: https://nodejs.org/en/
[lambda]: https://aws.amazon.com/lambda/
[apigateway]: https://aws.amazon.com/api-gateway/
[serverless]: https://www.serverless.com/framework/docs/
[bluegreen]: https://martinfowler.com/bliki/BlueGreenDeployment.html
