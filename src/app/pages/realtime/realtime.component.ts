import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { GetalarmlogServiceService } from '@app/getalarmlog-service.service';
import { NavService } from '@app/nav.serive';
import { ThemeService } from '@app/theme.service';
import { Subscription } from 'rxjs';
declare var markerClusterer: any;
import * as d3 from 'd3';
import { HttpClient } from '@angular/common/http'; // นำเข้า HttpClient

@Component({
  selector: 'app-realtime',
  templateUrl: './realtime.component.html',
  styleUrls: ['./realtime.component.css']
})
export class RealtimeComponent implements OnInit {


  kmNo: any = [];
  menuItem: any = {};

  model: any = [];
  navId: any;

  model3: any = [];
  model4: any = [];
  hexagonsData: any[];
  hexagonsData2: any[];
  constructor(private navService: NavService, public themeService: ThemeService, private alarmService: GetalarmlogServiceService, private el: ElementRef, private http: HttpClient) { }

  ngOnInit(): void {
    this.navService.navId$.subscribe(navId => {
      // console.log(navId)
      this.navId = navId ?? '/realtime1';
      // ทำสิ่งที่ต้องการกับ navId ที่ได้รับ
      // console.log('Received navId:', this.navId);
      if (this.navId == '/realtime3') {
        this.initOverlays();
      }
    });

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

    this.model4 = [{
      route: '9',
      level: 'แยกต่างระดับคลองหลวง',
      level_id: '901',
      route_name: 'พหลโยธิน',
      ramp_id: '90101',
      zone: '1',
      last_date: '2024-06-11',
      ts_count: '273',
      data_availability: '94.79',
      last_update: '15 นาที'
    },
    {
      route: '9',
      level: 'แยกต่างระดับคลองหลวง',
      level_id: '901',
      route_name: 'พหลโยธิน',
      ramp_id: '90101',
      zone: '1',
      last_date: '2024-06-11',
      ts_count: '273',
      data_availability: '94.79',
      last_update: '1 วัน'
    },
    {
      route: '9',
      level: 'แยกต่างระดับคลองหลวง',
      level_id: '901',
      route_name: 'พหลโยธิน',
      ramp_id: '90101',
      zone: '1',
      last_date: '2024-06-11',
      ts_count: '273',
      data_availability: '94.79',
      last_update: '15 นาที'
    },
    {
      route: '9',
      level: 'แยกต่างระดับคลองหลวง',
      level_id: '901',
      route_name: 'พหลโยธิน',
      ramp_id: '90101',
      zone: '1',
      last_date: '2024-06-11',
      ts_count: '273',
      data_availability: '94.79',
      last_update: '1 วัน'
    }];
  }
  ngAfterViewInit(): void {
     this.hexagonsData = [
      // {
      //   ID: 139,
      //   freewayID: 9,
      //   direction: "L",
      //   kmStart: 0,
      //   kmEnd: 1,
      //   polygon: "400,313,419,321,437,314,437,378,419,385,400,378",
      //   status: 1
      // },
      // {
      //   ID: 140,
      //   freewayID: 9,
      //   direction: "L",
      //   kmStart: 1,
      //   kmEnd: 2,
      //   polygon: "400,377,419,385,437,377,437,408,419,416,400,409",
      //   status: 2
      // },
      // {
      //   ID: 207,
      //   freewayID: 9,
      //   direction: "R",
      //   kmStart: 1,
      //   kmEnd: 0,
      //   polygon: "350,322,368,314,386,322,386,385,368,378,350,385",
      //   status: 3
      // },
      // {
      //   ID: 208,
      //   freewayID: 9,
      //   direction: "R",
      //   kmStart: 2,
      //   kmEnd: 1,
      //   polygon: "350,386,368,378,386,386,386,415,368,409,350,416",
      //   status: 4
      // }
    ];
    this.getPolygonData();
   
    this.navService.navId$.subscribe(navId => {
      // console.log(navId)
      this.navId = navId ?? '/realtime1';
      // ทำสิ่งที่ต้องการกับ navId ที่ได้รับ
      // console.log('Received navId:', this.navId);
      if (this.navId == '/realtime1') {
        setTimeout(() => {
          const containerExists = document.getElementById('hexagon-container');

          if (containerExists) {
            this.createHexagon(this.hexagonsData);
            this.createHexagon2(this.hexagonsData2);
          } else {
            console.error('ไม่พบ container ที่มี id: hexagon-container');
          }
        }, 100); // รอให้ DOM อัพเดตเสร็จ
      }

    });
  }
  scaleD3: any;
  createHexagon(hexagonsData: { ID: number, freewayID: number, direction: string, kmStart: number, kmEnd: number, polygon: string, status: number }[]): void {
    const dynamicId = "hexagon-container";
    const container = d3.select(`#${dynamicId}`);

    if (container.empty()) {
      console.error(`ไม่พบ container ที่มี id: ${dynamicId}`);
      return;
    }

    let svg = container.select('svg');

    // ตรวจสอบและสร้าง SVG ถ้ายังไม่มี
    if (svg.empty()) {
      svg = container.append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .style('background-image', 'url(assets/img/m79.png)')
        .style('background-size', '100%')
        .style('background-position', 'top')
        .style('background-repeat', 'no-repeat');
    }

    const realWidth = 2443;
    const realHeight = 3390;

    const svgWidth = container.node().clientWidth;
    const svgHeight = container.node().clientHeight;

    if (svgWidth === 0 || svgHeight === 0) {
      console.error("ขนาดของ SVG ผิดพลาด (ความกว้างหรือความสูงเป็น 0)");
      return;
    }

    const scaleX = svgWidth / realWidth;
    const scaleY = svgHeight / realHeight;
    this.scaleD3 = Math.min(svgWidth / realWidth, svgHeight / realHeight);

    // วนลูปผ่านข้อมูลและสร้างหกเหลี่ยม
    hexagonsData.forEach(data => {
      const points = data.polygon.split(',').map((value, index) => {
        return index % 2 === 0 ? parseFloat(value) * scaleX : parseFloat(value) * scaleY; // ปรับตำแหน่งทั้ง X และ Y ตามสัดส่วน
      });

      const polygonPoints = points.join(' ');

      // กำหนดสีตาม status
      let fillColor;
      switch (data.status) {
        case 1:
          fillColor = '#4acd55';
          break;
        case 2:
          fillColor = '#fffa00';
          break;
        case 3:
          fillColor = '#f16000';
          break;
        case 4:
          fillColor = '#ff1d0c';
          break;
        default:
          fillColor = 'rgba(255, 0, 0, 0.5)'; // สีเริ่มต้นถ้าไม่มี status ที่กำหนด
      }

      svg.append('g')
        .append('polygon')
        .attr('points', polygonPoints)
        .attr('fill', fillColor)
        .attr('stroke', 'black')
        .attr('stroke-width', 0.2);
    });
  }

