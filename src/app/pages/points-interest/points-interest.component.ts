import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-points-interest',
  templateUrl: './points-interest.component.html',
  styleUrls: ['./points-interest.component.css']
})
export class PointsInterestComponent implements OnInit {

  kmNo: any = [];
  menuItem: any = {};

  model: any = [];
  selectedKmNo: any;
  selectedRoute: any;
  constructor() { }

  ngOnInit(): void {
    this.kmNo = [
      { name: "กม.10", id: 0 },
      { name: "กม.100", id: 1 },
      { name: "กม.105", id: 2 }
    ];

    this.menuItem.icon = 'assets/img/m-stat.png';
    this.model = [{
      imageUrl: 'assets/img/points-1.png',
      title: 'จุดที่ 1: ทางออกพหลโยธิน กม.0',
      km: '16',
      cameraNo: 'C-1355',
      traffic: '900 คัน/ชม.',
      level: 'D',
      speed: '33 กม./ชม.',
      stats: '0.7'
    },
    {
      imageUrl: 'assets/img/points-2.png',
      title: 'จุดที่ 2: ทางออกพระราม 9 กม.0',
      km: '16',
      cameraNo: 'C-1355',
      traffic: '900 คัน/ชม.',
      level: 'D',
      speed: '33 กม./ชม.',
      stats: '0.7'
    },
    {
      imageUrl: 'assets/img/points-2.png',
      title: 'จุดที่ 3: ต่างระดับทับช้าง กม.7',
      km: '16',
      cameraNo: 'C-1355',
      traffic: '900 คัน/ชม.',
      level: 'D',
      speed: '33 กม./ชม.',
      stats: '0.7'
    }];
  }

  onChangeModel(event) {
    // console.log(event)
    // this.selectedDeviceTypes = event.value.name;
    if (event.value.id == 0){
      // this.showportgenerate = true;
    } else {
      // this.showportgenerate = false;
    }
    // console.log(this.selectedDeviceTypes)
  }

}
