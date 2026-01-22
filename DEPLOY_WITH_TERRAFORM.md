# AWS Amplify デプロイ手順 (Terraform)

このプロジェクトは Terraform を使用して AWS Amplify 上にデプロイ環境を構築します。

## 前提条件

*   AWS CLI がインストールされ、設定されていること (`aws configure`)
*   Terraform がインストールされていること
*   GitHub のアカウントと対象のリポジトリがあること

## 手順 1: GitHub Personal Access Token の取得

AWS Amplify が GitHub リポジトリにアクセスし、Webhook を設定するためにアクセストークンが必要です。

1.  GitHub にログインし、[Personal access tokens (Classic)](https://github.com/settings/tokens) ページへ移動します。
2.  "Generate new token (classic)" をクリックします。
3.  以下の権限 (Scopes) を選択します:
    *   `repo` (Full control of private repositories)
    *   `admin:repo_hook` (Full control of repository hooks)
4.  トークンを生成し、値をコピーしておきます（後で二度と表示されません）。

## 手順 2: Terraform の初期化

プロジェクトのルートディレクトリで以下のコマンドを実行し、`terraform` ディレクトリに移動します。

```bash
cd terraform
terraform init
```

## 手順 3: デプロイ環境の構築

以下のコマンドを実行して、AWS リソースを作成します。
実行時に `github_repository` (リポジトリの URL) と `github_token` (手順1で取得したトークン) の入力が求められます。

```bash
terraform apply
```

また、変数をコマンドライン引数として渡すことも可能です。

```bash
terraform apply \
  -var="github_repository=https://github.com/YOUR_USERNAME/YOUR_REPO" \
  -var="github_token=ghp_xxxxxxxxxxxxxxxxx"
```

確認プロンプトが表示されたら `yes` と入力します。

完了すると、AWS Amplify Console に新しいアプリが作成され、指定したブランチ（デフォルトは `main`）へのプッシュをトリガーに自動デプロイが開始されます。

## 注意事項

*   **機密情報の管理**: `.tfstate` ファイルや `.tfvars` ファイルには GitHub トークンなどの機密情報が含まれる場合があります。これらは `.gitignore` に追加されており、Git にはコミットされないようになっていますが、取り扱いには十分注意してください。
*   **自動デプロイ**: コードを GitHub の `main` ブランチにプッシュすると、Amplify が自動的にビルドとデプロイを行います。
*   **クリーンアップ**: 環境を削除する場合は、`terraform destroy` を実行してください。