  resizeHexagon(dynamicId: string, hexagonsData: { ID: number, freewayID: number, direction: string, kmStart: number, kmEnd: number, polygon: string, status: number }[]): void {
    const svg = d3.select(`#${dynamicId} svg`);

    if (!svg.node()) {
      console.error("SVG ไม่ถูกสร้างหรือยังไม่ได้เพิ่มลงใน DOM");
      return;
    }

    const parentElement = svg.node().parentElement;
    if (!parentElement) {
      console.error("ไม่พบ parentElement ของ SVG");
      return;
    }

    const width = parentElement.clientWidth;
    const height = parentElement.clientHeight;

    if (width === 0 || height === 0) {
      console.error("ขนาดของ parentElement ผิดพลาด");
      return;
    }

    const realWidth = 2443;
    const realHeight = 3390;

    // ใช้ scale เดียวกันสำหรับทั้ง X และ Y โดยเลือกอัตราส่วนที่เล็กกว่า
    const scale = Math.min(width / realWidth, height / realHeight);

    svg.selectAll('polygon').remove(); // ลบหกเหลี่ยมเก่า

    // กำหนดค่า offset สำหรับการปรับตำแหน่ง
    const offsetX = (scale === this.scaleD3 && width < 810) ? 6 : (width > 810 ? 9 : 0); // ปรับค่าทางขวา
    const offsetY = (scale === this.scaleD3 && width < 810) ? 6 : (width > 810 ? 8 : 0); // ปรับค่าลงด้านล่าง
    // console.log(width)
    // วนลูปผ่านข้อมูลและสร้างหกเหลี่ยม
    hexagonsData.forEach(data => {
      const points = data.polygon.split(',').map((value, index) => {
        const adjustedValue = parseFloat(value) * scale;
        return index % 2 === 0 ? adjustedValue + offsetX : adjustedValue + offsetY; // เลื่อนทางขวาและลง
      });

      const polygonPoints = points.join(' ');

      // กำหนดสีตาม status
      let fillColor;
      switch (data.status) {
        case 1:
          fillColor = '#4acd55';
          break;
        case 2:
          fillColor = '#fffa00';
          break;
        case 3:
          fillColor = '#f16000';
          break;
        case 4:
          fillColor = '#ff1d0c';
          break;
        default:
          fillColor = 'rgba(255, 0, 0, 0.5)'; // สีเริ่มต้นถ้าไม่มี status ที่กำหนด
      }

      svg.append('g')
        .append('polygon')
        .attr('points', polygonPoints)
        .attr('fill', fillColor)
        .attr('stroke', 'black')
        .attr('stroke-width', 0.2);
    });
  }

