import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ChatService, ChatResponse, EstablishmentData } from "./chat.service";

interface ChatMessage {
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  establishments?: EstablishmentData[];
}

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"],
  imports: [CommonModule, FormsModule],
})
export default class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild("messagesContainer") private messagesContainer!: ElementRef;

  messages: ChatMessage[] = [];
  userInput = "";
  isLoading = false;
  sessionId = this.generateSessionId();

  suggestedQuestions = [
    "What places have happy hours right now?",
    "Do any bars have happy hour on Tuesdays?",
    "What are the specials at Belmont Brewing Co?",
    "Show me drink specials",
    "List all places",
  ];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.addBotMessage(
      'Welcome to the Belmont Shore Happy Hour Bot! I can help you find happy hours in Belmont Shore, Naples, and 2nd & PCH areas of Long Beach.\n\nTry asking me:\n- "What places have happy hours right now?"\n- "Do any bars have happy hour on Tuesdays?"\n- "What are the happy hour specials at [restaurant name]?"\n\nHow can I help you today?',
    );
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (!this.userInput.trim() || this.isLoading) {
      return;
    }

    const userMessage = this.userInput.trim();
    this.addUserMessage(userMessage);
    this.userInput = "";
    this.isLoading = true;

    this.chatService.sendMessage(userMessage, this.sessionId).subscribe({
      next: (response: ChatResponse) => {
        this.addBotMessage(response.response, response.establishments);
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error sending message:", error);
        this.addBotMessage(
          "Sorry, I'm having trouble connecting to the server. Please make sure the backend is running and try again.",
        );
        this.isLoading = false;
      },
    });
  }

  askSuggestedQuestion(question: string): void {
    this.userInput = question;
    this.sendMessage();
  }

  private addUserMessage(content: string): void {
    this.messages.push({
      type: "user",
      content,
      timestamp: new Date(),
    });
  }

  private addBotMessage(
    content: string,
    establishments?: EstablishmentData[],
  ): void {
    this.messages.push({
      type: "bot",
      content,
      timestamp: new Date(),
      establishments,
    });
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error("Error scrolling to bottom:", err);
    }
  }

  private generateSessionId(): string {
    return "session-" + Math.random().toString(36).substring(2, 15);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  formatMessageContent(content: string): string {
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
  }
}
