import { MainLayout } from "@/components/layout/MainLayout";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ConversationList } from "@/components/layout/ConversationList";
import { ChatArea } from "@/components/layout/ChatArea";

export default function Home() {
  return (
    <MainLayout
      sidebar={<AppSidebar />}
      conversationList={<ConversationList />}
      chatArea={<ChatArea />}
    />
  );
}
