
How to run the app:

```bash
pnpm install
pnpm dev
```

Your app template should now be running on [localhost:3000](http://localhost:3000/).

## Copilot Models Setup

This project is configured to work with GitHub models and makes use of the free Copilot models. Follow the steps below to acquire your Copilot environment variables:

### Getting the Copilot Environment Variables

1. Get the refresh token:  
   A refresh token is used to obtain an access token and should be kept secret. To get the refresh token, follow these steps:

   - Run the following command and note down the returned `device_code` and `user_code`.

     For Bash:
     ```bash
     # 01ab8ac9400c4e429b23 is the client_id for VS Code
     curl https://github.com/login/device/code -X POST -d 'client_id=01ab8ac9400c4e429b23&scope=user:email'
     ```

     For PowerShell:
     ```powershell
     # 01ab8ac9400c4e429b23 is the client_id for VS Code
     $body = @{
         client_id = "01ab8ac9400c4e429b23";
         scope = "user:email"
     }
     Invoke-RestMethod -Uri "https://github.com/login/device/code" -Method Post -Body $body
     ```

   - Open https://github.com/login/device/ and enter the `user_code`.

   - Replace `YOUR_DEVICE_CODE` with the `device_code` obtained earlier and run:

     For Bash:
     ```bash
     curl https://github.com/login/oauth/access_token -X POST -d 'client_id=01ab8ac9400c4e429b23&scope=user:email&device_code=YOUR_DEVICE_CODE&grant_type=urn:ietf:params:oauth:grant-type:device_code'
     ```

     For PowerShell:
     ```powershell
     $body = @{
         client_id = "01ab8ac9400c4e429b23";
         scope = "user:email";
         device_code = "d3971da0e2633a6e5ed2feaf7966eb788219b3c4";
         grant_type = "urn:ietf:params:oauth:grant-type:device_code"
     }
     Invoke-RestMethod -Uri "https://github.com/login/oauth/access_token" -Method Post -Body $body
     ```

   - Note down the `access_token` starting with `gho_`.


## Github Models setup:
https://docs.github.com/en/github-models/prototyping-with-ai-models


## Personal use:
The deployed version is for my personal use only. If you want to use it, you can deploy it on your own server, remember to remove the sign up protection in `prisma/queries.ts`

## Deploying to Vercel
This repo use Vercel template, i recommend you to deploy it to Vercel, it's free and easy to use.

## Ethical Use
- Respect the GitHub Copilot terms of service.
- Minimize the use of the models for non-coding purposes.
- Be mindful of the risk of being banned by GitHub Copilot for misuse.

## License
This project was inspired by https://github.com/jjleng/copilot-more