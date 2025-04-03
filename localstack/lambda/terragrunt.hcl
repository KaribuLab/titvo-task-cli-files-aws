terraform {
  source = "git::https://github.com/KaribuLab/terraform-aws-function.git?ref=v0.5.1"
}

locals {
  serverless    = read_terragrunt_config(find_in_parent_folders("serverless.hcl"))
  function_name = "${local.serverless.locals.service_name}-lambda-${local.serverless.locals.stage}"
  common_tags   = local.serverless.locals.common_tags
  base_path     = "${local.serverless.locals.parameter_path}/${local.serverless.locals.stage}"
}

include {
  path = find_in_parent_folders("localstack.hcl")
}

dependency s3 {
  config_path = "${get_parent_terragrunt_dir()}/localstack/s3"
}

inputs = {
  function_name = local.function_name
  role_name     = "${local.function_name}-role"
  policy_name   = "${local.function_name}-policy"
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
        "Resource" : "*"
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "ssm:GetParametersByPath"
        ],
        "Resource" : "arn:aws:ssm:*:*:parameter${local.base_path}/task-cli-files"
      }
    ]
  })
  environment_variables = {
    PARAMETER_BASE_PATH = local.serverless.locals.parameter_path
    AWS_STAGE           = local.serverless.locals.stage
    AWS_ENDPOINT        = "http://localstack:4566"
  }
  runtime       = "nodejs20.x"
  handler       = "src/entrypoint.handler"
  bucket        = local.serverless.locals.service_bucket
  file_location = "${get_parent_terragrunt_dir()}/build"
  zip_location  = "${get_parent_terragrunt_dir()}/dist"
  zip_name      = "${local.function_name}.zip"
  common_tags = merge(local.common_tags, {
    Name = local.function_name
  })
}
