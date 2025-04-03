generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
provider "aws" {
  access_key                  = "mock_access_key"
  region                      = "us-east-1"
  s3_use_path_style           = true
  secret_key                  = "mock_secret_key"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    apigateway     = "${get_env("LOCALSTACK_HOST", "http://localhost:4566")}"
    cloudformation = "${get_env("LOCALSTACK_HOST", "http://localhost:4566")}"
    cloudwatch     = "${get_env("LOCALSTACK_HOST", "http://localhost:4566")}"
    dynamodb       = "${get_env("LOCALSTACK_HOST", "http://localhost:4566")}"
    es             = "${get_env("LOCALSTACK_HOST", "http://localhost:4566")}"
    firehose       = "${get_env("LOCALSTACK_HOST", "http://localhost:4566")}"
    iam            = "${get_env("LOCALSTACK_HOST", "http://localhost:4566")}"
    kinesis        = "${get_env("LOCALSTACK_HOST", "http://localhost:4566")}"
    lambda         = "${get_env("LOCALSTACK_HOST", "http://localhost:4566")}"
    route53        = "${get_env("LOCALSTACK_HOST", "http://localhost:4566")}"
    redshift       = "${get_env("LOCALSTACK_HOST", "http://localhost:4566")}"
    s3             = "${get_env("LOCALSTACK_HOST", "http://localhost:4566")}"
    secretsmanager = "${get_env("LOCALSTACK_HOST", "http://localhost:4566")}"
    ses            = "${get_env("LOCALSTACK_HOST", "http://localhost:4566")}"
    sns            = "${get_env("LOCALSTACK_HOST", "http://localhost:4566")}"
    sqs            = "${get_env("LOCALSTACK_HOST", "http://localhost:4566")}"
    ssm            = "${get_env("LOCALSTACK_HOST", "http://localhost:4566")}"
    stepfunctions  = "${get_env("LOCALSTACK_HOST", "http://localhost:4566")}"
    sts            = "${get_env("LOCALSTACK_HOST", "http://localhost:4566")}"
  }
}
EOF
}

inputs = {}