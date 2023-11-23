import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Socket } from 'ngx-socket-io';
export const SERVER_URL = 'http://localhost:3000/';
export const LIVE_URL = 'https://code-sharing-yshashi.vercel.app/';
declare var CodeJar: any;
declare var hljs: any;
declare var Prism: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  code: string = '';
  private socket = inject(Socket);
  isDarkMode = true;
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    // Check if the pressed key is the 'Tab' key
    if (event.key === 'Tab') {
      event.preventDefault(); // Prevent the default behavior (moving focus to the next element)

      // Get the current cursor position
      const cursorPos = this.getTextareaCursorPosition();

      // Insert a tab character at the cursor position
      this.code = `${this.code.substring(0, cursorPos)}\t${this.code.substring(cursorPos)}`;

      // Move the cursor position after the inserted tab character
      this.setTextareaCursorPosition(cursorPos + 1);
    }
  }

  private getTextareaCursorPosition(): number {
    const textarea: HTMLTextAreaElement = document.querySelector('.textarea-wrapper textarea')!;
    return textarea.selectionStart;
  }

  private setTextareaCursorPosition(position: number): void {
    const textarea: HTMLTextAreaElement = document.querySelector('.textarea-wrapper textarea')!;
    textarea.selectionStart = textarea.selectionEnd = position;
  }

  ngOnInit() {

    // Listen for code updates from the server
    this.socket.on('updatedCode', (code: string) => {
      this.code = code;
    });


  }

  updateCode() {
    // Emit the updated code to the server
    this.socket.emit('updateCode', this.code);
  }
  toggleDarkMode(event: any){

    this.isDarkMode = event.target.checked;
  }

  updateLineNumbers() {
    const lineNumbers = document.querySelector('.line-numbers')!;
    const lines = this.code.split('\n').length;

    // Clear existing line numbers
    lineNumbers.innerHTML = '';

    // Add new line numbers
    for (let i = 1; i <= lines; i++) {
      const lineNumberElement = document.createElement('div');
      lineNumberElement.textContent = i.toString();
      lineNumbers.appendChild(lineNumberElement);
    }
  }
}
