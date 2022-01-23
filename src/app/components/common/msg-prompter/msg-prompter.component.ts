import { Component, OnInit } from '@angular/core';
import { PrompterService } from 'src/app/services/prompter.service';

@Component({
  selector: 'app-msg-prompter',
  templateUrl: './msg-prompter.component.html',
  styleUrls: ['./msg-prompter.component.scss']
})
export class MsgPrompterComponent implements OnInit {

  message: string | undefined;

  constructor(private prompterService: PrompterService) {}

  ngOnInit(): void {
    this.prompterService.message.subscribe((_msg) => {
      this.message = _msg;
    });
  }

}
