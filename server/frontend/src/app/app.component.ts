import { Component, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import Quill from 'quill';
export const SERVER_URL = 'http://localhost:3000/';
export const LIVE_URL = 'https://code-sharing-bm2k.onrender.com';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  code!: string;
  private socket = inject(Socket);
  isDarkMode = true;
  @ViewChild('quill') quill!: Quill;
  ngOnInit() {
    // Listen for code updates from the server
    this.socket.on('updatedCode', (code: string) => {
      this.code = code;
    });
  }


  toggleDarkMode(event: any){
    this.isDarkMode = event.target.checked;
  }

  onSelectionChanged (event: any)  {
    if (event.oldRange == null) {
      this.onFocus();
    }
    if (event.range == null) {
      this.onBlur();
    }
  }

  onContentChanged = (event: any) => {
    console.log(event);
    this.socket.emit('updateCode', event);
  }

  onFocus = () => {
    console.log("On Focus");
  }
  onBlur = () => {
    console.log("Blurred");
  }
}
