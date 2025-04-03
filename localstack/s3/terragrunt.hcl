terraform {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-s3-bucket.git?ref=v4.2.1"
}

locals {
  serverless  = read_terragrunt_config(find_in_parent_folders("serverless.hcl"))
  common_tags = local.serverless.locals.common_tags
}

include {
  path = find_in_parent_folders("localstack.hcl")
}

inputs = {
  bucket = local.serverless.locals.service_bucket
  tags = merge(local.common_tags, {
    Name = local.serverless.locals.service_bucket
  })
}
