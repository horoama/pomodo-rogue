resource "aws_amplify_app" "app" {
  name       = var.app_name
  repository = var.github_repository

  # GitHub access token
  access_token = var.github_token

  # The build specification is defined in amplify.yml in the repository root.
  # Amplify will automatically detect it.

  # Enable auto branch creation for feature branches if desired (optional)
  enable_auto_branch_creation = true

  # Auto branch creation patterns (optional)
  auto_branch_creation_patterns = [
    "*",
    "*/**"
  ]

  enable_branch_auto_build = true
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.app.id
  branch_name = var.branch_name

  framework = "Web"
  stage     = "PRODUCTION"

  enable_auto_build = true
}
