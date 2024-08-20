import { NgForOf, NgIf } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { nanoid } from 'nanoid';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf],
  host: {
    class: 'block w-full h-dvh p-4',
  },
})
export class ChatComponent {
  messages = signal<{ id: string; message: string }[]>([]);
  id = signal(nanoid());
  message = '';

  channel = new BroadcastChannel('my-channel');

  ngOnInit() {
    // Listen for messages
    this.channel.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      // Update the messages
      this.messages.update((prev) => {
        return [...prev, newMessage];
      });
    };
  }

  send() {
    const newMessage = { id: this.id(), message: this.message };
    // Broadcast the message
    this.channel.postMessage(JSON.stringify(newMessage));
    // Update the messages
    this.messages.update((prev) => {
      return [...prev, newMessage];
    });
    // Clear the input
    this.message = '';
  }
}