  createHexagon2(hexagonsData: { ID: number, freewayID: number, direction: string, kmStart: number, kmEnd: number, polygon: string, status: number }[]): void {
    const dynamicId = "hexagon-container2";
    const container = d3.select(`#${dynamicId}`);

    if (container.empty()) {
      console.error(`ไม่พบ container ที่มี id: ${dynamicId}`);
      return;
    }

    let svg = container.select('svg');

    // ตรวจสอบและสร้าง SVG ถ้ายังไม่มี
    if (svg.empty()) {
      svg = container.append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .style('background-image', 'url(assets/img/m38.bmp)')
        .style('background-size', '100%')
        .style('background-position', 'top')
        .style('background-repeat', 'no-repeat');
    }

    const realWidth = 2443;
    const realHeight = 3390;

    const svgWidth = container.node().clientWidth;
    const svgHeight = container.node().clientHeight;

    if (svgWidth === 0 || svgHeight === 0) {
      console.error("ขนาดของ SVG ผิดพลาด (ความกว้างหรือความสูงเป็น 0)");
      return;
    }

    const scaleX = svgWidth / realWidth;
    const scaleY = svgHeight / realHeight;
    this.scaleD3 = Math.min(svgWidth / realWidth, svgHeight / realHeight);

    // วนลูปผ่านข้อมูลและสร้างหกเหลี่ยม
    hexagonsData.forEach(data => {
      const points = data.polygon.split(',').map((value, index) => {
        return index % 2 === 0 ? parseFloat(value) * scaleX : parseFloat(value) * scaleY; // ปรับตำแหน่งทั้ง X และ Y ตามสัดส่วน
      });

      const polygonPoints = points.join(' ');

      // กำหนดสีตาม status
      let fillColor;
      switch (data.status) {
        case 1:
          fillColor = '#4acd55';
          break;
        case 2:
          fillColor = '#fffa00';
          break;
        case 3:
          fillColor = '#f16000';
          break;
        case 4:
          fillColor = '#ff1d0c';
          break;
        default:
          fillColor = 'rgba(255, 0, 0, 0.5)'; // สีเริ่มต้นถ้าไม่มี status ที่กำหนด
      }

      svg.append('g')
        .append('polygon')
        .attr('points', polygonPoints)
        .attr('fill', fillColor)
        .attr('stroke', 'black')
        .attr('stroke-width', 0.2);
    });
  }


  // ตรวจจับการเปลี่ยนขนาดหน้าจอเพื่อปรับรูปหกเหลี่ยม
  @HostListener('window:resize', ['$event'])
  onResize() {
    const dynamicId = "hexagon-container";
    this.resizeHexagon(dynamicId, this.hexagonsData);
  }
  // handleNavigationClick(navId: string): void {
  //   // ทำสิ่งที่ต้องการที่นี่ เช่น การเปลี่ยนแปลง class หรืออัปเดตข้อมูลอื่นๆ
  //   console.log('Navigation clicked:', navId);
  // }

