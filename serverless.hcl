locals {
  region = get_env("AWS_REGION")
  stage  = get_env("AWS_STAGE")
  stages = {
    test = {
      name = "Testing"
    },
    localstack = {
      name = "Localstack"
    },
    prod = {
      name = "Production"
    }
  }
  service_name   = "tvo-task-cli-files"
  service_bucket = "${local.service_name}-${local.region}"
  log_retention  = 7
  parameter_path = "/tvo/security-scan"
  common_tags = {
    Project     = "Github Security Scan"
    Customer    = "Titvo"
    Team        = "Area Creacion"
    Environment = "${local.stages[local.stage].name}"
  }
}
