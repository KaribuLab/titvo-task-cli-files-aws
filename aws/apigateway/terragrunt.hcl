terraform {
  source = "git::https://github.com/KaribuLab/terraform-aws-api-gateway.git//function-route?ref=v1.0.0"
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
      "${local.base_path}/infra/api-gateway-task-id" = "api-gateway-task-id"
    }
  }
}

dependency lambda {
  config_path = "${get_parent_terragrunt_dir()}/aws/lambda"
  mock_outputs = {
    function_name = "function_name"
  }
}

inputs = {
  api_gateway_id = dependency.parameters.outputs.parameters["${local.base_path}/infra/api-gateway-task-id"]
  routes = [
    {
      path          = "/cli-files"
      method        = "POST"
      function_name = dependency.lambda.outputs.function_name
    }
  ]
  common_tags = local.common_tags
}
