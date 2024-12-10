// src/app/chatbot/chatbot.component.ts
import { Component, OnInit, inject, Signal, signal, input } from '@angular/core';
import { NgFor } from '@angular/common';
import { ChatService } from './chatbot.service';
import { Car } from '../cars/car.interface';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  standalone: true,
  imports: [NgFor]
})
export class ChatbotComponent implements OnInit {
  responses = signal<{ question: string, answer: string }[]>([]);
  cars = input.required<Car[]>();

  private chatService = inject(ChatService);

  ngOnInit(): void {
    this.chatService.setCars(this.cars());
    this.responses.set(this.chatService.getResponses());
  }

  askQuestion(question: string) {
    this.chatService.askQuestion(question);
    this.responses.set(this.chatService.getResponses());
  }
}