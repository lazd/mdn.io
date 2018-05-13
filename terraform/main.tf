variable "access_key" {}
variable "secret_key" {}
variable "account_id" {}

variable "region" {
  default = "us-east-1"
}

provider "aws" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region     = "${var.region}"
}

resource "aws_api_gateway_account" "cloudwatch" {
  cloudwatch_role_arn = "${aws_iam_role.cloudwatch.arn}"
}

resource "aws_iam_role" "cloudwatch" {
  name = "mdn_io_gateway_cloudwatch"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "cloudwatch" {
  name = "default"
  role = "${aws_iam_role.cloudwatch.id}"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:DescribeLogGroups",
                "logs:DescribeLogStreams",
                "logs:PutLogEvents",
                "logs:GetLogEvents",
                "logs:FilterLogEvents"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

resource "aws_iam_role" "mdn_io_lambda_iam" {
  name = "mdn_io_lambda_iam"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "mdn_io_iam_policy" {
  name = "mdn_io_iam_policy"
  role = "${aws_iam_role.mdn_io_lambda_iam.id}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
EOF
}

resource "aws_api_gateway_rest_api" "mdn_io" {
  name = "mdn_io"
}

resource "aws_api_gateway_method" "mdn_io_root_method" {
  rest_api_id   = "${aws_api_gateway_rest_api.mdn_io.id}"
  resource_id   = "${aws_api_gateway_rest_api.mdn_io.root_resource_id}"
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "mdn_io_root" {
  rest_api_id             = "${aws_api_gateway_rest_api.mdn_io.id}"
  resource_id             = "${aws_api_gateway_rest_api.mdn_io.root_resource_id}"
  http_method             = "${aws_api_gateway_method.mdn_io_root_method.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/${aws_lambda_function.mdn_io_lambda.arn}/invocations"
}

resource "aws_api_gateway_resource" "mdn_io_proxy" {
  rest_api_id = "${aws_api_gateway_rest_api.mdn_io.id}"
  parent_id   = "${aws_api_gateway_rest_api.mdn_io.root_resource_id}"
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "mdn_io_proxy_method" {
  rest_api_id   = "${aws_api_gateway_rest_api.mdn_io.id}"
  resource_id   = "${aws_api_gateway_resource.mdn_io_proxy.id}"
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "mdn_io_proxy" {
  rest_api_id             = "${aws_api_gateway_rest_api.mdn_io.id}"
  resource_id             = "${aws_api_gateway_resource.mdn_io_proxy.id}"
  http_method             = "${aws_api_gateway_method.mdn_io_proxy_method.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/${aws_lambda_function.mdn_io_lambda.arn}/invocations"
}

resource "aws_lambda_function" "mdn_io_lambda" {
  filename      = "${path.module}/../bundle/bundle.zip"
  function_name = "mdn_io"
  role          = "${aws_iam_role.mdn_io_lambda_iam.arn}"
  handler       = "lambda.handler"
  runtime       = "nodejs6.10"

  environment {
    variables = {
      NODE_ENV = "production"
    }
  }
}

resource "aws_lambda_permission" "mdn_io_lambda_apigw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.mdn_io_lambda.arn}"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${aws_api_gateway_rest_api.mdn_io.id}/*"
}