  onChangeModel(event) {
    // console.log(event)
    // this.selectedDeviceTypes = event.value.name;
    if (event.value.id == 0) {
      // this.showportgenerate = true;
    } else {
      // this.showportgenerate = false;
    }
    // console.log(this.selectedDeviceTypes)
  }



  alarm_marker_show: number = 0;
  alarm_marker_should_show: number = 0;
  device: number = 0;
  unsync_device: number = 0;
  options: any;
  overlays: any[];
  alarm_marker: any[];
  map: google.maps.Map;
  markerCluster: any;
  mapSubscription: Subscription;
  theme: string;
  map_center = {
    lat: 13.72672065693991,
    lng: 100.51438137260944
  };
  initOverlays() {
    this.options = {
      center: this.map_center,
      zoom: 10.2,
      streetViewControl: false,
      disableDefaultUI: true
    };
  }
  setMap(event) {
    this.map = event.map;
    let mapStyles = [];
    // console.log(this.themeValue);
    this.mapSubscription = this.themeService.getTheme().subscribe(newData => {
      this.theme = newData;
      let mapStyles = [];
      if (this.theme === "arya-orange") {
        // Define styles for arya-orange(dark)theme
        mapStyles = [
          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
          {
            elementType: "labels.text.stroke",
            stylers: [{ color: "#242f3e" }]
          },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }]
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }]
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3f" }]
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b9a76" }]
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }]
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }]
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }]
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#746855" }]
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }]
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3d19c" }]
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2f3948" }]
          },
          {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }]
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }]
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#17263c" }]
          }
        ];
      } else if (this.theme === "saga-orange") {
        // Define styles for saga-orange theme
      }
      this.map.setOptions({
        styles: mapStyles
      });
    });
    // console.log(mapStyles);
    this.markerCluster = new markerClusterer.MarkerClusterer({
      map: event.map,
      markers: this.alarm_marker
    });
    // console.log("Map styles set successfully");
    // console.log(this.map.setOptions);
    // this.alarmService.loadAlarmMakers().subscribe(datas => {
    //   this.set_cluster(datas);
    // });
    //markerCluster.clearMarkers();
  }

  set_cluster(markers: any) {
    if (markers.length > 0) {
      this.markerCluster.clearMarkers();
      let marker_show_temp = 0;
      let marker_should_show_temp = 0;
      let unsync = 0;
      let unique = [...new Set(markers.map(item => item.strIPAddress))];

      markers.forEach((marker, index) => {
        marker_should_show_temp++;
        if (!marker.SYMBOL_ID) {
          unsync++;
        } else if (marker.latitude && marker.longitude) {
          marker_show_temp++;
          // this.add_marker(marker);
        }
      });
      this.alarm_marker_show = marker_show_temp;
      this.alarm_marker_should_show = marker_should_show_temp;
      this.unsync_device = unsync;
      this.device = unique.length;
    }
  }

  // ฟังก์ชันสำหรับเรียก API
  getPolygonData(): void {


    const apiUrl = 'https://dss.motorway.go.th:4433/dnm/api/minsight/polygon/read';
    this.http.get<any>(apiUrl).subscribe(
      (data) => {
        console.log('Received data:', data);

        this.hexagonsData = data;
        this.createHexagon(this.hexagonsData); // สร้างหกเหลี่ยมจากข้อมูลที่ได้
        
      },
      (error) => {
        console.error('Error fetching polygon data:', error);
      }
    );

    this.http.get<any>('https://dss.motorway.go.th:4433/dnm/api/minsight/polygon2/read').subscribe(
      (data) => {
        console.log('Received data:', data);

        this.hexagonsData2 = data;
        this.createHexagon2(this.hexagonsData2); // สร้างหกเหลี่ยมจากข้อมูลที่ได้
      },
      (error) => {
        console.error('Error fetching polygon data:', error);
      }
    );
  }

}