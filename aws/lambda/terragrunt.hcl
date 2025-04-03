terraform {
  source = "git::https://github.com/KaribuLab/terraform-aws-function.git?ref=v0.7.0"
}

locals {
  serverless    = read_terragrunt_config(find_in_parent_folders("serverless.hcl"))
  function_name = "${local.serverless.locals.service_name}-lambda-${local.serverless.locals.stage}"
  common_tags   = local.serverless.locals.common_tags
  base_path     = "${local.serverless.locals.parameter_path}/${local.serverless.locals.stage}"
}

include {
  path = find_in_parent_folders()
}

dependency log {
  config_path = "${get_parent_terragrunt_dir()}/aws/cloudwatch"
  mock_outputs = {
    log_arn = "log_arn"
  }
}

dependency parameters {
  config_path = "${get_parent_terragrunt_dir()}/aws/parameter"
  mock_outputs = {
    parameters = {
      "key" = "value"
    }
  }
}

inputs = {
  function_name = local.function_name
  iam_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        "Resource" : "${dependency.log.outputs.log_arn}:*"
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "ssm:GetParametersByPath"
        ],
        "Resource" : [
          "arn:aws:ssm:*:*:parameter${local.base_path}/common",
          "arn:aws:ssm:*:*:parameter${local.base_path}/task-cli-files"
        ]
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "dynamodb:Query"
        ],
        "Resource" : [
          dependency.parameters.outputs.parameters["${local.base_path}/infra/dynamo-api-key-table-arn"],
          "${dependency.parameters.outputs.parameters["${local.base_path}/infra/dynamo-api-key-table-arn"]}/index/*"
        ]
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "dynamodb:PutItem"
        ],
        "Resource" : [
          dependency.parameters.outputs.parameters["${local.base_path}/infra/dynamo-cli-files-table-arn"]
        ]
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "s3:PutObject"
        ],
        "Resource" : [
          dependency.parameters.outputs.parameters["${local.base_path}/infra/cli-files-bucket-arn"],
          "${dependency.parameters.outputs.parameters["${local.base_path}/infra/cli-files-bucket-arn"]}/*"
        ]
      }
    ]
  })
  environment_variables = {
    PARAMETER_BASE_PATH = local.serverless.locals.parameter_path
    AWS_STAGE           = local.serverless.locals.stage
  }
  runtime       = "nodejs20.x"
  handler       = "src/entrypoint.handler"
  bucket        = local.serverless.locals.service_bucket
  file_location = "${get_parent_terragrunt_dir()}/build"
  zip_location  = "${get_parent_terragrunt_dir()}/dist"
  zip_name      = "${local.function_name}.zip"
  common_tags   = local.common_tags
}
