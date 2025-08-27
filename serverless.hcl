locals {
  region          = get_env("AWS_REGION")
  stage           = get_env("AWS_STAGE")
  use_bucket_uuid = get_env("USE_BUCKET_UUID", "no")
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
  service_bucket = local.use_bucket_uuid == "no" ? "${local.service_name}-${local.region}" : "${local.service_name}-${local.region}-${uuid()}"
  parameter_path = "/tvo/security-scan"
  tags_file_path = "${get_terragrunt_dir()}/common_tags.json"
  log_retention  = 7
  common_tags = fileexists(local.tags_file_path) ? jsondecode(file(local.tags_file_path)) : {
    Project = "Titvo Task CLI Files"
  }
}
