terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "eu-central-1"
}

resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name              = "/aws/lambda/google_spreadsheet_email_notifier_demo_lambda"
  retention_in_days = 1
  lifecycle {
    prevent_destroy = false
  }
}

data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "${path.module}/.terraform/archive_files/tmp"
  output_path = "${path.module}/.terraform/archive_files/google_spreadsheet_email_notifier_demo_lambda.zip"
}

resource "aws_lambda_function" "google_spreadsheet_email_notifier_demo_lambda" {
  filename      = data.archive_file.lambda.output_path
  function_name = "google_spreadsheet_email_notifier_demo_lambda"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "index.handler"
  timeout       = 60

  source_code_hash = data.archive_file.lambda.output_base64sha256

  runtime = "nodejs22.x"

  depends_on = [aws_cloudwatch_log_group.lambda_log_group]

  environment {
    variables = {
      GOOGLE_SERVICE_ACCOUNT_EMAIL : local.envs.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      GOOGLE_PRIVATE_KEY : local.envs.GOOGLE_PRIVATE_KEY,
      REGION : local.envs.REGION,
      FROM_EMAIL : local.envs.FROM_EMAIL,
      DESTINATION_EMAIL : local.envs.DESTINATION_EMAIL,
      SEND_REAL_EMAILS : local.envs.SEND_REAL_EMAILS,
      BUCKET : aws_s3_bucket.values_bucket.bucket,
      S3_KEY : local.envs.S3_KEY,
    }
  }
}
