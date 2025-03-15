# KillSaaS

A platform for users to post and vote on SaaS products they want to see open-sourced alternatives for.

## Prerequisites

- Node.js (v20+)
- Go 1.23+ 
- pnpm
- Docker and Docker Compose (for containerized setup)

## Setup and Running

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/skilldeliver/killsaas.git
   cd killsaas
   ```

2. Set up environment variables:
   ```
   cp .env.example .env
   cp web/.env.example web/.env.local
   ```

3. Install dependencies and run the web application:
   ```
   pnpm install
   pnpm run dev
   ```
   The app will be available at http://localhost:3000
4. Enter the server `cd server` && `go mod init server && go mod tidy`
5. Run the server `go run main.go serve`

### Docker Setup

TBD
