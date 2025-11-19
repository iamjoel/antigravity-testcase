import Link from 'next/link';
import { MessageSquare, Sparkles, Layout, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:24px_24px] bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-8 py-20 text-center">
          <h1 className="text-8xl font-black uppercase tracking-tight mb-8 text-black [text-shadow:4px_4px_0px_#00f0ff,8px_8px_0px_#ffff00,12px_12px_0px_#ff00f0]">
            DIFY APPS
          </h1>

          <p className="text-3xl font-bold uppercase mb-12 text-black border-4 border-black bg-secondary inline-block px-8 py-4 shadow-[8px_8px_0px_0px_#000000]">
            Your AI Chatbot Hub
          </p>

          <p className="text-xl font-medium mb-16 max-w-2xl mx-auto text-black">
            Aggregate multiple Dify chatbots and OpenAI models in one powerful interface.
            Chat, organize, and customize with style.
          </p>

          <Link
            href="/app"
            className="inline-block text-2xl font-black uppercase px-12 py-6 bg-primary text-black border-4 border-black shadow-[8px_8px_0px_0px_#000000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
          >
            ENTER APP →
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-8 bg-white border-t-8 border-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-6xl font-black uppercase text-center mb-16 text-black">
            FEATURES
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000000]">
              <div className="w-16 h-16 bg-primary border-2 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_#000000]">
                <MessageSquare className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-black uppercase mb-4 text-black">DIFY APPS</h3>
              <p className="text-lg font-medium text-black">
                Connect and manage multiple Dify chatbots in one place. Switch between apps seamlessly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000000]">
              <div className="w-16 h-16 bg-secondary border-2 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_#000000]">
                <Sparkles className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-black uppercase mb-4 text-black">MODEL APPS</h3>
              <p className="text-lg font-medium text-black">
                Direct access to OpenAI models (GPT-4, GPT-3.5). Custom system prompts for each app.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000000]">
              <div className="w-16 h-16 bg-accent border-2 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_#000000]">
                <Zap className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-black uppercase mb-4 text-black">AUTO TITLES</h3>
              <p className="text-lg font-medium text-black">
                Conversations are automatically titled based on content. No more "New Chat" clutter.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000000]">
              <div className="w-16 h-16 bg-primary border-2 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_#000000]">
                <Layout className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-black uppercase mb-4 text-black">RESIZABLE</h3>
              <p className="text-lg font-medium text-black">
                Drag to resize panels. Your layout preferences are saved automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 border-t-8 border-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-black uppercase mb-8 text-black">
            READY TO CHAT?
          </h2>
          <p className="text-xl font-medium mb-12 text-black">
            Start managing your AI conversations in style.
          </p>
          <Link
            href="/app"
            className="inline-block text-2xl font-black uppercase px-12 py-6 bg-secondary text-black border-4 border-black shadow-[8px_8px_0px_0px_#000000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
          >
            GET STARTED →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 bg-black text-white border-t-4 border-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-bold uppercase tracking-wide">
            DIFY APPS © 2025 | POP ART EDITION
          </p>
        </div>
      </footer>
    </div>
  );
}
