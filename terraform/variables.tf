variable "app_name" {
  description = "The name of the Amplify application"
  type        = string
  default     = "pomo-drogue-web"
}

variable "github_repository" {
  description = "The GitHub repository URL (e.g., https://github.com/user/repo)"
  type        = string
}

variable "github_token" {
  description = "GitHub Personal Access Token for Amplify to access the repository"
  type        = string
  sensitive   = true
}

variable "branch_name" {
  description = "The branch to deploy"
  type        = string
  default     = "main"
}
