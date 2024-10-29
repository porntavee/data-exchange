import { Component, OnInit, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { MapTopoService } from "@app/map-topology-service";
import { NavigateService } from "@app/navigateservice";
import { environment } from "environments/environment";
import { link } from "fs";
import { MenuItem, MessageService } from "primeng/api";
import { ContextMenu } from "primeng/contextmenu";
import { of } from "rxjs";
import { ThemeService } from "app/theme.service";
declare var google: any;

@Component({
  moduleId: module.id,
  selector: "maps-cmp",
  templateUrl: "maps.component.html"
})
export class MapsComponent implements OnInit {
  @ViewChild("cm") cm: ContextMenu;
  @ViewChild("cm2") cm2: ContextMenu;
  @ViewChild("cm3") cm3: ContextMenu;

  map_center = {
    lat: 13.72672065693991,
    lng: 100.51438137260944
  };

  marker_show: number;
  marker_should_show: number;

  action_Dialog: boolean;
  submitted: boolean;

  username: string;
  password: string;
  ip: string;
  action_result: string = "";
  options: any;

  overlays: any[];
  expandedList: any[] = [];
  collapseList: any[] = [];
  square: any[] = [];
  //TODO create global variable 1.Array for expanded marker 2.Array for square collecting marker

  //TODO create global variable 1.for Store ID when right click
  markerIDSelected: String;

  map: google.maps.Map;

  setMap(event) {
    this.map = event.map;
    this.map.setOptions({
      styles: [
        {
          featureType: "poi",
          stylers: [{ visibility: "off" }]
        },
        {
          featureType: "transit",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }]
        }
      ]
    });
  }

  defualt_marker_show: number;
  defualt_marker_should_show: number;
  defualt_overlays: any = [];
  breadcrumb_items: MenuItem[];
  home: MenuItem;
  link_Oninit: any[];
  linkExpand: any[];
  contextItems2: MenuItem[];
  contextItems3: MenuItem[];
  contextItems: MenuItem[];

  markerLs: any;
  markerL: any[] = [];
  constructor(
    private mapservice: MapTopoService,
    public themeService: ThemeService,
    private messageService: MessageService,
    private titleService: Title,
    private navigator: NavigateService,
    private router: Router
  ) {
    this.titleService.setTitle("SED-Topology Map");
  }

  ngOnInit() {
    this.themeService.currentpage("/maps");
    this.contextItems = [
      {
        label: "Collapse",
        icon: "pi pi-search-minus",
        command: event => {
          this.collapse();
          // this.reset_map();
          // this.navigator.navigateToDevice(this.marker_device_id);
        }
      }
    ];

    this.contextItems2 = [
      {
        label: "Expand",
        icon: "pi pi-search-plus",
        command: event => {
          this.expand();
          // this.navigator.navigateToDevice(this.marker_device_id);
        }
      }
    ];
    this.contextItems3 = [
      {
        label: "Expand",
        icon: "pi pi-search-plus",
        command: event => {
          this.expand();
          // this.navigator.navigateToDevice(this.marker_device_id);
        }
      },
      {
        label: "Collapse",
        icon: "pi pi-search-minus",
        command: event => {
          this.collapse();
          // this.reset_map();
          // this.navigator.navigateToDevice(this.marker_device_id);
        }
      }
    ];

    this.Oninitmap();

    this.home = {
      icon: "pi pi-home",
      label: " Network Topo",
      command: event => {
        this.reset_map();
      }
    };

    this.initOverlays();
    if (this.navigator.isNavigate == true) {
      var tree_parent_topo = this.navigator.passingData.symbol_id;
      var map_center = this.navigator.passingData.center;
      this.navigator.isNavigate = false;
    } else {
      tree_parent_topo = 0;
      map_center = { lat: 13.7284038, lng: 100.5160613 };
    }
    this.options = {
      center: map_center,
      zoom: 10.2,
      streetViewControl: false,
      mapTypeControl: false
    };

    this.contextItems = [
      {
        label: "Collapse",
        icon: "pi pi-search-minus",
        command: event => {
          this.collapse();
          // this.navigator.navigateToDevice(this.marker_device_id);
        }
      }
    ];

    this.contextItems2 = [
      {
        label: "Expand",
        icon: "pi pi-search-plus",
        command: event => {
          this.expand();
          // this.navigator.navigateToDevice(this.marker_device_id);
        }
      }
    ];
    this.contextItems3 = [
      {
        label: "Expand",
        icon: "pi pi-search-plus",
        command: event => {
          this.expand();
          // this.navigator.navigateToDevice(this.marker_device_id);
        }
      },
      {
        label: "Short",
        icon: "pi pi-search-minus",
        command: event => {
          this.collapse();
          // this.navigator.navigateToDevice(this.marker_device_id);
        }
      }
    ];
  }

  initOverlays() {
    if (!this.overlays || !this.overlays.length) {
      this.overlays = this.defualt_overlays.slice();
    }
  }
  Oninitmap() {
    this.breadcrumb_items = [];
    if (this.navigator.isNavigate == true) {
      var tree_parent_topo = this.navigator.passingData.symbol_id;
      var map_center = this.navigator.passingData.center;
      this.navigator.isNavigate = false;
    } else {
      tree_parent_topo = 0;
      map_center = { lat: 13.7284038, lng: 100.5160613 };
    }
    this.mapservice.get_marker_information(tree_parent_topo).subscribe({
      next: markers => {
        let marker_show_temp = 0;
        let marker_should_show_temp = 0;
        markers.forEach(marker => {
          marker_should_show_temp++;
          if (marker.IS_VISIBLE && marker.latitude && marker.longitude) {
            marker_show_temp++;
            let overlay_temp = new google.maps.Marker({
              position: { lat: marker.latitude, lng: marker.longitude },
              title: marker.title,
              icon: marker.icon_path
                ? this.mapservice.icon_path + marker.icon_path
                : this.mapservice.defualt_icon_path,
              id: marker.SYMBOL_ID,
              data: { type: marker.RES_TYPE_NAME, device_id: marker.RES_ID }
            });

            //TODO add right click maker Listener

            overlay_temp.addListener("contextmenu", e => {
              this.markerIDSelected = marker.SYMBOL_ID;
              this.cm2.show(e.domEvent);
            });

            this.defualt_overlays.push(overlay_temp);
          }
        });
        this.mapservice.get_link_information(tree_parent_topo).then(links => {
          this.link_Oninit = links;
          links.forEach(link => {
            let overlay_temp = new google.maps.Polyline({
              path: [
                { lat: link.latitude_1, lng: link.longitude_1 },
                { lat: link.latitude_2, lng: link.longitude_2 }
              ],
              geodesic: true,
              strokeColor: "#7CFC00",
              strokeOpacity: 1,
              strokeWeight: 5,
              link_id: link.LINK_SYMBOL_ID
            });
            this.defualt_overlays.push(overlay_temp);
          });
          this.initOverlays();
        });

        this.marker_show = marker_show_temp;
        this.defualt_marker_show = marker_show_temp;
        this.defualt_marker_should_show = marker_should_show_temp;
        this.marker_should_show = marker_should_show_temp;
      },
      error: error => {
        if (error.status == 401) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Session expired, please logout and login again."
          });
        }
      }
    });
  }
  handleOverlayClick(event) {
    let isMarker = event.overlay.getTitle != undefined;
    //console.log(isMarker);
    if (isMarker) {
      event.map.setCenter(event.overlay.getPosition());
      if (event.overlay.data.type == "NE") {
        this.router.navigate(["/device"], {
          queryParams: { ID: event.overlay.data.device_id }
        });
        this.themeService.currentpage("/device");
      } else {
        this.mapservice
          .get_marker_information(event.overlay.id)
          .subscribe(makers => {
            console.log(event.overlay.getPosition());
            if (makers.length > 0) {
              this.add_breadcrumb_item({
                id: event.overlay.id,
                center: event.overlay.getPosition(),
                label: event.overlay.getTitle(),
                command: event => {
                  //console.log("test");
                  this.breadcrumb_click(event);
                }
              });
              this.mapservice
                .get_link_information(event.overlay.id)
                .then(links => {
                  this.link_Oninit = links;
                  this.set_ovrelay(makers, links);

                  //console.log("link1:" + JSON.stringify(links));
                });
              // this.mapservice.get_link_information(event.overlay.id).then(links => this.set_ovrelay(makers, links) this.link_Oninit)
            } else {
            }
          });
      }
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Shape Selected",
        detail: ""
      });
    }
  }

  hideDialog() {
    this.action_Dialog = false;
    this.submitted = false;
    this.action_result = "";
  }

  openDailog() {
    this.submitted = false;
    this.action_Dialog = true;
  }

  get_cpu_load() {
    this.submitted = true;
    this.mapservice
      .get_CPU_Load(this.ip, this.username, this.password)
      .then(Object => {
        this.action_result = Object.result;
        this.submitted = false;
      });
  }

  get_memory() {
    this.submitted = true;
    this.mapservice
      .get_Memory(this.ip, this.username, this.password)
      .then(Object => {
        this.action_result = Object.result;
        this.submitted = false;
      });
  }

  async area_expand(marker_overlay) {
    let marker_id = marker_overlay.id;
    let overlays_from_service = await this.mapservice.get_marker_information(
      marker_id
    );
    //this.markers_expand_handler
    //this.add_breadcrumb_item({label:"Cat Tower"});
    overlays_from_service.forEach(element => {
      this.overlays.push(element);
    });
  }

  area_collapse(area_overlay) {
    let area_id = area_overlay.area_id;
    if (area_id) {
      let marker_ids = area_overlay.marker_ids;
      let index1 = this.overlays
        .map(e => {
          return e.area_id;
        })
        .indexOf(area_id);
      if (index1 > -1) {
        this.overlays.splice(index1, 1);
      }
      marker_ids.forEach(element => {
        let index2 = this.overlays
          .map(e => {
            return e.id;
          })
          .indexOf(element);
        if (index2 > -1) {
          this.overlays.splice(index2, 1);
        }
      });
    }
  }

  reset_map() {
    this.breadcrumb_items = [];
    this.overlays = [];
    var tree_parent_topo = 0;
    var map_center = { lat: 13.7284038, lng: 100.5160613 };
    this.map.setCenter(map_center);
    this.mapservice.get_marker_information(tree_parent_topo).subscribe({
      next: markers => {
        let marker_show_temp = 0;
        let marker_should_show_temp = 0;
        markers.forEach(marker => {
          marker_should_show_temp++;
          if (marker.IS_VISIBLE && marker.latitude && marker.longitude) {
            marker_show_temp++;
            let overlay_temp = new google.maps.Marker({
              position: { lat: marker.latitude, lng: marker.longitude },
              title: marker.title,
              icon: marker.icon_path
                ? this.mapservice.icon_path + marker.icon_path
                : this.mapservice.defualt_icon_path,
              id: marker.SYMBOL_ID,
              data: { type: marker.RES_TYPE_NAME, device_id: marker.RES_ID }
            });

            //TODO add right click maker Listener

            overlay_temp.addListener("contextmenu", e => {
              this.markerIDSelected = marker.SYMBOL_ID;
              this.cm2.show(e.domEvent);
            });
            this.overlays.push(overlay_temp);
          }
        });
        this.mapservice.get_link_information(tree_parent_topo).then(links => {
          this.link_Oninit = links;
          links.forEach(link => {
            let overlay_temp = new google.maps.Polyline({
              path: [
                { lat: link.latitude_1, lng: link.longitude_1 },
                { lat: link.latitude_2, lng: link.longitude_2 }
              ],
              geodesic: true,
              strokeColor: "#7CFC00",
              strokeOpacity: 1,
              strokeWeight: 5,
              link_id: link.LINK_SYMBOL_ID
            });
            this.overlays.push(overlay_temp);
          });
          this.initOverlays();
        });
        this.marker_show = marker_show_temp;
        this.defualt_marker_show = marker_show_temp;
        this.defualt_marker_should_show = marker_should_show_temp;
        this.marker_should_show = marker_should_show_temp;
      },
      error: error => {
        if (error.status == 401) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Session expired, please logout and login again."
          });
        }
      }
    });
  }

  add_breadcrumb_item(item: object) {
    this.breadcrumb_items = [...this.breadcrumb_items, item];
  }

  async breadcrumb_click(event) {
    this.map.setCenter(event.item.center);
    let id = event.item.id;
    let index = this.breadcrumb_items
      .map(e => {
        return e.id;
      })
      .indexOf(id);
    this.breadcrumb_items.length = index + 1;

    this.mapservice.get_marker_information(id).subscribe(makers => {
      let links = this.mapservice.get_link_information(id);
      this.set_ovrelay(makers, links);
    });
  }

  set_ovrelay(markers: any, links: any) {
    if (markers.length > 0) {
      this.overlays = [];
      let marker_show_temp = 0;
      let marker_should_show_temp = 0;
      markers.forEach(marker => {
        marker_should_show_temp++;
        if (marker.IS_VISIBLE && marker.latitude && marker.longitude)
          marker_show_temp++;
        this.add_marker(marker);
      });
      links.forEach(link => {
        this.add_line(link);
      });
      this.marker_show = marker_show_temp;
      this.marker_should_show = marker_should_show_temp;
    }
  }

  add_marker(marker: any) {
    let overlay_temp = new google.maps.Marker({
      position: { lat: marker.latitude, lng: marker.longitude },
      title: marker.title,
      icon: marker.icon_path
        ? this.mapservice.icon_path + marker.icon_path
        : this.mapservice.defualt_icon_path,
      id: marker.SYMBOL_ID,
      data: { type: marker.RES_TYPE_NAME, device_id: marker.RES_ID }
    });

    overlay_temp.addListener("contextmenu", e => {
      this.markerIDSelected = marker.SYMBOL_ID;
      this.cm2.show(e.domEvent);
    });
    this.overlays.push(overlay_temp);
  }

  add_line(polyline: any) {
    let overlay_temp = new google.maps.Polyline({
      path: [
        { lat: polyline.latitude_1, lng: polyline.longitude_1 },
        { lat: polyline.latitude_2, lng: polyline.longitude_2 }
      ],
      geodesic: true,
      strokeColor: "#7CFC00",
      strokeOpacity: 1,
      strokeWeight: 5,
      link_id: polyline.LINK_SYMBOL_ID
    });
    this.overlays.push(overlay_temp);
    this.expandedList.push(overlay_temp);
  }

  //-----------------vlan-----------------
  vlan: string;
  vlan_name: string[];

  isVlanLoading: boolean = false;

  searchVlan(event) {
    // if(!this.vlan || this.vlan==""){
    //     alert("โปรดใส่ vlan");
    // }

    this.isVlanLoading = true;

    this.mapservice
      .vlan_search(this.vlan, this.vlan_name)
      .subscribe(results => {
        var output = [];

        results.forEach(function(item) {
          var existing = output.filter(function(v, i) {
            return v.RES_ID == item.RES_ID;
          });
          if (existing.length) {
            var existingIndex = output.indexOf(existing[0]);
            let data = {
              vlan: item.vlan,
              vlan_name: item.vlan_name,
              port: item.port
            };
            output[existingIndex].data = output[existingIndex].data.concat(
              data
            );
          } else {
            let array_item = {
              RES_ID: item.RES_ID,
              SYMBOL_ID: item.SYMBOL_ID,
              SYMBOL_NAME3: item.SYMBOL_NAME3,
              latitude: item.latitude,
              longitude: item.longitude,
              icon_path: item.icon_path,
              data: [
                {
                  port: item.port,
                  vlan: item.vlan,
                  vlan_name: item.vlan_name
                }
              ]
            };
            output.push(array_item);
          }
        });

        console.dir(output);
        this.overlays = [];
        output.forEach(result => {
          let vlan_data = "";
          let device_name = result.SYMBOL_NAME1 ? result.SYMBOL_NAME1 : "";
          result.data.forEach(data => {
            vlan_data += `<tr>
                                    <td style="padding-right: 10px;">${data.vlan}</td>
                                    <td style="padding-right: 10px;">${data.port}</td>
                                    <td style="padding-right: 5px;">${data.vlan_name}</td>
                                 </tr>`;
          });
          const contentString = ` <p class="m-0">Name: ${device_name}</p>
                    <p class="m-0">IP: ${result.SYMBOL_NAME3}</p>
                    <a href="${environment.rountURL}#/device?ID=${result.RES_ID}">Device detial</a>
                    <table>
                         <tr>
                            <th>VLAN</th>
                            <th>Port</th>
                            <th>VLAN Name</th>
                         </tr>
                        ${vlan_data}
                    </table>`;

          const infowindow = new google.maps.InfoWindow({
            content: contentString
          });

          const marker = new google.maps.Marker({
            position: { lat: result.latitude, lng: result.longitude },
            title: result.SUMBOL_NAME3,
            icon: result.icon_path
              ? this.mapservice.icon_path + result.icon_path
              : this.mapservice.defualt_icon_path,
            id: result.SYMBOL_ID,
            data: {
              res_id: result.RES_ID,
              vlan: result.vlan,
              vlna_acces: result.data
            }
          });

          marker.addListener("click", () => {
            infowindow.open({
              anchor: marker,
              //map: this.map,
              shouldFocus: false
            });
          });

          this.overlays.push(marker);
        });
        this.isVlanLoading = false;
      });
    setTimeout(() => {
      this.isVlanLoading = false;
    }, 5000);
  }

  expand() {
    this.mapservice
      .get_marker_information(this.markerIDSelected)
      .subscribe(markers => {
        if (markers.length > 0) {
          this.markerLs = markers;
          this.expandedList.push(
            this.overlays.filter(data => data.id == this.markerIDSelected)[0]
          );
          var overlays = this.overlays.filter(
            data => data.id != this.markerIDSelected
          );
          var over = this.link_Oninit.filter(
            data => data.src_symbol_id == this.markerIDSelected
          );
          var over1 = this.link_Oninit.filter(
            data => data.DEST_SYMBOL_ID == this.markerIDSelected
          );

          if (over.length == 0) {
            if (over1.length != 0) {
              this.overlays = overlays.filter(
                data => data.link_id != over1[0].RES_ID
              );
              this.expandedList.push(
                overlays.filter(data => data.link_id == over1[0].RES_ID)[0]
              );
            } else {
              this.overlays = overlays;
            }
          } else {
            this.overlays = overlays.filter(
              data => data.link_id != over[0].RES_ID
            );
            this.expandedList.push(
              overlays.filter(data => data.link_id == over[0].RES_ID)[0]
            );
          }
          let polygon = this.callulateSquareToGooglePolygon(markers);
          var markerID = [];

          markers.forEach(marker => {
            var list = {
              id: this.markerIDSelected,
              marker: marker
            };
            this.markerL.push(list);
            this.add_marker(marker);
            markerID.push(marker.SYMBOL_ID);
          });
          var squareTemp = {
            id: this.markerIDSelected,
            squareObject: polygon,
            contMarker: markerID
          };
          this.square.push(squareTemp);
          this.overlays.push(polygon);
        } else {
        }
      });
  }

  collapse() {
    var linkCollape = this.link_Oninit.find(
      data =>
        data.src_symbol_id == this.markerIDSelected ||
        data.DEST_SYMBOL_ID == this.markerIDSelected
    );
    let expandedMarkerParent = this.expandedList.filter(
      data => data.id == this.markerIDSelected
    );
    let expandedlineParent = this.expandedList.filter(
      data => data.link_id == linkCollape.LINK_SYMBOL_ID
    );
    this.overlays = this.overlays.filter(
      data => data.link_id != this.markerIDSelected
    );

    this.expandedList = this.expandedList.filter(
      data =>
        data.id != this.markerIDSelected &&
        data.link_id != linkCollape.LINK_SYMBOL_ID
    );

    this.mapservice
      .get_marker_information(this.markerIDSelected)
      .subscribe(markers => {
        markers.forEach(marker => {
          let overL = this.expandedList.filter(
            data => data.id == marker.SYMBOL_ID
          );

          if (overL.length != 0) {
            this.expandedList = this.expandedList.filter(
              data => data.id != overL[0].id
            );
            var findX = this.markerL.filter(
              data => data.id == this.markerIDSelected
            );
            var findList = this.markerL.filter(
              data => data.id !== this.markerIDSelected
            );
            let findXMap = findX.map(data => data["marker"]);
            findXMap.forEach(maker => {
              var findXs = findList.filter(data => data.id == maker.SYMBOL_ID);
              let findXsMap = findXs.map(data => data["marker"]);
              findXsMap.forEach(maker => {
                var index = this.expandedList.findIndex(
                  data => data.link_id == marker.SYMBOL_ID
                );

                var markerList = this.overlays.filter(
                  data =>
                    data.id != maker.SYMBOL_ID &&
                    data.link_id != this.expandedList[index].link_id
                );
                this.overlays = markerList;
              });
            });
          }
        });
      });

    let markerInSquare = this.square.filter(
      data => data.id == this.markerIDSelected
    );
    let markerIDInSquare = markerInSquare.map(data => data["contMarker"]);

    this.square = this.square.filter(data => data.id != this.markerIDSelected);

    this.overlays = this.overlays.filter(
      data =>
        data.id != this.markerIDSelected &&
        !markerIDInSquare[0].includes(data.id)
    );

    let returnEpandedMarker = expandedMarkerParent[0];
    let returnEpandedLine = expandedlineParent[0];
    let IDSelectedtemp = this.markerIDSelected;
    returnEpandedMarker.addListener("contextmenu", e => {
      this.markerIDSelected = IDSelectedtemp;
      this.cm2.show(e.domEvent);
    });

    this.overlays.push(returnEpandedMarker);
    this.overlays.push(returnEpandedLine);
  }

  callulateSquareToGooglePolygon(contMarker: any[]) {
    var maxvalue = contMarker.filter(data => data.latitude != null);
    let maxLat = Math.max(...maxvalue.map(o => o.latitude));
    var minvalue = contMarker.filter(data => data.latitude != null);
    let minLat = Math.min(...minvalue.map(o => o.latitude));
    var maxvaluelng = contMarker.filter(data => data.longitude != null);
    let maxLng = Math.max(...maxvaluelng.map(o => o.longitude));
    var minvaluelng = contMarker.filter(data => data.longitude != null);
    let minLng = Math.min(...minvaluelng.map(o => o.longitude));
    var avglat = (maxLat + 0.05 + (minLat - 0.01)) / 2;
    var avglng = (maxLng + 0.05 + (minLng - 0.05)) / 2;
    this.mapservice.get_link_information(this.markerIDSelected).then(links => {
      this.linkExpand = links;
      if (this.linkExpand.length == 0) {
        this.linkExpand = [
          {
            latitude_1: avglat,
            latitude_2: 13.72672065693991,
            longitude_1: avglng,
            longitude_2: 100.5164295,
            LINK_SYMBOL_ID: this.markerIDSelected
          }
        ];

        this.linkExpand.forEach(link => {
          this.add_line(link);
        });
      }
    });
    let polygon = new google.maps.Polygon({
      paths: [
        { lat: maxLat + 0.05, lng: minLng - 0.05 },
        { lat: maxLat + 0.05, lng: maxLng + 0.05 },
        { lat: minLat - 0.01, lng: maxLng + 0.05 },
        { lat: minLat - 0.01, lng: minLng - 0.05 }
      ],
      fillColor: "#FFFFFF",
      fillOpacity: 0.1,
      strokeOpacity: 0.8,
      strokeWeight: 1,
      id: this.markerIDSelected
    });

    let IDSelectedtemp = this.markerIDSelected;

    polygon.addListener("contextmenu", e => {
      this.markerIDSelected = IDSelectedtemp;
      this.cm.show(e.domEvent);
    });

    return polygon;
  }
}
