resource "aws_cloudwatch_event_rule" "scheduled_event" {
  name        = "scheduled_event"
  description = "Triggers every round hour (e.g., 19:00, 20:00, etc.)."

  schedule_expression = "cron(0 * * * ? *)"
}

resource "aws_cloudwatch_event_target" "lambda_target" {
  rule      = aws_cloudwatch_event_rule.scheduled_event.name
  target_id = "SendToLambda"
  arn       = aws_lambda_function.google_spreadsheet_email_notifier_demo_lambda.arn

  input = jsonencode({
    "detail" : {
      "valuesToFind" : ["value1"]
    },
  })
}

resource "aws_lambda_permission" "allow_eventbridge" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.google_spreadsheet_email_notifier_demo_lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.scheduled_event.arn
}
