import {
  Mic,
  MessageSquare,
  BarChart2,
  Music,
  Plus,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatHistoryProps {
  activeMode: string;
  onModeChange: (mode: string) => void;
}

export default function ChatHistory({
  activeMode,
  onModeChange,
}: ChatHistoryProps) {
  const conversations = [
    {
      id: 1,
      title: "Presentation Practice",
      date: "2 hours ago",
      mode: "voice-insights",
    },
    { id: 2, title: "Interview Prep", date: "Yesterday", mode: "tone-trainer" },
    { id: 3, title: "Sales Pitch", date: "3 days ago", mode: "chat-companion" },
    {
      id: 4,
      title: "Conference Talk",
      date: "Last week",
      mode: "speech-sculptor",
    },
  ];

  const modeIcons = {
    "voice-insights": <BarChart2 className="h-4 w-4" />,
    "tone-trainer": <Music className="h-4 w-4" />,
    "chat-companion": <MessageSquare className="h-4 w-4" />,
    "speech-sculptor": <Mic className="h-4 w-4" />,
  };

  const getModeIcon = (mode: string) => {
    return (
      modeIcons[mode as keyof typeof modeIcons] || (
        <MessageSquare className="h-4 w-4" />
      )
    );
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Mic className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Speech Analyzer</span>
                <span className="text-xs text-muted-foreground">
                  AI-powered feedback
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Modes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeMode === "voice-insights"}
                  onClick={() => onModeChange("voice-insights")}
                  tooltip="Analyze your speech patterns"
                >
                  <BarChart2 className="h-4 w-4" />
                  <span>Voice Insights</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeMode === "tone-trainer"}
                  onClick={() => onModeChange("tone-trainer")}
                  tooltip="Practice speaking with different tones"
                >
                  <Music className="h-4 w-4" />
                  <span>Tone Trainer</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeMode === "chat-companion"}
                  onClick={() => onModeChange("chat-companion")}
                  tooltip="Practice conversation skills"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Chat Companion</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeMode === "speech-sculptor"}
                  onClick={() => onModeChange("speech-sculptor")}
                  tooltip="Improve your speech content and delivery"
                >
                  <Mic className="h-4 w-4" />
                  <span>Speech Sculptor</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Recent Conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {conversations.map((conversation) => (
                <SidebarMenuItem key={conversation.id}>
                  <SidebarMenuButton>
                    {getModeIcon(conversation.mode)}
                    <div className="flex flex-col">
                      <span>{conversation.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {conversation.date}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Plus className="h-4 w-4" />
              <span>New Conversation</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
              <span>User Profile</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
