import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface ChatRequest {
  message: string;
  sessionId?: string;
}

export interface SpecialData {
  id: string;
  description: string;
  itemName: string;
  itemType: string;
  happyHourPrice: number;
  originalPrice: number;
  discountInfo: string;
  formattedPrice: string;
}

export interface HappyHourData {
  id: string;
  establishmentId: string;
  establishmentName: string;
  dayOfWeek: number;
  dayName: string;
  startTime: string;
  endTime: string;
  lastVerifiedAt: string;
  specials: SpecialData[];
}

export interface EstablishmentData {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  website: string;
  instagram: string;
  facebook: string;
  description: string;
  lastVerifiedAt: string;
  happyHours: HappyHourData[];
}

export interface ChatResponse {
  response: string;
  establishments: EstablishmentData[];
  queryType: string;
}

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private apiUrl = "http://localhost:8080/api/chat";

  constructor(private http: HttpClient) {}

  sendMessage(message: string, sessionId?: string): Observable<ChatResponse> {
    const request = { chat: { message, sessionId } };
    return this.http.post<ChatResponse>(`${this.apiUrl}/message`, request);
  }

  getEstablishments(): Observable<{
    establishments: EstablishmentData[];
    count: number;
  }> {
    return this.http.get<{
      establishments: EstablishmentData[];
      count: number;
    }>(`${this.apiUrl}/establishments`);
  }

  healthCheck(): Observable<{ status: string; service: string; area: string }> {
    return this.http.get<{ status: string; service: string; area: string }>(
      `${this.apiUrl}/health`,
    );
  }
}
