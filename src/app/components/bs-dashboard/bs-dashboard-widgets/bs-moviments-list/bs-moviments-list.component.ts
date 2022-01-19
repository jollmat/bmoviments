import { Component, ElementRef, Input, ViewChild } from '@angular/core';

import { MovimentBSInterface } from 'src/app/model/interfaces/moviment-BS-interface';

import jsPDF from "jspdf";
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-bs-moviments-list',
  templateUrl: './bs-moviments-list.component.html',
  styleUrls: ['./bs-moviments-list.component.scss']
})
export class BSMovimentsListComponent {

  @Input() moviments: MovimentBSInterface[];
  @Input() showHeader = true;
  @Input() showBorder = true;
  @Input() showHover = true;
  @Input() showBankEntitySymbol = false;
  @Input() actionInCourse = false;

  @ViewChild('tableContainer') content:ElementRef;

  exportPDF() {

    let input = document.getElementById("tableContainer");
    html2canvas(input)
      .then((canvas) => {
        let imgData = canvas.toDataURL('image/png');
        let pdf = new jsPDF('portrait', 'px', 'a4', 'false');
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save("download.pdf");
       
      });
  }

}
