# Dify Chatbot Aggregator

A Next.js web application that aggregates multiple Dify Chatbots and Vercel AI SDK Model Apps into a single, unified interface.

## Features

- **Unified Interface**: Access multiple chatbots from a single sidebar.
- **App Types**:
  - **Dify Apps**: Connect to existing Dify chatbots via API Key.
  - **Model Apps**: Chat directly with LLMs (like GPT-4o) using Vercel AI SDK.
- **Real-time Streaming**: Smooth, streaming responses for all chat interactions.
- **Conversation History**:
  - **Dify**: Synced with Dify's backend history.
  - **Model Apps**: Persisted locally in your browser.
- **Persistence**: App configurations are saved in Local Storage.
- **Secure Configuration**: Support for environment variables to manage API keys securely.

## Getting Started

### Prerequisites

- Node.js 18+ installed.
- A Dify account (for Dify Apps).
- An OpenAI API Key (for Model Apps).

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd 02-dify-apps
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    Create a `.env.local` file in the root directory:
    ```bash
    touch .env.local
    ```

    Add the following keys:
    ```env
    # Optional: Default Dify App to load on start
    NEXT_PUBLIC_DIFY_DEMO_KEY=your-dify-app-api-key

    # Required for Model Apps (GPT-4, etc.)
    OPENAI_API_KEY=sk-your-openai-api-key
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Adding a Dify App
1.  Click the **+** button in the sidebar.
2.  Select **Dify App**.
3.  Enter a Name, Icon (Emoji), and your **Dify API Key**.
4.  Click **Add App**.

### Adding a Model App
1.  Click the **+** button in the sidebar.
2.  Select **Model App**.
3.  Choose a model (e.g., GPT-4o).
4.  **API Key**:
    - If `OPENAI_API_KEY` is set in `.env.local`, you don't need to do anything.
    - If not, you will see a warning.
5.  Click **Add App**.

### Managing Apps
- **Switch Apps**: Click on an app in the sidebar.
- **Remove App**: Hover over an app in the sidebar and click the trash icon.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand (with persistence)
- **AI Integration**: Vercel AI SDK
- **Icons**: Lucide React

## License

[MIT](LICENSE)
