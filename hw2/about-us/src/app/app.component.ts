import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'About Our Team';
  mission = 'We build delightful software and learn Angular together!';

  photoUrl = '/bsone2.png';       
  isButtonDisabled = false;

  likes = 0;
  showMessage = false;

  name = '';
  email = '';
  subscribed = false;

  
  addLike() {
    this.likes++;
  }

  toggleMessage() {
    this.showMessage = !this.showMessage;
  }

  subscribe() {
    this.subscribed = true;
  }
}