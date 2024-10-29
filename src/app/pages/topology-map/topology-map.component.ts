import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { NavigateService } from "app/navigateservice";
import { TopoService } from "app/topology-service";
import { ThroughputService } from "app/throughput.service";
import { environment } from "environments/environment";
import jwt_decode from "jwt-decode";
import { TreeNode, MenuItem, MessageService } from "primeng/api";
import { ContextMenu } from "primeng/contextmenu";
import { Router } from "@angular/router";
import { data, event } from "jquery";
import { AdminLayoutService } from "@app/layouts/admin-layout/admin-layout.service";
import { Subscription, from } from "rxjs";
import { ThemeService } from "app/theme.service";
import { Tree } from "primeng/tree";
declare var google: any;

interface position {
  X1: number;
  Y1: number;
  RES_ID: number;
}

export interface locationInfo {
  symbol_id: string;
  latitude: number;
  longitude: number;
  icon: number;
  topo_icon: string;
}

@Component({
  selector: "app-topology-map",
  templateUrl: "./topology-map.component.html",
  styleUrls: ["./topology-map.component.scss"]
})
export class TopologyMapComponent implements OnInit {
  @ViewChild(Tree) tree: Tree;
  @ViewChild("cm") cm: ContextMenu;
  @ViewChild("cm2") cm2: ContextMenu;
  @ViewChild("cm3") cm3: ContextMenu;
  @ViewChild("cm4") cm4: ContextMenu;
  @ViewChild("cm5") cm5: ContextMenu;
  @ViewChild("topologyIcon") topologyIcon: ElementRef;
  @ViewChild("container", { static: false }) containerRef!: ElementRef;
  @ViewChild("canvasEl", { static: false }) canvasEl!: ElementRef;
  private context: CanvasRenderingContext2D; //canvas

  map_center = {
    lat: 13.72672065693991,
    lng: 100.51438137260944
  };

  positions: position[];

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
  stateOptions: any[];
  markerIDSelected: String;
  markerIPSelected: any;
  markerRESSelected: any;
  markertypeSelected: any;
  map: google.maps.Map;
  ngAfterViewInit() {
    // Access the nativeElement of the ViewChild references
    const container = this.containerRef.nativeElement;
    const canvas = this.canvasEl.nativeElement;

    // Set styles to make the canvas larger than the container
    this.renderer.addClass(container, "fullwidth");
    this.renderer.setStyle(container, "max-width", "1200px"); // Set maximum width

    // Set styles for the canvas
    this.renderer.setStyle(canvas, "width", "2048px");
    this.renderer.setStyle(canvas, "height", "2048px");
  }

  setMap(event) {
    this.map = event.map;
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
  }

  defualt_marker_show: number;
  defualt_marker_should_show: number;
  defualt_overlays: any = [];
  breadcrumb_items: MenuItem[] = [];
  home: MenuItem;
  link_Oninit: any[];
  linkExpand: any[];
  linkExpands: any[];
  contextItems2: MenuItem[];
  contextItems4: MenuItem[];
  contextItems3: MenuItem[];
  contextItems: MenuItem[];
  nodesub: any[] = [];
  markerLs: any;
  markerL: any[] = [];
  topology: TreeNode[];
  topology_staging: TreeNode[];
  topologys: TreeNode = {};
  loading: boolean;
  selectedNode: TreeNode;
  arr: any[];
  color0: boolean;
  parent: any = [];
  parentRcview: any = [];
  color1: boolean;
  load_data: boolean;
  valueID: any;
  baseURL = environment.apiUrl;
  img: any;
  focusOnMap: boolean = true;
  focusOnPanel: boolean = false;
  toggle: boolean;
  panelToggle: boolean;
  value1: string = "Map";
  canvas_width = 2048;
  canvas_height = 2048;
  images: any[] = [];
  images2: any[] = [];
  images3: any[] = [];
  startX: any;
  startY: any;
  current_shape_index: any = null;
  current_shape: any = undefined;
  index_list: any;
  marker: any[];
  canvas: any;
  is_dragging: boolean = false;
  mouseX: any;
  mouseY: any;
  indexs: any;
  newCursor: any;
  listexpand: any[];
  listexpands: any[];
  IDexpand: any[] = [];
  Nameexpand: any;
  TypeTopo: any[];
  ircType: any[];
  listimg: any[] = [];
  listimgfind: any[] = [];
  listimgfind2: any[] = [];
  eventclick: any;
  filteredArr: any[];
  arrlist: any[] = [];
  eventL: any;
  linkData: any;
  linkData_rc: any;
  newVariable: any[] = [];
  nodeData: any;
  nodeData_rc: any;
  classMap: string = "map-show";
  theme: string; // Replace with your data type
  mapSubscription: Subscription;
  canvasSubscription: Subscription;
  mainTree: any[] = [];

  constructor(
    private toposervice: TopoService,
    private router: Router,
    private titleService: Title,
    private navigator: NavigateService,
    private messageService: MessageService,
    private throughputService: ThroughputService,
    private AdminLayoutService: AdminLayoutService,
    private cdr: ChangeDetectorRef,
    public themeService: ThemeService,
    private renderer: Renderer2
  ) {
    this.stateOptions = [
      { label: "Map", value: "Map" },
      { label: "Panel", value: "Panel" }
    ];

    this.titleService.setTitle("SED -Topology");
  }
  firsttimeload: boolean = false;

  ngOnInit(): void {
    this.img = new Image(5, 5);
    this.topology = [];
    this.topology_staging = [];
    this.loading = true;
    this.contextItems = [];
    this.load_data = true;
    this.toposervice.getFilesMain().subscribe(files => {
      this.initTopologyMain(files.data);
    });
    // this.toposervice.getNoicon();
    this.fetchNodeWithLink(0, "Nview");

    this.home = {
      icon: "pi pi-home",
      label: " Network Topo",
      command: event => {
        this.collapseAll();
      }
    };

    this.initOverlays();
    if (this.navigator.isNavigate == true) {
      var tree_parent_topo = this.navigator.passingData.symbol_id;
      var map_center = this.navigator.passingData.center;
      this.navigator.isNavigate = false;
    } else {
      tree_parent_topo = 0;
      map_center = { lat: 13.72672065693991, lng: 100.51438137260944 };
    }
    this.options = {
      center: map_center,
      zoom: 9.8,
      streetViewControl: false,
      mapTypeControl: false
    };

    this.contextItems = [
      {
        label: "Collapse",
        icon: "pi pi-search-minus",
        command: event => {
          this.collapseAll();
        }
      }
    ];

    this.contextItems2 = [
      {
        label: "View Device",
        icon: "pi pi-search",
        command: event => {
          this.linktodevice();
        }
      }
    ];

    this.contextItems3 = [
      {
        label: "Expand",
        icon: "pi pi-search-plus",
        command: event => {
          this.expand();
        }
      },
      {
        label: "Short",
        icon: "pi pi-search-minus",
        command: event => {
          this.collapse();
        }
      }
    ];
  }
  linktodevice() {
    this.openInNewTab(
      this.router,
      "/device",
      this.markerRESSelected,
      this.markertypeSelected,
      this.markerIPSelected
    );
  }
  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.mapSubscription.unsubscribe();
  }
  parentClick: any;

  transformedLink(link) {
    const duplicateTracker = {};
    const duplicates = link.reduce((result, obj) => {
      const destSymbol = obj["DEST_SYMBOL_ID"];
      const srcSymbol = obj["src_symbol_id"];
      const key = destSymbol + "-" + srcSymbol;
      if (!duplicateTracker[key]) {
        duplicateTracker[key] = 1;
      } else {
        if (duplicateTracker[key] === 1) {
          result.push(key);
        }
        duplicateTracker[key]++;
      }
      return result;
    }, []);

    // console.log(link);
    const result = link.map(l => {
      return {
        x1: l.X1,
        y1: l.Y1,
        x2: l.X2,
        y2: l.Y2,
        isDoubleLine: duplicates.includes(
          l.DEST_SYMBOL_ID + "-" + l.src_symbol_id
        ),
        NEW_CRITICAL_ALARM_COUNT:l.NEW_CRITICAL_ALARM_COUNT,
        NEW_MAJOR_ALARM_COUNT:l.NEW_MAJOR_ALARM_COUNT,
        DEST_SYMBOL_ID:l.DEST_SYMBOL_ID,
        LINK_SYMBOL_ID:l.LINK_SYMBOL_ID,
        RES_ID:l.RES_ID
      };
    });
    const uniqueResult = [];
    for (let index = 0; index < result.length; index++) {
      if (
        !uniqueResult.some(
          j =>
            j.x1 === result[index].x1 &&
            j.x2 === result[index].x2 &&
            j.y1 === result[index].y1 &&
            j.y2 === result[index].y2
        )
      ) {
        uniqueResult.push(result[index]);
      }
    }

    // console.log(uniqueResult);
    return uniqueResult;

    // link = link.filter((o, index, array) => {
    //   const isDuplicate = array.some((obj, otherIndex) => {
    //     if (otherIndex !== index) {
    //       return (
    //         o.x1 === obj.x2 &&
    //         o.y1 === obj.y2 &&
    //         o.x2 === obj.x1 &&
    //         o.y2 === obj.y1
    //       );
    //     }
    //     return false;
    //   });
    //   return !isDuplicate;
    // });
  }

  fetchNodeWithLink(id, event) {
    if (this.firsttimeload == false) {
      this.toposervice.get_topo_information(id).subscribe({
        next: nodes => {
          const transformmedLink = this.transformedLink(nodes.link);
          const transformmedRCLink = this.transformedLink(nodes.rc_link);
          this.firsttimeload = true;
          if (event) {
            if (event == "Nview") {
              this.setOverlay(nodes.node, nodes.link, "Nview");
              const node = nodes.node;
              this.load_data = false;
              this.marker = nodes;
              this.linkData = transformmedLink;
              this.nodeData = node.map(n => {
                this.icontopo(n);
                const icon = this.iconMarker;
                return {
                  xPosition: n.X,
                  yPosition: n.Y,
                  canvasName: n.SYMBOL_NAME1,
                  canvasIcon: icon,
                  imgSrc: icon,
                  canvasID: n.SYMBOL_ID,
                  typeTopo: n.REAL_RES_TYPE_NAME,
                  ircType: n.ircType
                };
              });
              this.drawAfterFetch(this.marker, event);
              this.loading = false;
            } else if (event == "RCview") {
              this.setOverlay(nodes.rc_node, nodes.rc_link, "RCview");
              const node = nodes.rc_node;
              this.load_data = false;
              this.marker = nodes;
              this.linkData_rc = transformmedRCLink;
              this.nodeData_rc = node.map(n => {
                this.icontopo(n);
                const icon = this.iconMarker;
                return {
                  xPosition: n.X,
                  yPosition: n.Y,
                  canvasName: n.SYMBOL_NAME1,
                  canvasIcon: icon,
                  imgSrc: icon,
                  canvasID: n.SYMBOL_ID,
                  typeTopo: n.REAL_RES_TYPE_NAME,
                  ircType: n.ircType
                };
              });
              this.drawAfterFetch(this.marker, event);
              this.loading = false;
            } else {
              if (this.parentClick == "Nview") {
                this.setOverlay(nodes.node, nodes.link, "Nview");
                const node = nodes.node;
                this.load_data = false;
                this.marker = nodes;
                this.linkData = transformmedLink;
                this.nodeData = node.map(n => {
                  this.icontopo(n);
                  const icon = this.iconMarker;
                  return {
                    xPosition: n.X,
                    yPosition: n.Y,
                    canvasName: n.SYMBOL_NAME1,
                    canvasIcon: icon,
                    imgSrc: icon,
                    canvasID: n.SYMBOL_ID,
                    typeTopo: n.REAL_RES_TYPE_NAME,
                    ircType: n.ircType
                  };
                });
                this.drawAfterFetch(this.marker, event);
                this.loading = false;
              } else if (this.parentClick == "RCview") {
                this.setOverlay(nodes.rc_node, nodes.rc_link, "RCview");
                const node = nodes.rc_node;
                this.load_data = false;
                this.marker = nodes;
                this.linkData_rc = transformmedRCLink;
                this.nodeData_rc = node.map(n => {
                  this.icontopo(n);
                  const icon = this.iconMarker;
                  return {
                    xPosition: n.X,
                    yPosition: n.Y,
                    canvasName: n.SYMBOL_NAME1,
                    canvasIcon: icon,
                    imgSrc: icon,
                    canvasID: n.SYMBOL_ID,
                    typeTopo: n.REAL_RES_TYPE_NAME,
                    ircType: n.ircType
                  };
                });
                this.drawAfterFetch(this.marker, event);
                this.loading = false;
              }
            }
          } else {
            if (event == "Nview") {
              this.setOverlay(nodes.node, nodes.link, "Nview");
              const node = nodes.node;
              this.load_data = false;
              this.marker = nodes;
              this.linkData = transformmedLink;
              this.nodeData = node.map(n => {
                this.icontopo(n);
                const icon = this.iconMarker;
                return {
                  xPosition: n.X,
                  yPosition: n.Y,
                  canvasName: n.SYMBOL_NAME1,
                  canvasIcon: icon,
                  imgSrc: icon,
                  canvasID: n.SYMBOL_ID,
                  typeTopo: n.REAL_RES_TYPE_NAME,
                  ircType: n.ircType
                };
              });
              this.drawAfterFetch(this.marker, event);
              this.loading = false;
            } else if (event == "RCview") {
              this.setOverlay(nodes.rc_node, nodes.rc_link, "RCview");
              const node = nodes.rc_node;
              this.load_data = false;
              this.marker = nodes;
              this.linkData_rc = transformmedLink;
              this.nodeData_rc = node.map(n => {
                this.icontopo(n);
                const icon = this.iconMarker;
                return {
                  xPosition: n.X,
                  yPosition: n.Y,
                  canvasName: n.SYMBOL_NAME1,
                  canvasIcon: icon,
                  imgSrc: icon,
                  canvasID: n.SYMBOL_ID,
                  typeTopo: n.REAL_RES_TYPE_NAME,
                  ircType: n.ircType
                };
              });
              this.drawAfterFetch(this.marker, event);
              this.loading = false;
            } else {
              if (this.parentClick == "Nview") {
                this.setOverlay(nodes.node, nodes.link, "Nview");
                const node = nodes.node;
                this.load_data = false;
                this.marker = nodes;
                this.linkData = transformmedLink;
                this.nodeData = node.map(n => {
                  this.icontopo(n);
                  const icon = this.iconMarker;
                  return {
                    xPosition: n.X,
                    yPosition: n.Y,
                    canvasName: n.SYMBOL_NAME1,
                    canvasIcon: icon,
                    imgSrc: icon,
                    canvasID: n.SYMBOL_ID,
                    typeTopo: n.REAL_RES_TYPE_NAME,
                    ircType: n.ircType
                  };
                });
                this.drawAfterFetch(this.marker, event);
                this.loading = false;
              } else if (this.parentClick == "RCview") {
                this.setOverlay(nodes.rc_node, nodes.rc_link, "RCview");
                const node = nodes.rc_node;
                this.load_data = false;
                this.marker = nodes;
                this.linkData_rc = transformmedLink;
                this.nodeData_rc = node.map(n => {
                  this.icontopo(n);
                  const icon = this.iconMarker;
                  return {
                    xPosition: n.X,
                    yPosition: n.Y,
                    canvasName: n.SYMBOL_NAME1,
                    canvasIcon: icon,
                    imgSrc: icon,
                    canvasID: n.SYMBOL_ID,
                    typeTopo: n.REAL_RES_TYPE_NAME,
                    ircType: n.ircType
                  };
                });
                this.drawAfterFetch(this.marker, event);
                this.loading = false;
              }
            }
          }
        },
        error: e => {}
      });
    } else {
      this.toposervice.get_topo_information(id).subscribe({
        next: nodes => {
          const transformmedLink = this.transformedLink(nodes.link);
          const transformmedRCLink = this.transformedLink(nodes.rc_link);
          this.firsttimeload = true;
          if (event) {
            if (event == "Nview") {
              this.setOverlay(nodes.node, nodes.link, "Nview");
              const node = nodes.node;
              this.load_data = false;
              this.marker = nodes;
              this.linkData = transformmedLink;
              this.nodeData = node.map(n => {
                this.icontopo(n);
                const icon = this.iconMarker;
                return {
                  xPosition: n.X,
                  yPosition: n.Y,
                  canvasName: n.SYMBOL_NAME1,
                  canvasIcon: icon,
                  imgSrc: icon,
                  canvasID: n.SYMBOL_ID,
                  typeTopo: n.REAL_RES_TYPE_NAME,
                  ircType: n.ircType
                };
              });
              this.drawAfterFetch(this.marker, event);
              this.loading = false;
            } else if (event == "RCview") {
              this.setOverlay(nodes.rc_node, nodes.rc_link, "RCview");
              const node = nodes.rc_node;
              this.load_data = false;
              this.marker = nodes;
              this.linkData_rc = transformmedRCLink;
              this.nodeData_rc = node.map(n => {
                this.icontopo(n);
                const icon = this.iconMarker;
                return {
                  xPosition: n.X,
                  yPosition: n.Y,
                  canvasName: n.SYMBOL_NAME1,
                  canvasIcon: icon,
                  imgSrc: icon,
                  canvasID: n.SYMBOL_ID,
                  typeTopo: n.REAL_RES_TYPE_NAME,
                  ircType: n.ircType
                };
              });
              this.drawAfterFetch(this.marker, event);
              this.loading = false;
            } else {
              if (this.parentClick == "Nview") {
                this.setOverlay(nodes.node, nodes.link, "Nview");
                const node = nodes.node;
                this.load_data = false;
                this.marker = nodes;
                this.linkData = transformmedLink;
                this.nodeData = node.map(n => {
                  this.icontopo(n);
                  const icon = this.iconMarker;
                  return {
                    xPosition: n.X,
                    yPosition: n.Y,
                    canvasName: n.SYMBOL_NAME1,
                    canvasIcon: icon,
                    imgSrc: icon,
                    canvasID: n.SYMBOL_ID,
                    typeTopo: n.REAL_RES_TYPE_NAME,
                    ircType: n.ircType
                  };
                });
                this.drawAfterFetch(this.marker, event);
                this.loading = false;
              } else if (this.parentClick == "RCview") {
                this.setOverlay(nodes.rc_node, nodes.rc_link, "RCview");
                const node = nodes.rc_node;
                this.load_data = false;
                this.marker = nodes;
                this.linkData_rc = transformmedRCLink;
                this.nodeData_rc = node.map(n => {
                  this.icontopo(n);
                  const icon = this.iconMarker;
                  return {
                    xPosition: n.X,
                    yPosition: n.Y,
                    canvasName: n.SYMBOL_NAME1,
                    canvasIcon: icon,
                    imgSrc: icon,
                    canvasID: n.SYMBOL_ID,
                    typeTopo: n.REAL_RES_TYPE_NAME,
                    ircType: n.ircType
                  };
                });
                this.drawAfterFetch(this.marker, event);
                this.loading = false;
              }
            }
          } else {
            if (event == "Nview") {
              this.setOverlay(nodes.node, nodes.link, "Nview");
              const node = nodes.node;
              this.load_data = false;
              this.marker = nodes;
              this.linkData = transformmedLink;
              this.nodeData = node.map(n => {
                this.icontopo(n);
                const icon = this.iconMarker;
                return {
                  xPosition: n.X,
                  yPosition: n.Y,
                  canvasName: n.SYMBOL_NAME1,
                  canvasIcon: icon,
                  imgSrc: icon,
                  canvasID: n.SYMBOL_ID,
                  typeTopo: n.REAL_RES_TYPE_NAME,
                  ircType: n.ircType
                };
              });
              this.drawAfterFetch(this.marker, event);
              this.loading = false;
            } else if (event == "RCview") {
              this.setOverlay(nodes.rc_node, nodes.rc_link, "RCview");
              const node = nodes.rc_node;
              this.load_data = false;
              this.marker = nodes;
              this.linkData_rc = transformmedRCLink;
              this.nodeData_rc = node.map(n => {
                this.icontopo(n);
                const icon = this.iconMarker;
                return {
                  xPosition: n.X,
                  yPosition: n.Y,
                  canvasName: n.SYMBOL_NAME1,
                  canvasIcon: icon,
                  imgSrc: icon,
                  canvasID: n.SYMBOL_ID,
                  typeTopo: n.REAL_RES_TYPE_NAME,
                  ircType: n.ircType
                };
              });
              this.drawAfterFetch(this.marker, event);
              this.loading = false;
            } else {
              if (this.parentClick == "Nview") {
                this.setOverlay(nodes.node, nodes.link, "Nview");
                const node = nodes.node;
                this.load_data = false;
                this.marker = nodes;
                this.linkData = transformmedLink;
                this.nodeData = node.map(n => {
                  this.icontopo(n);
                  const icon = this.iconMarker;
                  return {
                    xPosition: n.X,
                    yPosition: n.Y,
                    canvasName: n.SYMBOL_NAME1,
                    canvasIcon: icon,
                    imgSrc: icon,
                    canvasID: n.SYMBOL_ID,
                    typeTopo: n.REAL_RES_TYPE_NAME,
                    ircType: n.ircType
                  };
                });
                this.drawAfterFetch(this.marker, event);
                this.loading = false;
              } else if (this.parentClick == "RCview") {
                this.setOverlay(nodes.rc_node, nodes.rc_link, "RCview");
                const node = nodes.rc_node;
                this.load_data = false;
                this.marker = nodes;
                this.linkData_rc = transformmedRCLink;
                this.nodeData_rc = node.map(n => {
                  this.icontopo(n);
                  const icon = this.iconMarker;
                  return {
                    xPosition: n.X,
                    yPosition: n.Y,
                    canvasName: n.SYMBOL_NAME1,
                    canvasIcon: icon,
                    imgSrc: icon,
                    canvasID: n.SYMBOL_ID,
                    typeTopo: n.REAL_RES_TYPE_NAME,
                    ircType: n.ircType
                  };
                });
                this.drawAfterFetch(this.marker, event);
                this.loading = false;
              }
            }
          }
        },
        error: e => {}
      });
    }
  }

  translateLine(x1, y1, x2, y2) {
    //drawline
    const r = 30;
    let rx1 = x1;
    let rx2 = x2;
    let ry1 = y1;
    let ry2 = y2;
    const offsetX = Math.min(r, Math.abs((r * (x2 - x1)) / (y2 - y1)));
    const offsetY = Math.min(r, Math.abs((r * (y2 - y1)) / (x2 - x1)));

    if (x1 > x2) {
      rx1 = x1 - offsetX;
      rx2 = x2 + offsetX;
    } else {
      rx1 = x1 + offsetX;
      rx2 = x2 - offsetX;
    }
    if (y1 > y2) {
      ry1 = y1 - offsetY;
      ry2 = y2 + offsetY;
    } else {
      ry1 = y1 + offsetY;
      ry2 = y2 - offsetY;
    }
    return { x1: rx1, x2: rx2, y1: ry1, y2: ry2 };
  }

  drawSingleLine(ctx, x1, y1, x2, y2, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

  drawDoubleLine(
    context: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string
) {
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const dx = (x2 - x1) / distance;
    const dy = (y2 - y1) / distance;

    const offset = 5; // Adjust as needed for desired spacing between lines

    // First line
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(x1 - offset * dy, y1 + offset * dx);
    context.lineTo(x2 - offset * dy, y2 + offset * dx);
    context.stroke();

    // Second line
    context.beginPath();
    context.moveTo(x1 + offset * dy, y1 - offset * dx);
    context.lineTo(x2 + offset * dy, y2 - offset * dx);
    context.stroke();
}

  drawAfterFetch(marker, event) {
    this.context = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext("2d");
    this.context.font = "10px Arial";
    this.context.textAlign = "center";
    var canvas = document.getElementById("canvas") as HTMLCanvasElement | null; //canvas id in html
    var context = canvas.getContext("2d");
    this.mapSubscription = this.themeService.getTheme().subscribe(newData => {
        if (newData === "arya-orange") {
            canvas.style.backgroundColor = "#17212F";
            canvas.style.color = "white";
        } else {
            canvas.style.backgroundColor = "white";
        }
    });

    this.images = [];
    this.canvas = canvas;
    context.lineWidth = 4;
    this.context.clearRect(0, 0, this.canvas_width, this.canvas_height);

    // Drawing lines based on event
    if (event == "Nview") {
        for (let i = 0; i < this.linkData.length; i++) {
            // console.log(this.linkData[i])
            let color;
            if (this.linkData[i].NEW_CRITICAL_ALARM_COUNT != 0) {
              // console.log("Critical alarm detected");
                color = "#ff0000";
            } else if (this.linkData[i].NEW_MAJOR_ALARM_COUNT != 0) {
                // console.log("Major alarm detected");
                color = "#FFA500";
            } else {
                // console.log("No alarms detected");
                color = "#5CED73";
            }

            if (this.linkData[i].isDoubleLine) {
                const line = this.translateLine(
                    this.linkData[i].x1 + 80,
                    this.linkData[i].y1 + 50,
                    this.linkData[i].x2 + 80,
                    this.linkData[i].y2 + 50
                );
                this.drawDoubleLine(context, line.x1, line.y1, line.x2, line.y2, color);
            } else {
                const line = this.translateLine(
                    this.linkData[i].x1 + 80,
                    this.linkData[i].y1 + 50,
                    this.linkData[i].x2 + 80,
                    this.linkData[i].y2 + 50
                );
                this.drawSingleLine(context, line.x1, line.y1, line.x2, line.y2, color);
            }
        }
    } else if (event == "RCview") {
        for (let i = 0; i < this.linkData_rc.length; i++) {
            let color;
            if (this.linkData_rc[i].NEW_CRITICAL_ALARM_COUNT != 0) {
                color = "#ff0000";
            } else if (this.linkData_rc[i].NEW_MAJOR_ALARM_COUNT != 0) {
                color = "#FFA500";
            } else {
                color = "#5CED73";
            }

            if (this.linkData_rc[i].isDoubleLine) {
                const line = this.translateLine(
                    this.linkData_rc[i].x1 + 80,
                    this.linkData_rc[i].y1 + 50,
                    this.linkData_rc[i].x2 + 80,
                    this.linkData_rc[i].y2 + 50
                );
                this.drawDoubleLine(context, line.x1, line.y1, line.x2, line.y2, color);
            } else {
                const line = this.translateLine(
                    this.linkData_rc[i].x1 + 80,
                    this.linkData_rc[i].y1 + 50,
                    this.linkData_rc[i].x2 + 80,
                    this.linkData_rc[i].y2 + 50
                );
                this.drawSingleLine(context, line.x1, line.y1, line.x2, line.y2, color);
            }
        }
    } else {
      if (this.parentClick == "Nview") {
        for (let i = 0; i < this.linkData.length; i++) {
          let color;
          if (this.linkData[i].NEW_CRITICAL_ALARM_COUNT != 0) {
            console.log("Critical alarm detected");
            color = "#ff0000";
          } else if (this.linkData[i].NEW_MAJOR_ALARM_COUNT != 0) {
              console.log("Major alarm detected");
              color = "#FFA500";
          } else {
              console.log("No alarms detected");
              color = "#5CED73";
          }

          if (this.linkData[i].isDoubleLine) {
              const line = this.translateLine(
                  this.linkData[i].x1 + 80,
                  this.linkData[i].y1 + 50,
                  this.linkData[i].x2 + 80,
                  this.linkData[i].y2 + 50
              );
              this.drawDoubleLine(context, line.x1, line.y1, line.x2, line.y2, color);
          } else {
              const line = this.translateLine(
                  this.linkData[i].x1 + 80,
                  this.linkData[i].y1 + 50,
                  this.linkData[i].x2 + 80,
                  this.linkData[i].y2 + 50
              );
              this.drawSingleLine(context, line.x1, line.y1, line.x2, line.y2, color);
          }
      }
      }
      if (this.parentClick == "RCview") {
        for (let i = 0; i < this.linkData_rc.length; i++) {
          let color;
          if (this.linkData_rc[i].NEW_CRITICAL_ALARM_COUNT != 0) {
              color = "#ff0000";
          } else if (this.linkData_rc[i].NEW_MAJOR_ALARM_COUNT != 0) {
              color = "#FFA500";
          } else {
              color = "#5CED73";
          }

          if (this.linkData_rc[i].isDoubleLine) {
              const line = this.translateLine(
                  this.linkData_rc[i].x1 + 80,
                  this.linkData_rc[i].y1 + 50,
                  this.linkData_rc[i].x2 + 80,
                  this.linkData_rc[i].y2 + 50
              );
              this.drawDoubleLine(context, line.x1, line.y1, line.x2, line.y2, color);
          } else {
              const line = this.translateLine(
                  this.linkData_rc[i].x1 + 80,
                  this.linkData_rc[i].y1 + 50,
                  this.linkData_rc[i].x2 + 80,
                  this.linkData_rc[i].y2 + 50
              );
              this.drawSingleLine(context, line.x1, line.y1, line.x2, line.y2, color);
          }
      }
      }
    }
    // Drawing images
    if (event == "Nview") {
        this.drawImages(this.nodeData, context);
    } else if (event == "RCview") {
        this.drawImages(this.nodeData_rc, context);
    } else {
        if (this.parentClick == "Nview") {
            this.drawImages(this.nodeData, context);
        }
        if (this.parentClick == "RCview") {
            this.drawImages(this.nodeData_rc, context);
        }
    }

    this.listimgfind.push(this.images);
    const filteredArr = this.listimgfind[this.listimgfind.length - 1].reduce(
        (acc, current) => {
            const x = acc.find(item => item.id === current.id);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        },
        []
    );
    this.filteredArr = filteredArr;
    if (
        this.listimgfind[this.listimgfind.length - 1].length != filteredArr.length
    ) {
        this.listimgfind[this.listimgfind.length - 1] = filteredArr;
    }
  }


  drawImages(nodeData, context) {
    for (let i = 0; i < nodeData.length; i++) {
        var img = [{
            x: nodeData[i].xPosition + 80,
            y: nodeData[i].yPosition + 40,
            width: 40,
            height: 40,
            name: nodeData[i].canvasName,
            id: nodeData[i].canvasID,
            type: nodeData[i].typeTopo,
            ircType: nodeData[i].ircType,
            src: nodeData[i].imgSrc
        }];
        this.images.push(...img);
        this.context.fillStyle = "grey";
        this.context.fillText(
            nodeData[i].canvasName,
            this.images[i].x,
            this.images[i].y - 15
        );
        const imageElement = new Image(5, 5);
        imageElement.src = nodeData[i].imgSrc;
        imageElement.onload = () => {
            context.lineWidth = 1;
            this.context.strokeStyle = "#78909c"; // Set stroke color for border
            this.context.strokeRect(
              (this.images[i]?.x ?? 0) - 20 - 1,
              (this.images[i]?.y ?? 0) - 10 - 1,
              (this.images[i]?.width ?? 0) + 2,
              (this.images[i]?.height ?? 0) + 2
          );          
            context.lineWidth = 4;
            this.context.drawImage(
                imageElement,
                this.images[i].x - 20,
                this.images[i].y - 10,
                this.images[i].width,
                this.images[i].height
            );
        };
    }
  }


  showPanel(event) {
    if (event.value == "Map") {
      this.focusOnMap = true;
      this.focusOnPanel = false;
      this.classMap = "map-show";
    } else {
      this.focusOnPanel = true;
      this.focusOnMap = false;
      this.classMap = "map-hidden";
    }
  }

  evntNodeMain: any[] = [];
  listParent: any;

  nodeExpandMain(event) {
    // this.parent = undefined;

    if (event.node.parent == undefined) {
      this.evntNodeMain.push(event.node);
      this.breadcrumb_items = [];
      this.toposervice.get_topo_information(0).subscribe({
        next: marker => {
          if (event.node.label == "Nview") {
            this.parent = marker.node;
            // this.listParent = 'Nview'
            if (this.evntNodeMain[0].label != "Nview") {
              this.evntNodeMain[0].expanded = false;
              this.evntNodeMain = this.evntNodeMain.filter(
                data => data.label == "Nview"
              );
            }
            this.drawAfterFetch(marker, "Nview");
            this.reset_map();
            this.initTopologysubNview(event.node, marker.node);
          } else if (event.node.label == "RCview") {
            this.parent = marker.rc_node;
            if (this.evntNodeMain[0].label != "RCview") {
              this.evntNodeMain[0].expanded = false;
              this.evntNodeMain = this.evntNodeMain.filter(
                data => data.label == "RCview"
              );
            }
            this.fetchNodeWithLink(0, "RCview");
            // this.drawAfterFetch(marker,"Nview");
            this.initTopologysubRCview(event.node, marker.rc_node);
            this.reset_mapRCview();
          }
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
    } else {
      if (event.node.parent.label == "Nview" || this.listParent == "Nview") {
        var filter = this.breadcrumb_items.filter(
          data => data.id == event.node.key
        );
        if (filter.length == 0) {
          this.parentClick = "Nview";
          this.nodeExpand(event);
        }
      } else if (
        event.node.parent.label == "RCview" ||
        this.listParent == "RCview"
      ) {
        var filters = this.breadcrumb_items.filter(
          data => data.id == event.node.key
        );
        if (filters.length == 0) {
          this.parentClick = "RCview";
          this.nodeExpandRcview(event);
        }
      }
    }
  }
  nodeExpandMainMap(event, key) {
    // this.parent = undefined;
    if (event.node.parent == undefined) {
      this.evntNodeMain.push(event.node);
      this.breadcrumb_items = [];
      this.toposervice.get_topo_information(0).subscribe({
        next: marker => {
          // this.drawAfterFetch(marker);
          if (event.node.label == "Nview") {
            this.parent = marker.node;
            // this.listParent = 'Nview'
            if (this.evntNodeMain[0].label != "Nview") {
              this.evntNodeMain[0].expanded = false;
              this.evntNodeMain = this.evntNodeMain.filter(
                data => data.label == "Nview"
              );
            }

            // this.reset_map();
            this.initTopologysubNviewMap(event.node, marker.node, key);
          } else if (event.node.label == "RCview") {
            this.parent = marker.rc_node;
            if (this.evntNodeMain[0].label != "RCview") {
              this.evntNodeMain[0].expanded = false;
              this.evntNodeMain = this.evntNodeMain.filter(
                data => data.label == "RCview"
              );
            }
            this.initTopologysub_staging(event.node, marker.rc_node, key);
            // this.reset_mapRCview();
          }
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
    } else {
      if (event.node.parent.label == "Nview" || this.listParent == "Nview") {
        var filter = this.breadcrumb_items.filter(
          data => data.id == event.node.key
        );
        if (filter.length == 0) {
          this.nodeExpand(event);
        }
      } else if (
        event.node.parent.label == "RCview" ||
        this.listParent == "RCview"
      ) {
        var filters = this.breadcrumb_items.filter(
          data => data.id == event.node.key
        );
        if (filters.length == 0) {
          this.nodeExpandRcview(event);
        }
      }
    }
  }
  nodeExpandMainMap2(event, key) {
    // this.parent = undefined;

    if (event.parent == undefined) {
      console.log("hi");
      this.evntNodeMain.push(event.node);
      this.breadcrumb_items = [];
      this.toposervice.get_topo_information(0).subscribe({
        next: marker => {
          // this.drawAfterFetch(marker);
          if (event.node.label == "Nview") {
            this.parent = marker.node;
            // this.listParent = 'Nview'
            if (this.evntNodeMain[0].label != "Nview") {
              this.evntNodeMain[0].expanded = false;
              this.evntNodeMain = this.evntNodeMain.filter(
                data => data.label == "Nview"
              );
            }

            // this.reset_map();
            this.initTopologysubNviewMap(event.node, marker.node, key);
          } else if (event.node.label == "RCview") {
            this.parent = marker.rc_node;
            if (this.evntNodeMain[0].label != "RCview") {
              this.evntNodeMain[0].expanded = false;
              this.evntNodeMain = this.evntNodeMain.filter(
                data => data.label == "RCview"
              );
            }
            this.initTopologysubRCviewMap(event.node, marker.rc_node, key);
            // this.reset_mapRCview();
          }
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
    } else {
      if (event.parent == "Nview" || this.listParent == "Nview") {
        this.nodeExpandMap(event);
      } else if (event.parent == "RCview" || this.listParent == "RCview") {
        var filters = this.breadcrumb_items.filter(
          data => data.id == event.key
        );
        if (filters.length == 0) {
          this.nodeExpandRcviewMap(event);
        }
      }
    }
  }
  nodeExpand(event) {
    this.toposervice.getNoicon();
    if (event.node) {
      this.fetchNodeWithLink(event.node.key, event.node.parent.label);
      this.toposervice.get_topo_information(event.node.key).subscribe(nodes => {
        event.node.children = [];
        nodes.node.forEach(node => {
          this.add_subtopo(event.node, node);
          this.load_data = false;
        });

        this.nodeClick(event, nodes);
      });
      this.load_data = true;
    }
  }
  nodeExpandMap(event) {
    this.toposervice.getNoicon();
    if (event) {
      this.toposervice.get_topo_information(event.key).subscribe(nodes => {
        event.children = [];
        nodes.node.forEach(node => {
          this.add_subtopo(event, node);
          this.load_data = false;
        });
      });
      this.load_data = true;
    }
  }
  backtoPrevious(event) {
    var index = this.breadcrumb_items.length - 2;
    var indexs = this.breadcrumb_items.length - 1;
    this.arr = this.breadcrumb_items.splice(indexs, 1);
    this.fetchNodeWithLink(this.breadcrumb_items[index].id, "Nview");
  }

  nodeExpandRcview(event) {
    this.toposervice.getNoicon();
    if (event.node) {
      this.fetchNodeWithLink(event.node.key, event.node.parent.label);
      this.toposervice.get_topo_information(event.node.key).subscribe({
        next: nodes => {
          event.node.children = [];
          nodes.rc_node.forEach(node => {
            this.add_subtopo_staging(event.node, node);
            this.load_data = false;
          });
          this.nodeClickRcview(event, nodes);
        }
      });

      this.load_data = true;
    }
  }
  nodeExpandRcviewMap(event) {
    this.toposervice.getNoicon();
    if (event) {
      this.toposervice.get_topo_information(event.key).subscribe(nodes => {
        event.children = [];
        nodes.rc_node.forEach(node => {
          this.add_subtopo_staging(event, node);
          this.load_data = false;
        });
      });
      this.load_data = true;
    }
  }
  nodeExpand2(event, image_id) {
    this.img.src = this.toposervice.getNoicon();
    this.load_data = true;
    this.fetchNodeWithLink(image_id, "Nview");
    this.toposervice.get_topo_information(image_id).subscribe({
      next: nodes => {
        this.nodeClick2(this.images, nodes);
      }
    });
  }

  openInNewTab(
    router: Router,
    namedRoute,
    param1: string,
    param2: string,
    param3: string
  ) {
    let newRelativeUrl = router.createUrlTree([namedRoute], {
      queryParams: { ID: param1, IRCNETypeID: param2, IPadress: param3 }
    });
    let baseUrl = window.location.href.replace(router.url, "");

    window.open(baseUrl + newRelativeUrl, "_blank");
  }
  remote(event) {
    if (event.node.data.type == "NE") {
      this.AdminLayoutService.sideiconClass("devicelist");
      this.AdminLayoutService.addOrderBox("/device");
      if (event.node.data.ipaddress != null) {
        this.router.navigate(["/device"], {
          queryParams: {
            ID: event.node.data.res_id,
            IRCNETypeID: event.node.data.ircType,
            IPadress: event.node.data.ipaddress
          }
        });
      }
    }
  }

  expandAll() {
    this.topology.forEach(node => {
      this.expandRecursive(node, true);
    });
  }

  collapseAll() {
    this.eventNode = [];
    this.eventNodeRC = [];
    this.evntNodeMain = [];
    this.firstClick = false;

    this.mainTree.forEach(node => {
      this.expandRecursive(node, false);
    });
    this.reset_map();
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach(childNode => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

  handle_topology(topo_data: any) {
    this.topology.shift;
  }

  searchTree(element, matchingTitle) {
    if (element.key == matchingTitle) {
      return element;
    } else if (element.children != null) {
      var i;
      var result = null;
      for (i = 0; result == null && i < element.children.length; i++) {
        result = this.searchTree(element.children[i], matchingTitle);
      }
      return result;
    }
    return null;
  }

  initTopology(Topo_datas: any) {
    Topo_datas.forEach(data => {
      this.add_topo(data);
    });
  }
  initTopologysub_staging(event, Topo_datas: any, key) {
    event.children = [];
    Topo_datas.forEach(data => {
      this.add_subtopoRCviewMap(event, data, key);
    });
  }
  initTopologysubRCview(event, Topo_datas: any) {
    event.children = [];
    Topo_datas.forEach(data => {
      this.add_subtopoRCview(event, data);
    });
  }
  initTopologysubRCviewMap(event, Topo_datas: any, key) {
    event.children = [];
    Topo_datas.forEach(data => {
      this.add_subtopoRCviewMap(event, data, key);
    });
  }
  initTopologysubNview(event, Topo_datas: any) {
    event.children = [];
    Topo_datas.forEach(data => {
      this.add_subtopoNview(event, data);
    });
  }
  initTopologysubNviewMap(event, Topo_datas: any, key) {
    event.children = [];
    Topo_datas.forEach(data => {
      this.add_subtopoNviewMap(event, data, key);
    });
  }
  initTopologyMain(datalist) {
    datalist.forEach(data => {
      this.add_topoMain(data);
    });
  }
  initTopology_staging(Topo_datas: any) {
    Topo_datas.forEach(data => {
      this.add_topo_staging(data);
    });
  }
  add_topoMain(topo) {
    let haschildren = topo.haschildren == "TRUE" ? true : false;

    this.mainTree.push({
      label: topo.label,
      leaf: !haschildren,
      children: []
    });
  }
  icon: any;
  add_topo(topo) {
    this.icon = "";
    this.icontopo(topo);
    let haschildren = topo.haschildren == "TRUE" ? true : false;
    this.topology.push({
      key: topo.SYMBOL_ID,
      label: topo.SYMBOL_NAME1,
      data: {
        tree_parent_id: topo.TREE_PARENT_ID,
        res_id: topo.RES_ID,
        type: topo.RES_TYPE_NAME,
        description: topo.SYMBOL_NAME3,
        latitude: topo.latitude,
        longitude: topo.longitude,
        topo_icon: topo.topo_icon,
        icon: topo.icon,
        ircType: topo.ircType
      },
      type: topo.RES_TYPE_NAME,
      expandedIcon: this.icon,
      collapsedIcon: this.icon,
      leaf: !haschildren,
      children: []
    });
  }
  iconClass: any;
  icontopo(topo) {
    // console.log(topo)

    if (topo.TOPO_TYPE_ID) {
      if (topo.ISPINGOK == 1) {
        if (
          topo.NEW_CRITICAL_ALARM_COUNT != 0 ||
          topo.NEW_MAJOR_ALARM_COUNT != 0 ||
          topo.NEW_MINOR_ALARM_COUNT != 0 ||
          topo.NEW_WARNING_ALARM_COUNT != 0 ||
          topo.NEW_INDETERMINATE_ALARM_COUNT != 0
        ) {
          this.iconMinor(topo);
          // } else  if (topo.NEW_MAJOR_ALARM_COUNT != 0){
          //   this.iconMajor(topo)
          // } else  if (topo.NEW_MINOR_ALARM_COUNT != 0){
          //   this.iconMinor(topo)
          // } else  if (topo.NEW_WARNING_ALARM_COUNT != 0){
          //   this.iconWarning(topo)
          // } else if (topo.NEW_INDETERMINATE_ALARM_COUNT != 0){
          //   this.iconUnknown(topo)
        } else {
          this.iconUnknown(topo);
        }
      } else if (topo.ISPINGOK == 0) {
        this.iconMajor(topo);
      }
    }

    // if (topo.RES_TYPE_NAME){
    //   if (topo.RES_TYPE_NAME == "TOPO_SUBNET"){
    //     if (topo.topo_icon) {
    //       if (topo.topo_icon == "city" ||topo.topo_icon == "server"){
    //         if(topo.ISPINGOK == 0){
    //           this.icon = `nt-${topo.topo_icon}-not`;
    //         } else {
    //           this.icon = `nt-${topo.topo_icon}-yes`;
    //         }
    //       } else {
    //         if(topo.ISPINGOK == 0){
    //           this.icon = `nt-default-not`;
    //         } else {
    //           this.icon = `nt-default-yes`;
    //         }
    //       }
    //     } else {
    //       if(topo.ISPINGOK == 0){
    //         this.icon = `nt-default-not`;
    //       } else {
    //         this.icon = `nt-default-yes`;
    //       }
    //     }
    //   } else if (topo.RES_TYPE_NAME == "NE"){
    //     if (topo.ircType) {
    //       if (topo.ircType == "ISCOM2608G-2GE-PWR" || topo.ircType == "ISCOM2624G-4C-PWR" || topo.ircType == "ISCOM2624G-4GE-PWR"
    //       || topo.ircType == "ISCOM2608G-2GE" || topo.ircType == "ISCOM2624G-4GE"){
    //         if(topo.ISPINGOK == 0){
    //           this.icon = `nt-26xx-not`;
    //         } else {
    //           this.icon = `nt-26xx-yes`;
    //         }
    //       } else if (topo.ircType == "ISCOM2948G-4C" || topo.ircType == "ISCOM2924GF-4GE" || topo.ircType == "ISCOM2948GF-4C"){
    //         if(topo.ISPINGOK == 0){
    //           this.icon = `nt-29xx-not`;
    //         } else {
    //           this.icon = `nt-29xx-yes`;
    //         }
    //       } else if (topo.ircType == "RAX711-C"){
    //         if(topo.ISPINGOK == 0){
    //           this.icon = `nt-rax711c-not`;
    //         } else {
    //           this.icon = `nt-rax711c-yes`;
    //         }
    //       } else if (topo.ircType == "ISCOM-RAX711" || topo.ircType == "ISCOM-RAX711A" || topo.ircType == "ISCOM-RAX711B"){
    //         if(topo.ISPINGOK == 0){
    //           this.icon = `nt-rax7xx-not`;
    //         } else {
    //           this.icon = `nt-rax7xx-yes`;
    //         }

    //       } else if (topo.ircType == "ISCOM3048XF-4Q"){
    //         if(topo.ISPINGOK == 0){
    //           this.icon = `nt-30xx-not`;
    //         } else {
    //           this.icon = `nt-30xx-yes`;
    //         }
    //       } else if (topo.ircType == "ISCOM2110EA-MA"){
    //         if(topo.ISPINGOK == 0){
    //           this.icon = `nt-21xx-not`;
    //         } else {
    //           this.icon = `nt-21xx-yes`;
    //         }
    //       } else {
    //         if (topo.topo_icon) {
    //           if (topo.topo_icon == "city" ||topo.topo_icon == "server"){
    //             if(topo.ISPINGOK == 0){
    //               this.icon = `nt-${topo.topo_icon}-not`;
    //             } else {
    //               this.icon = `nt-${topo.topo_icon}-yes`;
    //             }
    //           } else {
    //             if(topo.ISPINGOK == 0){
    //               this.icon = `nt-default-not`;
    //             } else {
    //               this.icon = `nt-default-yes`;
    //             }
    //           }
    //         }
    //       }

    //     } else {
    //       if(topo.ISPINGOK == 0){
    //         this.icon = `nt-default-not`;
    //       } else {
    //         this.icon = `nt-default-yes`;
    //       }
    //     }
    //   } else {
    //     if (topo.topo_icon) {
    //       if (topo.topo_icon == "city" ||topo.topo_icon == "server"){
    //         if(topo.ISPINGOK == 0){
    //           this.icon = `nt-${topo.topo_icon}-not`;
    //         } else {
    //           this.icon = `nt-${topo.topo_icon}-yes`;
    //         }
    //       } else {
    //         if(topo.ISPINGOK == 0){
    //           this.icon = `nt-default-not`;
    //         } else {
    //           this.icon = `nt-default-yes`;
    //         }
    //       }
    //     }
    //   }
    // } else {
    //   if (topo.topo_icon) {
    //     if (topo.topo_icon == "city" ||topo.topo_icon == "server"){
    //       if(topo.ISPINGOK == 0){
    //         this.icon = `nt-${topo.topo_icon}-not`;
    //       } else {
    //         this.icon = `nt-${topo.topo_icon}-yes`;
    //       }
    //     } else {
    //       if(topo.ISPINGOK == 0){
    //         this.icon = `nt-default-not`;
    //       } else {
    //         this.icon = `nt-default-yes`;
    //       }
    //     }

    //   } else {
    //     if(topo.ISPINGOK == 0){
    //       this.icon = `nt-default-not`;
    //     } else {
    //       this.icon = `nt-default-yes`;
    //     }
    //   }
    // }
  }
  iconCritical(topo) {
    if (topo.TOPO_TYPE_ID == "11_NMS") {
      this.icon = `nt-11-nms-Critical`;
      this.iconMarker = "./assets/img/Critical/11_nms-01.png";
    } else if (topo.TOPO_TYPE_ID == "26") {
      this.icon = `nt-area-Critical`;
      this.iconMarker = "./assets/img/Critical/area-01.png";
    } else if (topo.TOPO_TYPE_ID == "63") {
      this.icon = `nt-chassis-Critical`;
      this.iconMarker = "./assets/img/Critical/chassis-01.png";
    } else if (topo.TOPO_TYPE_ID == "27") {
      this.icon = `nt-city-Critical`;
      this.iconMarker = "./assets/img/Critical/city-01.png";
    } else if (topo.TOPO_TYPE_ID == "58") {
      this.icon = `nt-hostpital-Critical`;
      this.iconMarker = "./assets/img/Critical/hostpital-01.png";
    } else if (topo.TOPO_TYPE_ID == "62") {
      this.icon = `nt-school-Critical`;
      this.iconMarker = "./assets/img/Critical/school-01.png";
    } else if (
      topo.TOPO_TYPE_ID == "11_ISCOM2948GF-4C" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2948G-4C" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2924GF-4GE" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2924GF-4C"
    ) {
      this.icon = `nt-29xx-Critical`;
      this.iconMarker = "./assets/img/device/29xx.png";
    } else if (topo.TOPO_TYPE_ID == "11_ISCOM3048XF-4Q") {
      this.icon = `nt-30xx-Critical`;
      this.iconMarker = "./assets/img/device/30xx.png";
    } else if (
      topo.TOPO_TYPE_ID == "11_ISCOM-RAX711B" ||
      topo.TOPO_TYPE_ID == "11_ISCOM-RAX711"
    ) {
      this.icon = `nt-rax700-Critical`;
      this.iconMarker = "./assets/img/device/rax700.png";
    } else if (
      topo.TOPO_TYPE_ID == "11_RAX711-L-4GC" ||
      topo.TOPO_TYPE_ID == "11_RAX711-C"
    ) {
      this.icon = `nt-rax711c-Critical`;
      this.iconMarker = "./assets/img/device/rax711c.png";
    } else if (
      topo.TOPO_TYPE_ID == "11_ISCOM2624G-4GE-PWR" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2624G-4GE" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2624G-4C-PWR" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2608G-2GE-PWR" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2608G-2GE"
    ) {
      this.icon = `nt-26xx-Critical`;
      this.iconMarker = "./assets/img/device/26xx.png";
    } else if (topo.TOPO_TYPE_ID == "11_ISCOM2110EA-MA") {
      this.icon = `nt-21xx-Critical`;
      this.iconMarker = "./assets/img/device/21xx.png";
    } else if (topo.TOPO_TYPE_ID == "11_ISCOM2828F-C") {
      this.icon = `nt-default-Critical`;
      this.iconMarker = "./assets/img/device/default.png";
    } else {
      if (topo.RES_TYPE_NAME == "NE") {
        this.icon = `nt-other-Critical`;
        this.iconMarker = "./assets/img/device/OTHER.png";
      } else {
        if (topo.RES_TYPE_NAME == "CHASSIS") {
          this.icon = `nt-chassis-Critical`;
          this.iconMarker = "./assets/img/Critical/chassis-01.png";
        } else {
          this.icon = `nt-rack-Critical`;
          this.iconMarker = "./assets/img/Critical/rack-01.png";
        }
      }
    }
  }
  iconMajor(topo) {
    if (topo.TOPO_TYPE_ID == "11_NMS") {
      this.icon = `nt-11-nms-Major`;
      this.iconMarker = "./assets/img/Major/11_nms-01.png";
    } else if (topo.TOPO_TYPE_ID == "26") {
      this.icon = `nt-area-Major`;
      this.iconMarker = "./assets/img/Major/area-01.png";
    } else if (topo.TOPO_TYPE_ID == "63") {
      this.icon = `nt-chassis-Major`;
      this.iconMarker = "./assets/img/Major/chassis-01.png";
    } else if (topo.TOPO_TYPE_ID == "27") {
      this.icon = `nt-city-Major`;
      this.iconMarker = "./assets/img/Major/city-01.png";
    } else if (topo.TOPO_TYPE_ID == "58") {
      this.icon = `nt-hostpital-Major`;
      this.iconMarker = "./assets/img/Major/hostpital-01.png";
    } else if (topo.TOPO_TYPE_ID == "62") {
      this.icon = `nt-school-Major`;
      this.iconMarker = "./assets/img/Major/school-01.png";
    } else if (
      topo.TOPO_TYPE_ID == "11_ISCOM2948GF-4C" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2948G-4C" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2924GF-4GE" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2924GF-4C"
    ) {
      this.icon = `nt-29xx-Major`;
      this.iconMarker = "./assets/img/Major/29xx.png";
    } else if (topo.TOPO_TYPE_ID == "11_ISCOM3048XF-4Q") {
      this.icon = `nt-30xx-Major`;
      this.iconMarker = "./assets/img/Major/30xx.png";
    } else if (
      topo.TOPO_TYPE_ID == "11_ISCOM-RAX711B" ||
      topo.TOPO_TYPE_ID == "11_ISCOM-RAX711" ||
      topo.TOPO_TYPE_ID == "11_RAX721-A-XF"
    ) {
      this.icon = `nt-rax700-Major`;
      this.iconMarker = "./assets/img/Major/rax700.png";
    } else if (topo.TOPO_TYPE_ID == "11_RAX711-C") {
      this.icon = `nt-rax711c-Major`;
      this.iconMarker = "./assets/img/Major/rax711c.png";
    } else if (topo.TOPO_TYPE_ID == "11_RAX711-L-4GC") {
      this.icon = `nt-rax711l-Major`;
      this.iconMarker = "./assets/img/Major/rax711L.png";
    } else if (
      topo.TOPO_TYPE_ID == "11_ISCOM2624G-4GE-PWR" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2624G-4GE" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2600(B)" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2624G-4C-PWR" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2608G-2GE-PWR" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2608G-2GE"
    ) {
      this.icon = `nt-26xx-Major`;
      this.iconMarker = "./assets/img/Major/26xx.png";
    } else if (topo.TOPO_TYPE_ID == "11_ISCOM2110EA-MA") {
      this.icon = `nt-21xx-Major`;
      this.iconMarker = "./assets/img/Major/21xx.png";
    } else if (topo.TOPO_TYPE_ID == "11_ISCOM2828F-C") {
      this.icon = `nt-default-Major`;
      this.iconMarker = "./assets/img/Major/default.png";
    } else {
      if (topo.RES_TYPE_NAME == "NE") {
        this.icon = `nt-other-Major`;
        this.iconMarker = "./assets/img/Major/OTHER.png";
      } else {
        if (topo.RES_TYPE_NAME == "CHASSIS") {
          this.icon = `nt-chassis-Major`;
          this.iconMarker = "./assets/img/Major/chassis-01.png";
        } else {
          this.icon = `nt-rack-Major`;
          this.iconMarker = "./assets/img/Major/rack-01.png";
        }
      }
    }
  }
  iconMinor(topo) {
    if (topo.TOPO_TYPE_ID == "11_NMS") {
      this.icon = `nt-11-nms-Minor`;
      this.iconMarker = "./assets/img/Minor/11_nms-01.png";
    } else if (topo.TOPO_TYPE_ID == "26") {
      this.icon = `nt-area-Minor`;
      this.iconMarker = "./assets/img/Minor/area-01.png";
    } else if (topo.TOPO_TYPE_ID == "63") {
      this.icon = `nt-chassis-Minor`;
      this.iconMarker = "./assets/img/Minor/chassis-01.png";
    } else if (topo.TOPO_TYPE_ID == "27") {
      this.icon = `nt-city-Minor`;
      this.iconMarker = "./assets/img/Minor/city-01.png";
    } else if (topo.TOPO_TYPE_ID == "58") {
      this.icon = `nt-hostpital-Minor`;
      this.iconMarker = "./assets/img/Minor/hostpital-01.png";
    } else if (topo.TOPO_TYPE_ID == "62") {
      this.icon = `nt-school-Minor`;
      this.iconMarker = "./assets/img/Minor/school-01.png";
    } else if (
      topo.TOPO_TYPE_ID == "11_ISCOM2948GF-4C" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2948G-4C" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2924GF-4GE" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2924GF-4C"
    ) {
      this.icon = `nt-29xx-Minor`;
      this.iconMarker = "./assets/img/Minor/29xx.png";
    } else if (topo.TOPO_TYPE_ID == "11_ISCOM3048XF-4Q") {
      this.icon = `nt-30xx-Minor`;
      this.iconMarker = "./assets/img/Minor/30xx.png";
    } else if (
      topo.TOPO_TYPE_ID == "11_ISCOM-RAX711B" ||
      topo.TOPO_TYPE_ID == "11_ISCOM-RAX711" ||
      topo.TOPO_TYPE_ID == "11_RAX721-A-XF"
    ) {
      this.icon = `nt-rax700-Minor`;
      this.iconMarker = "./assets/img/Minor/rax700.png";
    } else if (topo.TOPO_TYPE_ID == "11_RAX711-C") {
      this.icon = `nt-rax711c-Minor`;
      this.iconMarker = "./assets/img/Minor/rax711c.png";
    } else if (topo.TOPO_TYPE_ID == "11_RAX711-L-4GC") {
      this.icon = `nt-rax711l-Minor`;
      this.iconMarker = "./assets/img/Minor/rax711L.png";
    } else if (
      topo.TOPO_TYPE_ID == "11_ISCOM2624G-4GE-PWR" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2624G-4GE" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2600(B)" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2624G-4C-PWR" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2608G-2GE-PWR" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2608G-2GE"
    ) {
      this.icon = `nt-26xx-Minor`;
      this.iconMarker = "./assets/img/Minor/26xx.png";
    } else if (topo.TOPO_TYPE_ID == "11_ISCOM2110EA-MA") {
      this.icon = `nt-21xx-Minor`;
      this.iconMarker = "./assets/img/Minor/21xx.png";
    } else if (topo.TOPO_TYPE_ID == "11_ISCOM2828F-C") {
      this.icon = `nt-default-Minor`;
      this.iconMarker = "./assets/img/Minor/default.png";
    } else {
      if (topo.RES_TYPE_NAME == "NE") {
        this.icon = `nt-other-Minor`;
        this.iconMarker = "./assets/img/Minor/OTHER.png";
      } else {
        if (topo.RES_TYPE_NAME == "CHASSIS") {
          this.icon = `nt-chassis-Minor`;
          this.iconMarker = "./assets/img/Minor/chassis-01.png";
        } else {
          this.icon = `nt-rack-Minor`;
          this.iconMarker = "./assets/img/Minor/rack-01.png";
        }
      }
    }
  }
  iconWarning(topo) {
    if (topo.TOPO_TYPE_ID == "11_NMS") {
      this.icon = `nt-11-nms-Warning`;
      this.iconMarker = "./assets/img/Warning/11_nms-01.png";
    } else if (topo.TOPO_TYPE_ID == "26") {
      this.icon = `nt-area-Warning`;
      this.iconMarker = "./assets/img/Warning/area-01.png";
    } else if (topo.TOPO_TYPE_ID == "63") {
      this.icon = `nt-chassis-Warning`;
      this.iconMarker = "./assets/img/Warning/chassis-01.png";
    } else if (topo.TOPO_TYPE_ID == "27") {
      this.icon = `nt-city-Warning`;
      this.iconMarker = "./assets/img/Warning/city-01.png";
    } else if (topo.TOPO_TYPE_ID == "58") {
      this.icon = `nt-hostpital-Warning`;
      this.iconMarker = "./assets/img/Warning/hostpital-01.png";
    } else if (topo.TOPO_TYPE_ID == "62") {
      this.icon = `nt-school-Warning`;
      this.iconMarker = "./assets/img/Warning/school-01.png";
    } else if (
      topo.TOPO_TYPE_ID == "11_ISCOM2948GF-4C" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2948G-4C" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2924GF-4GE" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2924GF-4C"
    ) {
      this.icon = `nt-29xx-Warning`;
      this.iconMarker = "./assets/img/device/29xx.png";
    } else if (topo.TOPO_TYPE_ID == "11_ISCOM3048XF-4Q") {
      this.icon = `nt-30xx-Warning`;
      this.iconMarker = "./assets/img/device/30xx.png";
    } else if (
      topo.TOPO_TYPE_ID == "11_ISCOM-RAX711B" ||
      topo.TOPO_TYPE_ID == "11_ISCOM-RAX711"
    ) {
      this.icon = `nt-rax700-Warning`;
      this.iconMarker = "./assets/img/device/rax700.png";
    } else if (
      topo.TOPO_TYPE_ID == "11_RAX711-L-4GC" ||
      topo.TOPO_TYPE_ID == "11_RAX711-C"
    ) {
      this.icon = `nt-rax711c-Warning`;
      this.iconMarker = "./assets/img/device/rax711c.png";
    } else if (
      topo.TOPO_TYPE_ID == "11_ISCOM2624G-4GE-PWR" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2624G-4GE" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2624G-4C-PWR" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2608G-2GE-PWR" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2608G-2GE"
    ) {
      this.icon = `nt-26xx-Warning`;
      this.iconMarker = "./assets/img/device/26xx.png";
    } else if (topo.TOPO_TYPE_ID == "11_ISCOM2110EA-MA") {
      this.icon = `nt-21xx-Warning`;
      this.iconMarker = "./assets/img/device/21xx.png";
    } else if (topo.TOPO_TYPE_ID == "11_ISCOM2828F-C") {
      this.icon = `nt-default-Warning`;
      this.iconMarker = "./assets/img/device/default.png";
    } else {
      if (topo.RES_TYPE_NAME == "NE") {
        this.icon = `nt-other-Warning`;
        this.iconMarker = "./assets/img/device/OTHER.png";
      } else {
        if (topo.RES_TYPE_NAME == "CHASSIS") {
          this.icon = `nt-chassis-Warning`;
          this.iconMarker = "./assets/img/Warning/chassis-01.png";
        } else {
          this.icon = `nt-rack-Warning`;
          this.iconMarker = "./assets/img/Warning/rack-01.png";
        }
      }
    }
  }
  iconUnknown(topo) {
    if (topo.TOPO_TYPE_ID == "11_NMS") {
      this.icon = `nt-11-nms-Unknown`;
      this.iconMarker = "./assets/img/Unknown/11_nms-01.png";
    } else if (topo.TOPO_TYPE_ID == "26") {
      this.icon = `nt-area-Unknown`;
      this.iconMarker = "./assets/img/Unknown/area-01.png";
    } else if (topo.TOPO_TYPE_ID == "63") {
      this.icon = `nt-chassis-Unknown`;
      this.iconMarker = "./assets/img/Unknown/chassis-01.png";
    } else if (topo.TOPO_TYPE_ID == "27") {
      this.icon = `nt-city-Unknown`;
      this.iconMarker = "./assets/img/Unknown/city-01.png";
    } else if (topo.TOPO_TYPE_ID == "58") {
      this.icon = `nt-hostpital-Unknown`;
      this.iconMarker = "./assets/img/Unknown/hostpital-01.png";
    } else if (topo.TOPO_TYPE_ID == "62") {
      this.icon = `nt-school-Unknown`;
      this.iconMarker = "./assets/img/Unknown/school-01.png";
    } else if (
      topo.TOPO_TYPE_ID == "11_ISCOM2948GF-4C" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2948G-4C" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2924GF-4GE" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2924GF-4C"
    ) {
      this.icon = `nt-29xx-Unknown`;
      this.iconMarker = "./assets/img/Unknown/29xx.png";
    } else if (topo.TOPO_TYPE_ID == "11_ISCOM3048XF-4Q") {
      this.icon = `nt-30xx-Unknown`;
      this.iconMarker = "./assets/img/Unknown/30xx.png";
    } else if (
      topo.TOPO_TYPE_ID == "11_ISCOM-RAX711B" ||
      topo.TOPO_TYPE_ID == "11_ISCOM-RAX711" ||
      topo.TOPO_TYPE_ID == "11_RAX721-A-XF"
    ) {
      this.icon = `nt-rax700-Unknown`;
      this.iconMarker = "./assets/img/Unknown/rax700.png";
    } else if (topo.TOPO_TYPE_ID == "11_RAX711-C") {
      this.icon = `nt-rax711c-Unknown`;
      this.iconMarker = "./assets/img/Unknown/rax711c.png";
    } else if (topo.TOPO_TYPE_ID == "11_RAX711-L-4GC") {
      this.icon = `nt-rax711l-Unknown`;
      this.iconMarker = "./assets/img/Unknown/rax711L.png";
    } else if (
      topo.TOPO_TYPE_ID == "11_ISCOM2624G-4GE-PWR" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2624G-4GE" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2600(B)" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2624G-4C-PWR" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2608G-2GE-PWR" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2608G-2GE"
    ) {
      this.icon = `nt-26xx-Unknown`;
      this.iconMarker = "./assets/img/Unknown/26xx.png";
    } else if (topo.TOPO_TYPE_ID == "11_ISCOM2110EA-MA") {
      this.icon = `nt-21xx-Unknown`;
      this.iconMarker = "./assets/img/Unknown/21xx.png";
    } else if (topo.TOPO_TYPE_ID == "11_ISCOM2828F-C") {
      this.icon = `nt-default-Unknown`;
      this.iconMarker = "./assets/img/Unknown/default.png";
    } else {
      if (topo.RES_TYPE_NAME == "NE") {
        this.icon = `nt-other-Unknown`;
        this.iconMarker = "./assets/img/Unknown/OTHER.png";
      } else {
        if (topo.RES_TYPE_NAME == "CHASSIS") {
          this.icon = `nt-chassis-Unknown`;
          this.iconMarker = "./assets/img/Unknown/chassis-01.png";
        } else {
          this.icon = `nt-rack-Unknown`;
          this.iconMarker = "./assets/img/Unknown/rack-01.png";
        }
      }
    }
  }
  iconnone(topo) {
    if (topo.TOPO_TYPE_ID == "11_NMS") {
      this.icon = `nt-11-nms-none`;
      this.iconMarker = "./assets/img/none/11_nms-01.png";
    } else if (topo.TOPO_TYPE_ID == "26") {
      this.icon = `nt-area-none`;
      this.iconMarker = "./assets/img/none/area-01.png";
    } else if (topo.TOPO_TYPE_ID == "63") {
      this.icon = `nt-chassis-none`;
      this.iconMarker = "./assets/img/none/chassis-01.png";
    } else if (topo.TOPO_TYPE_ID == "27") {
      this.icon = `nt-city-none`;
      this.iconMarker = "./assets/img/none/city-01.png";
    } else if (topo.TOPO_TYPE_ID == "58") {
      this.icon = `nt-hostpital-none`;
      this.iconMarker = "./assets/img/none/hostpital-01.png";
    } else if (topo.TOPO_TYPE_ID == "62") {
      this.icon = `nt-school-none`;
      this.iconMarker = "./assets/img/none/school-01.png";
    } else if (
      topo.TOPO_TYPE_ID == "11_ISCOM2948GF-4C" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2948G-4C" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2924GF-4GE" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2924GF-4C"
    ) {
      this.icon = `nt-29xx-none`;
      this.iconMarker = "./assets/img/device/29xx.png";
    } else if (topo.TOPO_TYPE_ID == "11_ISCOM3048XF-4Q") {
      this.icon = `nt-30xx-none`;
      this.iconMarker = "./assets/img/device/30xx.png";
    } else if (
      topo.TOPO_TYPE_ID == "11_ISCOM-RAX711B" ||
      topo.TOPO_TYPE_ID == "11_ISCOM-RAX711"
    ) {
      this.icon = `nt-rax700-none`;
      this.iconMarker = "./assets/img/device/rax700.png";
    } else if (
      topo.TOPO_TYPE_ID == "11_RAX711-L-4GC" ||
      topo.TOPO_TYPE_ID == "11_RAX711-C"
    ) {
      this.icon = `nt-rax711c-none`;
      this.iconMarker = "./assets/img/device/rax711c.png";
    } else if (
      topo.TOPO_TYPE_ID == "11_ISCOM2624G-4GE-PWR" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2624G-4GE" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2624G-4C-PWR" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2608G-2GE-PWR" ||
      topo.TOPO_TYPE_ID == "11_ISCOM2608G-2GE"
    ) {
      this.icon = `nt-26xx-none`;
      this.iconMarker = "./assets/img/device/26xx.png";
    } else if (topo.TOPO_TYPE_ID == "11_ISCOM2110EA-MA") {
      this.icon = `nt-21xx-none`;
      this.iconMarker = "./assets/img/device/21xx.png";
    } else if (topo.TOPO_TYPE_ID == "11_ISCOM2828F-C") {
      this.icon = `nt-default-none`;
      this.iconMarker = "./assets/img/device/default.png";
    } else {
      if (topo.RES_TYPE_NAME == "NE") {
        this.icon = `nt-other-none`;
        this.iconMarker = "./assets/img/device/OTHER.png";
      } else {
        if (topo.RES_TYPE_NAME == "CHASSIS") {
          this.icon = `nt-chassis-none`;
          this.iconMarker = "./assets/img/none/chassis-01.png";
        } else {
          this.icon = `nt-rack-none`;
          this.iconMarker = "./assets/img/none/rack-01.png";
        }
      }
    }
  }

  add_topo_staging(topo) {
    let icon = "";

    this.icontopo(topo);
    let haschildren = topo.haschildren == "TRUE" ? true : false;
    this.topology_staging.push({
      key: topo.SYMBOL_ID,
      label: topo.SYMBOL_NAME1,
      data: {
        tree_parent_id: topo.TREE_PARENT_ID,
        res_id: topo.RES_ID,
        type: topo.RES_TYPE_NAME,
        description: topo.SYMBOL_NAME3,
        latitude: topo.latitude,
        longitude: topo.longitude,
        topo_icon: topo.topo_icon,
        icon: topo.icon,
        ircType: topo.ircType
      },
      type: topo.RES_TYPE_NAME,
      expandedIcon: this.icon,
      collapsedIcon: this.icon,
      leaf: !haschildren,
      children: []
    });
  }
  async add_subtopoRCviewMap(element, topo, key) {
    this.listParent = "RCview";
    this.icontopo(topo);
    let haschildren = topo.haschildren == "TRUE" ? true : false;

    await element.children.push({
      key: topo.SYMBOL_ID,
      label: topo.SYMBOL_NAME1,
      data: {
        tree_parent_id: topo.TREE_PARENT_ID,
        res_id: topo.RES_ID,
        type: topo.RES_TYPE_NAME,
        description: topo.SYMBOL_NAME3,
        latitude: topo.latitude,
        longitude: topo.longitude,
        topo_icon: topo.topo_icon,
        icon: topo.icon,
        ircType: topo.ircType,
        ISPINGOK: topo.ISPINGOK,
        ipaddress: topo.ipaddress
      },
      type: topo.RES_TYPE_NAME,
      expandedIcon: this.icon,
      collapsedIcon: this.icon,
      leaf: !haschildren,
      children: []
    });
    if (element.label == "RCview") {
      this.mainTree[1] = element;
      this.mainTree[1].expanded = true;
    }
    var list = this.mainTree[1].children.findIndex(data => data.key == key);
    if (list != -1) {
      this.mainTree[1].children[list].expanded = true;
      this.mainTree[1].children[list].parent = "RCview";
      this.nodeExpandMainMap2(this.mainTree[1].children[list], key);
    }
  }
  async add_subtopoNview(element, topo) {
    this.listParent = "Nview";
    let icon = "";
    this.icontopo(topo);
    // if (topo.topo_icon) {
    //   icon = `nt-${topo.topo_icon}`;
    //   icon = topo.ISPINGOK ? icon : `${icon} nt-alarm`;
    // } else {
    //   icon = "nt-alert nt-alarm";
    // }
    let haschildren = topo.haschildren == "TRUE" ? true : false;
    await element.children.push({
      key: topo.SYMBOL_ID,
      label: topo.SYMBOL_NAME1,
      data: {
        tree_parent_id: topo.TREE_PARENT_ID,
        res_id: topo.RES_ID,
        type: topo.RES_TYPE_NAME,
        description: topo.SYMBOL_NAME3,
        latitude: topo.latitude,
        longitude: topo.longitude,
        topo_icon: topo.topo_icon,
        icon: topo.icon,
        ircType: topo.ircType,
        ISPINGOK: topo.ISPINGOK,
        ipaddress: topo.ipaddress
      },
      type: topo.RES_TYPE_NAME,
      expandedIcon: this.icon,
      collapsedIcon: this.icon,
      leaf: !haschildren,
      children: []
    });
  }
  add_subtopoRCview(element, topo) {
    this.listParent = "RCview";
    this.icontopo(topo);
    let haschildren = topo.haschildren == "TRUE" ? true : false;

    element.children.push({
      key: topo.SYMBOL_ID,
      label: topo.SYMBOL_NAME1,
      data: {
        tree_parent_id: topo.TREE_PARENT_ID,
        res_id: topo.RES_ID,
        type: topo.RES_TYPE_NAME,
        description: topo.SYMBOL_NAME3,
        latitude: topo.latitude,
        longitude: topo.longitude,
        topo_icon: topo.topo_icon,
        icon: topo.icon,
        ircType: topo.ircType,
        ISPINGOK: topo.ISPINGOK,
        ipaddress: topo.ipaddress
      },
      type: topo.RES_TYPE_NAME,
      expandedIcon: this.icon,
      collapsedIcon: this.icon,
      leaf: !haschildren,
      children: []
    });
  }
  async add_subtopoNviewMap(element, topo, key) {
    this.listParent = "Nview";
    let icon = "";
    this.icontopo(topo);
    let haschildren = topo.haschildren == "TRUE" ? true : false;
    await element.children.push({
      key: topo.SYMBOL_ID,
      label: topo.SYMBOL_NAME1,
      data: {
        tree_parent_id: topo.TREE_PARENT_ID,
        res_id: topo.RES_ID,
        type: topo.RES_TYPE_NAME,
        description: topo.SYMBOL_NAME3,
        latitude: topo.latitude,
        longitude: topo.longitude,
        topo_icon: topo.topo_icon,
        icon: topo.icon,
        ircType: topo.ircType,
        ISPINGOK: topo.ISPINGOK,
        ipaddress: topo.ipaddress
      },
      type: topo.RES_TYPE_NAME,
      expandedIcon: this.icon,
      collapsedIcon: this.icon,
      leaf: !haschildren,
      children: []
    });

    if (element.label == "Nview") {
      this.mainTree[0] = element;
      this.mainTree[0].expanded = true;
    }
    var list = this.mainTree[0].children.findIndex(data => data.key == key);
    if (list != -1) {
      this.mainTree[0].children[list].expanded = true;
      this.mainTree[0].children[list].parent = "Nview";
      this.nodeExpandMainMap2(this.mainTree[0].children[list], key);
    }
  }
  add_subtopo(element, topo) {
    let icon = "";
    this.icontopo(topo);
    let haschildren = topo.haschildren == "TRUE" ? true : false;
    element.children.push({
      key: topo.SYMBOL_ID,
      label: topo.SYMBOL_NAME1,
      data: {
        tree_parent_id: topo.TREE_PARENT_ID,
        res_id: topo.RES_ID,
        type: topo.RES_TYPE_NAME,
        description: topo.SYMBOL_NAME3,
        latitude: topo.latitude,
        longitude: topo.longitude,
        topo_icon: topo.topo_icon,
        icon: topo.icon,
        ircType: topo.ircType,
        ISPINGOK: topo.ISPINGOK,
        ipaddress: topo.ipaddress
      },
      type: topo.RES_TYPE_NAME,
      expandedIcon: this.icon,
      collapsedIcon: this.icon,
      leaf: !haschildren,
      children: []
    });
  }
  add_subtopo_staging(element, topo) {
    let icon = "";
    this.icontopo(topo);
    let haschildren = topo.haschildren == "TRUE" ? true : false;

    element.children.push({
      key: topo.SYMBOL_ID,
      label: topo.SYMBOL_NAME1,
      data: {
        tree_parent_id: topo.TREE_PARENT_ID,
        res_id: topo.RES_ID,
        type: topo.RES_TYPE_NAME,
        description: topo.SYMBOL_NAME3,
        latitude: topo.latitude,
        longitude: topo.longitude,
        topo_icon: topo.topo_icon,
        icon: topo.icon,
        ircType: topo.ircType,
        ISPINGOK: topo.ISPINGOK,
        ipaddress: topo.ipaddress
      },
      type: topo.RES_TYPE_NAME,
      expandedIcon: this.icon,
      collapsedIcon: this.icon,
      leaf: !haschildren,
      children: []
    });
  }

  //----------------dailog-----------------------

  iconSettingDialog: boolean = false;

  selectedMapIcon: any;
  selectedtopoIcon: string;
  icondata = { latitude: null, longitude: null };

  mapIcon = [
    { id: 1, icon_name: "server", icon_path: "/symbol/server.gif" },
    { id: 2, icon_name: "city", icon_path: "/symbol/city.gif" },
    { id: 3, icon_name: "switch", icon_path: "/device/iscomrax.gif" }
  ];

  topoIcon = ["server", "switch", "city"];

  openSettingDialog() {
    this.iconSettingDialog = true;
  }
  hidecontextFunc: any;
  showClear: boolean = false;
  onContextMenu(event, selectedNode) {
    let device_throughput = ["ISCOM-RAX711", "ISCOM-RAX711B", "RAX711-C"];
    // this.contextItems = [];
    if (
      selectedNode.label != "Nview" &&
      selectedNode.label != "RCview" &&
      selectedNode.label != "Other"
    ) {
      this.contextItems = [];
      this.contextItems.push({
        label: "Coordinates setting",
        icon: "pi pi-map-marker",
        command: event => {
          if (
            this.selectedNode.data.icon == "1" &&
            this.selectedNode.data.latitude != null &&
            this.selectedNode.data.latitude != null
          ) {
            this.selectedMapIcon = this.mapIcon[0];
            this.showClear = true;
          } else if (
            this.selectedNode.data.icon == "2" &&
            this.selectedNode.data.latitude != null &&
            this.selectedNode.data.latitude != null
          ) {
            this.selectedMapIcon = this.mapIcon[1];
            this.showClear = true;
          } else if (
            this.selectedNode.data.icon == "3" &&
            this.selectedNode.data.latitude != null &&
            this.selectedNode.data.latitude != null
          ) {
            this.selectedMapIcon = this.mapIcon[2];
            this.showClear = true;
          } else {
            this.selectedMapIcon = [];
            this.showClear = false;
          }
          // this.selectedMapIcon = this.selectedNode.data.icon_id;
          this.selectedtopoIcon = this.selectedNode.data.topo_icon;
          this.icondata.latitude = this.selectedNode.data.latitude;
          this.icondata.longitude = this.selectedNode.data.longitude;
          this.openSettingDialog();
        }
      });

      // if (this.selectedNode.data.longitude || this.selectedNode.data.latitude) {
      //   this.contextItems.push({
      //     label: "View on map",
      //     icon: "pi pi-map",
      //     command: event => {
      //       this.navigator.navigateToTopologyMap(
      //         this.selectedNode.data.tree_parent_id,
      //         this.selectedNode.data.latitude,
      //         this.selectedNode.data.longitude
      //       );
      //     }
      //   });
      // }
    } else {
      this.contextItems = [];
      this.contextItems = [
        {
          label: "Collapse",
          icon: "pi pi-search-minus",
          command: event => {
            this.collapseAll();
          }
        }
      ];
    }
  }

  seveSetting() {
    this.submitted = true;
    this.toposervice
      .setTopoInformation(
        this.selectedNode.key,
        this.icondata.latitude,
        this.icondata.longitude,
        "",
        ""
      )
      .subscribe(
        result => {
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: "Setting complete",
            life: 3000
          });
          this.hideDialog();
        },
        error => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Setting error",
            life: 3000
          });
        }
      );
  }

  hideDialog() {
    this.iconSettingDialog = false;
    this.action_Dialog = false;
    this.submitted = false;
    this.action_result = "";
    this.selectedMapIcon = [];
    this.selectedNode = undefined;
    this.showClear = false;
  }
  //  --- map function ---
  initOverlays() {
    if (!this.overlays || !this.overlays.length) {
      this.overlays = this.defualt_overlays.slice();
    }
  }
  firstClick: boolean = false;
  selectTree: any[] = [];
  selectTreeSub: any[] = [];
  async handleOverlayClick(event) {
    let isMarker = event.overlay.getTitle != undefined;
    if (this.searchvlan == false) {
      if (isMarker) {
        event.map.setCenter(event.overlay.getPosition());
        if (event.overlay.data.type == "NE") {
          this.AdminLayoutService.sideiconClass("devicelist");
          this.AdminLayoutService.addOrderBox("/device");
          if (event.overlay.data.ipaddress != null) {
            this.router.navigate(["/device"], {
              queryParams: {
                ID: event.overlay.data.device_id,
                IRCNETypeID: event.overlay.data.ircType,
                IPadress: event.overlay.data.ipaddress
              }
            });
          }
        } else {
          var node;
          this.fetchNodeWithLink(event.overlay.id, event.overlay.data.parent);

          if (event.overlay.data.parent == "Nview") {
            node = {
              node: {
                children: [],
                label: "Nview",
                leaf: false,
                parent: undefined
              }
            };
          } else if (event.overlay.data.parent == "RCview") {
            node = {
              node: {
                children: [],
                label: "RCview",
                leaf: false,
                parent: undefined
              }
            };
          }
          if (this.eventNode.length == 0 && this.eventNodeRC.length == 0) {
            if (this.firstClick == false) {
              this.nodeExpandMainMap(node, event.overlay.id);
              this.firstClick = true;
            } else {
              this.selectTree = [];
              this.selectTreeSub = [];

              await this.mainTree[0].children.forEach(async data => {
                if (data.children.length != 0) {
                  await data.children.forEach(async node => {
                    if (node.key == event.overlay.id) {
                      node.expanded = true;
                      await this.nodeExpandMainMap2(node, event.overlay.id);
                    }
                    if (node.children.length != 0) {
                      await node.children.forEach(async nodes => {
                        if (nodes.key == event.overlay.id) {
                          nodes.expanded = true;
                          await this.nodeExpandMainMap2(
                            nodes,
                            event.overlay.id
                          );
                        }
                        if (nodes.children.length != 0) {
                          await nodes.children.forEach(async nodesx => {
                            if (nodesx.key == event.overlay.id) {
                              nodesx.expanded = true;
                              await this.nodeExpandMainMap2(
                                nodesx,
                                event.overlay.id
                              );
                            }
                            if (nodesx.children.length != 0) {
                              await nodesx.children.forEach(async nodesI => {
                                if (nodesI.key == event.overlay.id) {
                                  nodesI.expanded = true;
                                  await this.nodeExpandMainMap2(
                                    nodesI,
                                    event.overlay.id
                                  );
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
              await this.mainTree[1].children.forEach(async data => {
                if (data.children.length != 0) {
                  await data.children.forEach(async node => {
                    if (node.key == event.overlay.id) {
                      node.expanded = true;
                      await this.nodeExpandMainMap2(node, event.overlay.id);
                    }
                    if (node.children.length != 0) {
                      await node.children.forEach(async nodes => {
                        if (nodes.key == event.overlay.id) {
                          nodes.expanded = true;
                          await this.nodeExpandMainMap2(
                            nodes,
                            event.overlay.id
                          );
                        }
                        if (nodes.children.length != 0) {
                          await nodes.children.forEach(async nodesx => {
                            if (nodesx.key == event.overlay.id) {
                              nodesx.expanded = true;
                              await this.nodeExpandMainMap2(
                                nodesx,
                                event.overlay.id
                              );
                            }
                            if (nodesx.children.length != 0) {
                              await nodesx.children.forEach(async nodesI => {
                                if (nodesI.key == event.overlay.id) {
                                  nodesI.expanded = true;
                                  await this.nodeExpandMainMap2(
                                    nodesI,
                                    event.overlay.id
                                  );
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
              // if (list != -1){
              //   this.mainTree[0].children[list].expanded = true;
              //   this.nodeExpandMainMap2(this.mainTree[0].children[list],event.overlay.id)
              // }
            }
          } else {
            await this.mainTree[0].children.forEach(async data => {
              if (data.children.length != 0) {
                await data.children.forEach(async node => {
                  if (node.key == event.overlay.id) {
                    node.expanded = true;
                    await this.nodeExpandMainMap2(node, event.overlay.id);
                  }
                  if (node.children.length != 0) {
                    await node.children.forEach(async nodes => {
                      if (nodes.key == event.overlay.id) {
                        nodes.expanded = true;
                        await this.nodeExpandMainMap2(nodes, event.overlay.id);
                      }
                      if (nodes.children.length != 0) {
                        await nodes.children.forEach(async nodesx => {
                          if (nodesx.key == event.overlay.id) {
                            nodesx.expanded = true;
                            await this.nodeExpandMainMap2(
                              nodesx,
                              event.overlay.id
                            );
                          }
                          if (nodesx.children.length != 0) {
                            await nodesx.children.forEach(async nodesI => {
                              if (nodesI.key == event.overlay.id) {
                                nodesI.expanded = true;
                                await this.nodeExpandMainMap2(
                                  nodesI,
                                  event.overlay.id
                                );
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
            await this.mainTree[1].children.forEach(async data => {
              if (data.children.length != 0) {
                await data.children.forEach(async node => {
                  if (node.key == event.overlay.id) {
                    node.expanded = true;
                    // await this.nodeExpandMainMap2(node, event.overlay.id);
                  }
                  if (node.children.length != 0) {
                    await node.children.forEach(async nodes => {
                      if (nodes.key == event.overlay.id) {
                        nodes.expanded = true;
                        await this.nodeExpandMainMap2(nodes, event.overlay.id);
                      }
                      if (nodes.children.length != 0) {
                        await nodes.children.forEach(async nodesx => {
                          if (nodesx.key == event.overlay.id) {
                            nodesx.expanded = true;
                            await this.nodeExpandMainMap2(
                              nodesx,
                              event.overlay.id
                            );
                          }
                          if (nodesx.children.length != 0) {
                            await nodesx.children.forEach(async nodesI => {
                              if (nodesI.key == event.overlay.id) {
                                nodesI.expanded = true;
                                await this.nodeExpandMainMap2(
                                  nodesI,
                                  event.overlay.id
                                );
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
          this.toposervice
            .get_topo_information(event.overlay.id)
            .subscribe(makers => {
              if (makers.node.length > 0) {
                this.add_breadcrumb_itemS({
                  id: event.overlay.id,
                  center: event.overlay.getPosition(),
                  label: event.overlay.data.title,
                  command: event => {
                    this.breadcrumb_clicks(event);
                  }
                });
              }
              if (makers.rc_node.length > 0) {
                this.add_breadcrumb_itemS({
                  id: event.overlay.id,
                  center: event.overlay.getPosition(),
                  label: event.overlay.data.title,
                  command: event => {
                    this.breadcrumb_clicks(event);
                  }
                });
              }
            });
        }
      }
    }
  }
  eventNode: any[] = [];
  eventNodeRC: any[] = [];
  nodeClick(event, makers) {
    let isMarker = event.node.label != undefined;
    if (isMarker) {
      // event.map.setCenter(event.node.getPosition());
      if (event.node.data.type == "NE") {
        this.AdminLayoutService.sideiconClass("devicelist");
        this.AdminLayoutService.addOrderBox("/device");
        if (event.node.data.ipaddress != null) {
          this.router.navigate(["/device"], {
            queryParams: {
              ID: event.node.data.device_id,
              IRCNETypeID: event.node.data.ircType,
              IPadress: event.node.data.ipaddress
            }
          });
        }
      } else {
        if (makers.node.length > 0) {
          this.nodesub.push(makers.node);
          this.link_Oninit = makers.link;
          this.setOverlay(makers.node, makers.link, "Nview");
          if (event.node.parent != undefined) {
            this.eventNode.push(event.node);
            this.add_breadcrumb_itemS({
              id: event.node.key,
              // center: event.node.getPosition(),
              label: event.node.label,
              parent: event.node.parent.label,
              node: event.node,
              command: event => {
                this.breadcrumb_clicks(event);
              }
            });
          } else {
            this.eventNode.push(event.node);
            this.add_breadcrumb_itemS({
              id: event.node.key,
              label: event.node.label,
              parent: event.node.parent,
              node: event.node,
              command: event => {
                this.breadcrumb_clicks(event);
              }
            });
          }
        } else {
        }
      }
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Shape Selected",
        detail: ""
      });
    }
  }
  nodeClickRcview(event, makers) {
    let isMarker = event.node.label != undefined;

    if (isMarker) {
      if (event.node.data.type == "NE") {
        this.AdminLayoutService.sideiconClass("devicelist");
        this.AdminLayoutService.addOrderBox("/device");
        if (event.node.data.ipaddress != null) {
          this.router.navigate(["/device"], {
            queryParams: {
              ID: event.node.data.device_id,
              IRCNETypeID: event.node.data.ircType,
              IPadress: event.node.data.ipaddress
            }
          });
        }
      } else {
        if (makers.rc_node.length > 0) {
          this.nodesub.push(makers.rc_node);
          makers.rc_link = [];
          this.link_Oninit = makers.rc_link;
          this.setOverlay(makers.rc_node, makers.rc_link, "RCview");
          if (event.node.parent != undefined) {
            this.eventNodeRC.push(event.node);
            this.add_breadcrumb_itemS({
              id: event.node.key,
              label: event.node.label,
              parent: event.node.parent.label,
              node: event.node,
              command: event => {
                this.breadcrumb_clicks(event);
              }
            });
          } else {
            this.eventNodeRC.push(event.node);
            this.add_breadcrumb_itemS({
              id: event.node.key,
              label: event.node.label,
              parent: event.node.parent,
              node: event.node,
              command: event => {
                this.breadcrumb_clicks(event);
              }
            });
          }
        } else {
        }
      }
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Shape Selected",
        detail: ""
      });
    }
  }
  nodeClick2(image, makers) {
    if (this.listimgfind.length > 1) {
      var listcheck = this.images[this.current_shape_index + 1];
      let isMarkers = listcheck.name != undefined;
      if (isMarkers) {
        if (listcheck.type == "NE") {
          this.AdminLayoutService.sideiconClass("devicelist");
          this.AdminLayoutService.addOrderBox("/device");
          if (listcheck.ipaddress != null) {
            this.router.navigate(["/device"], {
              queryParams: {
                ID: listcheck.id,
                IRCNETypeID: listcheck.ircType,
                IPadress: listcheck.ipaddress
              }
            });
          }
        } else {
          this.nodesub.push(makers.node);
          if (makers.node.length > 0) {
            makers.link = [];
            this.link_Oninit = makers.link;
            this.setOverlay(makers.node, makers.link, "Nview");
            this.add_breadcrumb_itemS({
              id: listcheck.id,
              label: listcheck.name,
              command: event => {
                this.breadcrumb_clicks(event);
              }
            });
          } else {
          }
        }
      } else {
        this.messageService.add({
          severity: "info",
          summary: "Shape Selected",
          detail: ""
        });
      }
    }
    if (this.listimgfind.length < 2) {
      let isMarker = this.images[this.current_shape_index].name != undefined;

      if (isMarker) {
        if (this.images[this.current_shape_index].type == "NE") {
          this.AdminLayoutService.sideiconClass("devicelist");
          this.AdminLayoutService.addOrderBox("/device");
          if (this.images[this.current_shape_index].ipaddress != null) {
            this.router.navigate(["/device"], {
              queryParams: {
                ID: this.images[this.current_shape_index].id,
                IRCNETypeID: this.images[this.current_shape_index].ircType,
                IPadress: this.images[this.current_shape_index].ipaddress
              }
            });
          }
        } else {
          this.nodesub.push(makers.node);
          if (makers.node.length > 0) {
            makers.link = [];
            this.link_Oninit = makers.link;
            this.setOverlay(makers.node, makers.link, "Nview");
            this.add_breadcrumb_itemS({
              id: this.images[this.current_shape_index].id,
              label: this.images[this.current_shape_index].name,
              command: event => {
                this.breadcrumb_clicks(event);
              }
            });
          } else {
          }
        }
      } else {
        this.messageService.add({
          severity: "info",
          summary: "Shape Selected",
          detail: ""
        });
      }
    }
  }

  openDailog() {
    this.submitted = false;
    this.action_Dialog = true;
  }

  get_cpu_load() {
    this.submitted = true;
    this.toposervice
      .get_CPU_Load(this.ip, this.username, this.password)
      .then(Object => {
        this.action_result = Object.result;
        this.submitted = false;
      });
  }

  get_memory() {
    this.submitted = true;
    this.toposervice
      .get_Memory(this.ip, this.username, this.password)
      .then(Object => {
        this.action_result = Object.result;
        this.submitted = false;
      });
  }

  async area_expand(marker_overlay) {
    let marker_id = marker_overlay.id;
    let overlays_from_service = await this.toposervice.get_topo_information(
      marker_id
    );
    overlays_from_service.forEach(element => {
      this.overlays.push(element.node);
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
  async createBorderedIcon(
    iconUrl,
    borderColor,
    borderWidth,
    iconWidth,
    iconHeight
  ) {
    return new Promise(resolve => {
      // Create an image element
      const img = new Image();

      // When the image is loaded
      img.onload = () => {
        // Create a canvas element
        const canvas = document.createElement("canvas");
        canvas.width = iconWidth;
        canvas.height = iconHeight;
        const context = canvas.getContext("2d");

        // Draw the image onto the canvas
        context.drawImage(img, 0, 0, iconWidth, iconHeight);

        // Draw the border around the image
        context.strokeStyle = borderColor;
        context.lineWidth = borderWidth;
        context.strokeRect(0, 0, iconWidth, iconHeight);

        // Resolve with the data URL of the canvas
        resolve(canvas.toDataURL());
      };

      // Set the source of the image
      img.src = iconUrl;
    });
  }

  async reset_map() {
    this.newVariable = [];
    this.breadcrumb_items = [];
    this.overlays = [];
    this.arrlist = [];
    this.nodesub = [];
    var tree_parent_topo = 0;
    var map_center = { lat: 13.72672065693991, lng: 100.51438137260944 };
    this.map.setCenter(map_center);
    this.images = [];
    this.listimgfind = [];
    this.listexpand = [];
    this.firsttimeload = false;
    this.fetchNodeWithLink(tree_parent_topo, "Nview");
    this.toposervice.get_topo_information(tree_parent_topo).subscribe({
      next: markers => {
        let marker_show_temp = 0;
        let marker_should_show_temp = 0;
        markers.node.forEach(async marker => {
          marker_should_show_temp++;
          if (marker.latitude && marker.longitude) {
            this.overlays = [];
            marker_show_temp++;
            await this.icontopo(marker);
            const iconUrl = this.iconMarker; // URL of the icon image
            const borderColor = "#78909c"; // Color of the border
            const borderWidth = 3; // Width of the border
            const iconWidth = 32; // Width of the icon
            const iconHeight = 32; // Height of the icon

            // Create the custom icon with a border
            const borderedIcon = await this.createBorderedIcon(
              iconUrl,
              borderColor,
              borderWidth,
              iconWidth,
              iconHeight
            );

            // Use the custom icon for the marker
            const icon = {
              url: borderedIcon, // URL of the custom icon
              scaledSize: new google.maps.Size(iconWidth, iconHeight) // Scaled size of the icon
            };
            let overlay_temp = new google.maps.Marker({
              position: { lat: marker.latitude, lng: marker.longitude },
              title: marker.SYMBOL_NAME1,
              icon: icon,
              id: marker.SYMBOL_ID,
              data: {
                type: marker.RES_TYPE_NAME,
                device_id: marker.RES_ID,
                ircType: marker.ircType,
                ipaddress: marker.ipaddress,
                title: marker.SYMBOL_NAME1,
                parent: "Nview"
              }
            });

            overlay_temp.addListener("contextmenu", e => {
              this.markerIDSelected = marker.SYMBOL_ID;
              if (marker.RES_TYPE_NAME == "NE") {
                this.cm2.show(e.domEvent);
              }
            });
            this.overlays.push(overlay_temp);
          }
        });

        this.link_Oninit = markers.link;
        markers.link.forEach(link => {
          let overlay_temp = new google.maps.Polyline({
            path: [
              { lat: link.latitude_1, lng: link.longitude_1 },
              { lat: link.latitude_2, lng: link.longitude_2 }
            ],
            geodesic: true,
            strokeColor: "rgba(0, 255, 0, 0.7)",
            strokeOpacity: 1,
            strokeWeight: 5,
            link_id: link.LINK_SYMBOL_ID
          });
          this.overlays.push(overlay_temp);
        });
        // this.initOverlays();
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
  reset_maps() {
    this.newVariable = [];
    this.breadcrumb_items = [];
    // this.overlays = [];
    this.arrlist = [];
    this.nodesub = [];
    var tree_parent_topo = 0;
    var map_center = { lat: 13.72672065693991, lng: 100.51438137260944 };
    this.map.setCenter(map_center);
    this.images = [];
    this.listimgfind = [];
    this.listexpand = [];
    this.firsttimeload = false;
    this.fetchNodeWithLink(tree_parent_topo, "Nview");
    // this.toposervice.get_topo_information(tree_parent_topo).subscribe({
    //   next: markers => {
    //     let marker_show_temp = 0;
    //     let marker_should_show_temp = 0;
    //     markers.node.forEach(marker => {
    //       marker_should_show_temp++;
    //       if (marker.latitude && marker.longitude) {
    //         marker_show_temp++;
    //         let overlay_temp = new google.maps.Marker({
    //           position: { lat: marker.latitude, lng: marker.longitude },
    //           title: marker.title,
    //           icon: marker.icon_path
    //             ? this.toposervice.icon_path + marker.icon_path
    //             : this.toposervice.defualt_icon_path,
    //           id: marker.SYMBOL_ID,
    //           data: {
    //             type: marker.RES_TYPE_NAME,
    //             device_id: marker.RES_ID,
    //             ircType: marker.ircType,
    //             ipaddress: marker.ipaddress,
    //             title: marker.SYMBOL_NAME1
    //           }
    //         });

    //         overlay_temp.addListener("contextmenu", e => {
    //           this.markerIDSelected = marker.SYMBOL_ID;
    //           this.cm2.show(e.domEvent);

    //         });
    //         this.overlays.push(overlay_temp);
    //       }
    //     });

    //     this.link_Oninit = markers.link;
    //     markers.link.forEach(link => {
    //       let overlay_temp = new google.maps.Polyline({
    //         path: [
    //           { lat: link.latitude_1, lng: link.longitude_1 },
    //           { lat: link.latitude_2, lng: link.longitude_2 }
    //         ],
    //         geodesic: true,
    //         strokeColor: "#5CED73",
    //         strokeOpacity: 1,
    //         strokeWeight: 5,
    //         link_id: link.LINK_SYMBOL_ID
    //       });
    //       this.overlays.push(overlay_temp);
    //     });
    //     this.initOverlays();
    //     this.marker_show = marker_show_temp;
    //     this.defualt_marker_show = marker_show_temp;
    //     this.defualt_marker_should_show = marker_should_show_temp;
    //     this.marker_should_show = marker_should_show_temp;
    //   },
    //   error: error => {
    //     if (error.status == 401) {
    //       this.messageService.add({
    //         severity: "error",
    //         summary: "Error",
    //         detail: "Session expired, please logout and login again."
    //       });
    //     }
    //   }
    // });
  }
  async reset_mapRCview() {
    this.newVariable = [];
    this.breadcrumb_items = [];
    this.overlays = [];
    this.arrlist = [];
    this.nodesub = [];

    var tree_parent_topo = 0;
    var map_center = { lat: 13.72672065693991, lng: 100.51438137260944 };
    this.map.setCenter(map_center);
    this.images = [];
    this.listimgfind = [];
    this.listexpand = [];
    this.fetchNodeWithLink(tree_parent_topo, "RCview");
    this.toposervice.get_topo_information(tree_parent_topo).subscribe({
      next: markers => {
        let marker_show_temp = 0;
        let marker_should_show_temp = 0;
        markers.rc_node.forEach(async marker => {
          marker_should_show_temp++;
          if (marker.latitude && marker.longitude) {
            marker_show_temp++;
            await this.icontopo(marker);
            const iconUrl = this.iconMarker; // URL of the icon image
            const borderColor = "#78909c"; // Color of the border
            const borderWidth = 3; // Width of the border
            const iconWidth = 32; // Width of the icon
            const iconHeight = 32; // Height of the icon

            // Create the custom icon with a border
            const borderedIcon = await this.createBorderedIcon(
              iconUrl,
              borderColor,
              borderWidth,
              iconWidth,
              iconHeight
            );

            // Use the custom icon for the marker
            const icon = {
              url: borderedIcon, // URL of the custom icon
              scaledSize: new google.maps.Size(iconWidth, iconHeight) // Scaled size of the icon
            };
            let overlay_temp = new google.maps.Marker({
              position: { lat: marker.latitude, lng: marker.longitude },
              title: marker.SYMBOL_NAME1,
              icon: icon,
              id: marker.SYMBOL_ID,
              data: {
                type: marker.RES_TYPE_NAME,
                device_id: marker.RES_ID,
                ircType: marker.ircType,
                ipaddress: marker.ipaddress
              }
            });
            overlay_temp.addListener("contextmenu", e => {
              this.markerIDSelected = marker.SYMBOL_ID;
              if (marker.RES_TYPE_NAME == "NE") {
                this.cm2.show(e.domEvent);
              }
            });
            this.overlays.push(overlay_temp);
          }
        });

        this.link_Oninit = markers.rc_link;
        markers.rc_link.forEach(link => {
          let overlay_temp = new google.maps.Polyline({
            path: [
              { lat: link.latitude_1, lng: link.longitude_1 },
              { lat: link.latitude_2, lng: link.longitude_2 }
            ],
            geodesic: true,
            strokeColor: "rgba(0, 255, 0, 0.7)",
            strokeOpacity: 1,
            strokeWeight: 5,
            link_id: link.LINK_SYMBOL_ID
          });
          this.overlays.push(overlay_temp);
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
    this.breadcrumb_items = Array.from(this.breadcrumb_items);
    this.breadcrumb_items.push(item);
  }

  async add_breadcrumb_itemS(item: object) {
    this.breadcrumb_items = [...this.breadcrumb_items, item];
    this.arr = this.breadcrumb_items;

    this.arr.forEach(value => {
      this.valueID = value.id;
      var findlist = this.parent.filter(data => data.RES_ID == value.id);
      if (findlist.length != 0) {
        if (this.arr[0].id != findlist[0].SYMBOL_ID) {
          var index = this.breadcrumb_items.length - 1;
          if (this.eventNode.length != 0) {
            this.eventNode[0].expanded = false;
            this.eventNode = this.eventNode.splice(index, 1);
          } else if (this.eventNodeRC.length != 0) {
            this.eventNodeRC[0].expanded = false;
            this.eventNodeRC = this.eventNodeRC.splice(index, 1);
          }

          this.breadcrumb_items = this.breadcrumb_items.splice(index, 1);
          this.arr = this.breadcrumb_items;
        }
      }
    });
    if (this.eventNode.length != 0) {
      if (this.breadcrumb_items.length > 2) {
        var index1 = this.breadcrumb_items.length - 2;
        var index2 = this.breadcrumb_items.length - 1;
        var index3 = this.breadcrumb_items.length - 3;
        var index4 = this.breadcrumb_items.length - 4;
        if (this.arr[index1].parent == this.arr[index2].parent) {
          if (this.breadcrumb_items.length < 4) {
            this.eventNode[index1].expanded = false;
            this.eventNode = this.eventNode.filter(
              data =>
                data.parent.label == "Nview" ||
                data.parent.label == "RCview" ||
                data.label != this.eventNode[index1].label
            );
            this.breadcrumb_items = this.eventNode.filter(
              data =>
                data.parent.label == "Nview" ||
                data.parent.label == "RCview" ||
                data.label == this.eventNode[index1].label
            );
            this.arr = this.breadcrumb_items;
          } else {
            this.eventNode[index1].expanded = false;

            this.eventNode = this.eventNode.filter(
              data =>
                data.parent == "Nview" ||
                data.parent == "RCview" ||
                data.label != this.eventNode[index1].label
            );
            this.breadcrumb_items = this.arr.filter(
              data =>
                data.parent == "Nview" ||
                data.parent == "RCview" ||
                data.parent == this.eventNode[0].label ||
                data.label == this.eventNode[index1].label
            );

            this.arr = this.breadcrumb_items;
          }
        } else {
          if (this.breadcrumb_items.length > 3) {
            if (this.arr[index1].parent == this.arr[index2].parent) {
              this.eventNode[index3].expanded = false;
              this.eventNode = this.eventNode.filter(
                data =>
                  data.parent.label == "Nview" ||
                  data.parent.label == "RCview" ||
                  data.label == this.eventNode[index2].label
              );
              this.breadcrumb_items = this.arr.filter(
                data =>
                  data.parent.label == "Nview" ||
                  data.parent.label == "RCview" ||
                  data.label == this.eventNode[1].label
              );
              this.arr = this.breadcrumb_items;
            } else {
              if (this.arr.length > 4) {
                if (this.arr[index2].parent == this.arr[index3].parent) {
                  this.eventNode[index3].expanded = false;
                  this.eventNode = this.eventNode.filter(
                    data =>
                      data.parent.label == "Nview" ||
                      data.parent.label == "RCview" ||
                      data.label == this.eventNode[index4].label ||
                      data.label == this.eventNode[index2].label
                  );
                  this.breadcrumb_items = this.arr.filter(
                    data =>
                      data.parent == "Nview" ||
                      data.parent == "RCview" ||
                      data.label == this.eventNode[1].label ||
                      data.label == this.eventNode[2].label
                  );
                  this.arr = this.breadcrumb_items;
                } else {
                  this.eventNode[index4].expanded = false;
                  this.eventNode = this.eventNode.filter(
                    data =>
                      data.parent.label == "Nview" ||
                      data.parent.label == "RCview" ||
                      data.label == this.eventNode[index2].label
                  );

                  this.breadcrumb_items = this.arr.filter(
                    data =>
                      data.parent == "Nview" ||
                      data.parent == "RCview" ||
                      data.label == this.eventNode[1].label
                  );
                  this.arr = this.breadcrumb_items;
                }
              } else if (this.arr.length < 4) {
                this.eventNode[index1].expanded = false;
                this.eventNode[index3].expanded = false;
                this.eventNode = this.eventNode.filter(
                  data =>
                    data.label != this.eventNode[index1].label &&
                    data.label != this.eventNode[index3].label
                );
                this.breadcrumb_items = this.arr.filter(
                  data =>
                    data.parent.label == "Nview" ||
                    data.parent.label == "RCview" ||
                    (data.parent.label == this.eventNode[0].label &&
                      data.label == this.eventNode[1].label)
                );
                this.arr = this.breadcrumb_items;
              } else {
                if (this.arr[index2].parent == this.arr[index3].parent) {
                  this.eventNode[index3].expanded = false;
                  this.eventNode = this.eventNode.filter(
                    data =>
                      data.parent.label == "Nview" ||
                      data.parent.label == "RCview" ||
                      data.label == this.eventNode[index2].label
                  );
                  this.breadcrumb_items = this.eventNode.filter(
                    data =>
                      data.parent.label == "Nview" ||
                      data.parent.label == "RCview" ||
                      data.label == this.eventNode[1].label
                  );
                  this.arr = this.breadcrumb_items;
                } else if (
                  this.arr[index2].parent == this.arr[index3].parent.label
                ) {
                  this.eventNode[1].expanded = false;
                  this.eventNode = this.eventNode.filter(
                    data =>
                      data.parent.label == "Nview" ||
                      data.parent.label == "RCview" ||
                      data.label == this.eventNode[index2].label
                  );
                  this.breadcrumb_items = this.eventNode.filter(
                    data =>
                      data.parent.label == "Nview" ||
                      data.parent.label == "RCview" ||
                      data.label == this.eventNode[1].label
                  );
                  this.arr = this.breadcrumb_items;
                }
              }
            }
          } else {
            if (this.arr[index1].parent.label == this.arr[index2].parent) {
              this.eventNode[1].expanded = false;
              this.eventNode = this.eventNode.filter(
                data =>
                  data.parent.label == "Nview" ||
                  data.parent.label == "RCview" ||
                  data.label == this.eventNode[index2].label
              );
              this.breadcrumb_items = this.arr.filter(
                data =>
                  data.parent.label == "Nview" ||
                  data.parent.label == "RCview" ||
                  data.label == this.eventNode[1].label
              );
              this.arr = this.breadcrumb_items;
            }
          }
        }
      }
    } else if (this.eventNodeRC.length != 0) {
      if (this.breadcrumb_items.length > 2) {
        var index1 = this.breadcrumb_items.length - 2;
        var index2 = this.breadcrumb_items.length - 1;
        var index3 = this.breadcrumb_items.length - 3;
        var index4 = this.breadcrumb_items.length - 4;
        if (this.arr[index1].parent == this.arr[index2].parent) {
          if (this.breadcrumb_items.length < 4) {
            this.eventNodeRC[index1].expanded = false;
            this.eventNodeRC = this.eventNodeRC.filter(
              data =>
                data.parent.label == "Nview" ||
                data.parent.label == "RCview" ||
                data.label != this.eventNodeRC[index1].label
            );
            this.breadcrumb_items = this.eventNodeRC.filter(
              data =>
                data.parent.label == "Nview" ||
                data.parent.label == "RCview" ||
                data.label == this.eventNodeRC[index1].label
            );
            this.arr = this.breadcrumb_items;
          } else {
            this.eventNodeRC[index1].expanded = false;

            this.eventNodeRC = this.eventNodeRC.filter(
              data =>
                data.parent == "Nview" ||
                data.parent == "RCview" ||
                data.label != this.eventNodeRC[index1].label
            );
            this.breadcrumb_items = this.arr.filter(
              data =>
                data.parent == "Nview" ||
                data.parent == "RCview" ||
                data.parent == this.eventNodeRC[0].label ||
                data.label == this.eventNodeRC[index1].label
            );

            this.arr = this.breadcrumb_items;
          }
        } else {
          if (this.breadcrumb_items.length > 3) {
            if (this.arr[index1].parent == this.arr[index2].parent) {
              this.eventNodeRC[index3].expanded = false;
              this.eventNodeRC = this.eventNodeRC.filter(
                data =>
                  data.parent.label == "Nview" ||
                  data.parent.label == "RCview" ||
                  data.label == this.eventNodeRC[index2].label
              );
              this.breadcrumb_items = this.arr.filter(
                data =>
                  data.parent.label == "Nview" ||
                  data.parent.label == "RCview" ||
                  data.label == this.eventNodeRC[1].label
              );
              this.arr = this.breadcrumb_items;
            } else {
              if (this.arr.length > 4) {
                if (this.arr[index2].parent == this.arr[index3].parent) {
                  this.eventNodeRC[index3].expanded = false;
                  this.eventNodeRC = this.eventNodeRC.filter(
                    data =>
                      data.parent.label == "Nview" ||
                      data.parent.label == "RCview" ||
                      data.label == this.eventNodeRC[index4].label ||
                      data.label == this.eventNodeRC[index2].label
                  );
                  this.breadcrumb_items = this.arr.filter(
                    data =>
                      data.parent == "Nview" ||
                      data.parent == "RCview" ||
                      data.label == this.eventNodeRC[1].label ||
                      data.label == this.eventNodeRC[2].label
                  );
                  this.arr = this.breadcrumb_items;
                } else {
                  this.eventNodeRC[index4].expanded = false;
                  this.eventNodeRC = this.eventNodeRC.filter(
                    data =>
                      data.parent.label == "Nview" ||
                      data.parent.label == "RCview" ||
                      data.label == this.eventNodeRC[index2].label
                  );

                  this.breadcrumb_items = this.arr.filter(
                    data =>
                      data.parent == "Nview" ||
                      data.parent == "RCview" ||
                      data.label == this.eventNodeRC[1].label
                  );
                  this.arr = this.breadcrumb_items;
                }
              } else if (this.arr.length < 4) {
                this.eventNodeRC[index1].expanded = false;
                this.eventNodeRC[index3].expanded = false;
                this.eventNodeRC = this.eventNodeRC.filter(
                  data =>
                    data.label != this.eventNodeRC[index1].label &&
                    data.label != this.eventNodeRC[index3].label
                );
                this.breadcrumb_items = this.arr.filter(
                  data =>
                    data.parent.label == "Nview" ||
                    data.parent.label == "RCview" ||
                    (data.parent.label == this.eventNodeRC[0].label &&
                      data.label == this.eventNodeRC[1].label)
                );
                this.arr = this.breadcrumb_items;
              } else {
                if (this.arr[index2].parent == this.arr[index3].parent) {
                  this.eventNodeRC[index3].expanded = false;
                  this.eventNodeRC = this.eventNodeRC.filter(
                    data =>
                      data.parent.label == "Nview" ||
                      data.parent.label == "RCview" ||
                      data.label == this.eventNodeRC[index2].label
                  );
                  this.breadcrumb_items = this.eventNodeRC.filter(
                    data =>
                      data.parent.label == "Nview" ||
                      data.parent.label == "RCview" ||
                      data.label == this.eventNodeRC[1].label
                  );
                  this.arr = this.breadcrumb_items;
                } else if (
                  this.arr[index2].parent == this.arr[index3].parent.label
                ) {
                  this.eventNodeRC[1].expanded = false;
                  this.eventNodeRC = this.eventNodeRC.filter(
                    data =>
                      data.parent.label == "Nview" ||
                      data.parent.label == "RCview" ||
                      data.label == this.eventNodeRC[index2].label
                  );
                  this.breadcrumb_items = this.eventNodeRC.filter(
                    data =>
                      data.parent.label == "Nview" ||
                      data.parent.label == "RCview" ||
                      data.label == this.eventNodeRC[1].label
                  );
                  this.arr = this.breadcrumb_items;
                }
              }
            }
          } else {
            if (this.arr[index1].parent.label == this.arr[index2].parent) {
              this.eventNodeRC[1].expanded = false;
              this.eventNodeRC = this.eventNodeRC.filter(
                data =>
                  data.parent.label == "Nview" ||
                  data.parent.label == "RCview" ||
                  data.label == this.eventNodeRC[index2].label
              );
              this.breadcrumb_items = this.arr.filter(
                data =>
                  data.parent.label == "Nview" ||
                  data.parent.label == "RCview" ||
                  data.label == this.eventNodeRC[1].label
              );
              this.arr = this.breadcrumb_items;
            }
          }
        }
      }
    }
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
    this.fetchNodeWithLink(id, event);
  }

  async breadcrumb_clicks(event) {
    this.map.setCenter(event.item.center);
    let id = event.item.id;
    let index = this.breadcrumb_items
      .map(e => {
        return e.id;
      })
      .indexOf(id);
    this.breadcrumb_items.length = index + 1;

    this.fetchNodeWithLink(id, event);
    if (this.eventNode.length != 0) {
      if (this.eventNode.length == 2) {
        if (this.eventNode[0].label == event.item.label) {
          this.eventNode[1].expanded = false;
          this.eventNode = this.eventNode.filter(
            data => data.parent == undefined
          );
        }
      }
      if (this.eventNode.length == 3) {
        if (this.eventNode[0].label == event.item.label) {
          this.eventNode[1].expanded = false;
          this.eventNode = this.eventNode.filter(
            data => data.parent == undefined
          );
        } else if (this.eventNode[1].label == event.item.label) {
          this.eventNode[2].expanded = false;
          this.eventNode = this.eventNode.filter(
            data => data.parent == undefined || data.label == event.item.label
          );
        }
      }
      if (this.eventNode.length == 4) {
        if (this.eventNode[0].label == event.item.label) {
          this.eventNode[1].expanded = false;
          this.eventNode = this.eventNode.filter(
            data => data.parent == undefined
          );
        } else if (this.eventNode[1].label == event.item.label) {
          this.eventNode[2].expanded = false;
          this.eventNode = this.eventNode.filter(
            data => data.parent == undefined || data.label == event.item.label
          );
        } else if (this.eventNode[2].label == event.item.label) {
          this.eventNode[3].expanded = false;
          this.eventNode.pop();
        }
      }
    } else if (this.eventNodeRC.length != 0) {
      if (this.eventNodeRC.length == 2) {
        if (this.eventNodeRC[0].label == event.item.label) {
          this.eventNodeRC[1].expanded = false;
          this.eventNodeRC = this.eventNodeRC.filter(
            data => data.parent == undefined
          );
        }
      }
      if (this.eventNodeRC.length == 3) {
        if (this.eventNodeRC[0].label == event.item.label) {
          this.eventNodeRC[1].expanded = false;
          this.eventNodeRC = this.eventNodeRC.filter(
            data => data.parent == undefined
          );
        } else if (this.eventNodeRC[1].label == event.item.label) {
          this.eventNodeRC[2].expanded = false;
          this.eventNodeRC = this.eventNodeRC.filter(
            data => data.parent == undefined || data.label == event.item.label
          );
        }
      }
      if (this.eventNodeRC.length == 4) {
        if (this.eventNodeRC[0].label == event.item.label) {
          this.eventNodeRC[1].expanded = false;
          this.eventNodeRC = this.eventNodeRC.filter(
            data => data.parent == undefined
          );
        } else if (this.eventNodeRC[1].label == event.item.label) {
          this.eventNodeRC[2].expanded = false;
          this.eventNodeRC = this.eventNodeRC.filter(
            data => data.parent == undefined || data.label == event.item.label
          );
        } else if (this.eventNodeRC[2].label == event.item.label) {
          this.eventNodeRC[3].expanded = false;
          this.eventNodeRC.pop();
        }
      }
    }
    this.mainTree[0].children.forEach(data => {
      if (data.children.length != 0) {
        data.children.forEach(node => {
          if (node.label != event.item.label) {
            node.expanded = false;
          }
          if (node.children.length != 0) {
            node.children.forEach(nodes => {
              if (nodes.label != event.item.label) {
                nodes.expanded = false;
              }
              if (nodes.children.length != 0) {
                nodes.children.forEach(nodesx => {
                  if (nodesx.label != event.item.label) {
                    nodesx.expanded = false;
                  }
                  if (nodesx.children.length != 0) {
                    nodesx.children.forEach(nodesI => {
                      if (nodesI.label != event.item.label) {
                        nodesI.expanded = false;
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
    this.mainTree[1].children.forEach(data => {
      if (data.children.length != 0) {
        data.children.forEach(node => {
          if (node.label != event.item.label) {
            node.expanded = false;
          }
          if (node.children.length != 0) {
            node.children.forEach(nodes => {
              if (nodes.label != event.item.label) {
                nodes.expanded = false;
              }
              if (nodes.children.length != 0) {
                nodes.children.forEach(nodesx => {
                  if (nodesx.label != event.item.label) {
                    nodesx.expanded = false;
                  }
                  if (nodesx.children.length != 0) {
                    nodesx.children.forEach(nodesI => {
                      if (nodesI.label != event.item.label) {
                        nodesI.expanded = false;
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }
  setOverlay(markers: any, links: any, parent) {
    if (markers.length > 0) {
      this.overlays = [];
      let marker_show_temp = 0;
      let marker_should_show_temp = 0;
      markers.forEach(marker => {
        marker_should_show_temp++;
        if (marker.latitude && marker.longitude) marker_show_temp++;
        this.add_marker(marker, parent);
      });
      links.forEach(link => {
        this.add_line(link);
      });
      this.marker_show = marker_show_temp;
      this.marker_should_show = marker_should_show_temp;
    }
  }
  iconMarker: any;
  async add_marker(marker: any, parent) {
    if ((marker.latitude, marker.longitude)) {
      await this.icontopo(marker);
      const iconUrl = this.iconMarker; // URL of the icon image
      const borderColor = "#78909c"; // Color of the border
      const borderWidth = 3; // Width of the border
      const iconWidth = 32; // Width of the icon
      const iconHeight = 32; // Height of the icon

      // Create the custom icon with a border
      const borderedIcon = await this.createBorderedIcon(
        iconUrl,
        borderColor,
        borderWidth,
        iconWidth,
        iconHeight
      );

      // Use the custom icon for the marker
      const icon = {
        url: borderedIcon, // URL of the custom icon
        scaledSize: new google.maps.Size(iconWidth, iconHeight) // Scaled size of the icon
      };
      let overlay_temp = new google.maps.Marker({
        position: { lat: marker.latitude, lng: marker.longitude },
        title: marker.SYMBOL_NAME1,
        icon: icon,
        id: marker.SYMBOL_ID,
        data: {
          type: marker.RES_TYPE_NAME,
          device_id: marker.RES_ID,
          ircType: marker.ircType,
          ipaddress: marker.ipaddress,
          title: marker.SYMBOL_NAME1,
          parent: parent
        }
      });

      overlay_temp.addListener("contextmenu", e => {
        if (marker.RES_TYPE_NAME == "NE") {
          if (marker.ipaddress != null) {
            this.cm2.show(e.domEvent);
            this.markerIPSelected = marker.ipaddress;
            this.markerRESSelected = marker.RES_ID;
            this.markertypeSelected = marker.ircType;
          }
        }
      });
      this.overlays.push(overlay_temp);
    }
  }

  add_line(polyline: any) {
    let overlay_temp = new google.maps.Polyline({
      path: [
        { lat: polyline.latitude_1, lng: polyline.longitude_1 },
        { lat: polyline.latitude_2, lng: polyline.longitude_2 }
      ],
      geodesic: true,
      strokeColor: "rgba(0, 255, 0, 0.7)",
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
  searchvlan: boolean = false;
  invalid_vlan: string;
  invalid_vlanname: string;
  test() {
    console.log("hi");
  }
  async searchVlan(event) {
    if (this.vlan == "") {
      this.vlan = undefined;
    }
    if (this.vlan_name != undefined) {
      if (this.vlan_name.length == 0) {
        this.vlan_name = undefined;
      }
    }
    // if (this.vlan != undefined && this.vlan != "" || this.vlan_name != undefined && this.vlan_name.length != 0){
    this.isVlanLoading = true;
    this.toposervice
      .vlan_search(this.vlan, this.vlan_name)
      .subscribe(results => {
        this.isVlanLoading = false;
        var output = [];
        this.overlays = [];
        if (results.length != 0) {
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
              let arrayicon = {
                TOPO_TYPE_ID: item.TOPO_TYPE_ID,
                ISPINGOK: item.ISPINGOK,
                NEW_CRITICAL_ALARM_COUNT: item.NEW_CRITICAL_ALARM_COUNT,
                NEW_MAJOR_ALARM_COUNT: item.NEW_MAJOR_ALARM_COUNT,
                NEW_MINOR_ALARM_COUNT: item.NEW_MINOR_ALARM_COUNT,
                NEW_WARNING_ALARM_COUNT: item.NEW_WARNING_ALARM_COUNT,
                NEW_INDETERMINATE_ALARM_COUNT:
                  item.NEW_INDETERMINATE_ALARM_COUNT
              };
              let array_item = {
                RES_ID: item.RES_ID,
                SYMBOL_ID: item.SYMBOL_ID,
                device_name: item.device_name,
                SYMBOL_NAME3: item.SYMBOL_NAME3,
                latitude: item.latitude,
                longitude: item.longitude,
                icon_path: item.icon_path,
                arrayicon: arrayicon,
                data: [
                  {
                    vlan: item.vlan,
                    vlan_name: item.vlan_name
                  }
                ]
              };
              output.push(array_item);
            }
          });

          console.dir(output);

          output.forEach(async result => {
            if ((result.latitude, result.longitude)) {
              let vlan_data = "";
              let device_name = result.device_name ? result.device_name : "";
              result.data.forEach(data => {
                vlan_data += `<tr>
                              <td style="padding-right: 20px;">${data.vlan}</td>
                              <td style="padding-left: 10px;">${data.vlan_name}</td>
                           </tr>`;
              });

              const contentString = ` <p class="m-0" style="color:black">Name: ${device_name}</p>
              <p class="m-0" style="color:black">IP: ${result.SYMBOL_NAME3}</p>
              <p id='clickableItem' style="color:blue"><u>Device detial</u></p>
              <table style="color:black">
                   <tr>
                      <th>VLAN</th>
                      <th style="padding-left: 10px;">VLAN Name</th>
                   </tr>
                  ${vlan_data}
              </table>`;

              const infowindow = new google.maps.InfoWindow({
                content: contentString
              });

              await this.icontopo(result.arrayicon);
              const iconUrl = this.iconMarker; // URL of the icon image
              const borderColor = "#78909c"; // Color of the border
              const borderWidth = 3; // Width of the border
              const iconWidth = 32; // Width of the icon
              const iconHeight = 32; // Height of the icon

              // Create the custom icon with a border
              const borderedIcon = await this.createBorderedIcon(
                iconUrl,
                borderColor,
                borderWidth,
                iconWidth,
                iconHeight
              );

              // Use the custom icon for the marker
              const icon = {
                url: borderedIcon, // URL of the custom icon
                scaledSize: new google.maps.Size(iconWidth, iconHeight) // Scaled size of the icon
              };
              const marker = new google.maps.Marker({
                position: { lat: result.latitude, lng: result.longitude },
                title: result.SUMBOL_NAME3,
                icon: icon,
                id: result.SYMBOL_ID,
                data: {
                  res_id: result.RES_ID,
                  vlan: result.vlan,
                  vlna_acces: result.data
                }
              });
              google.maps.event.addListener(infowindow, "domready", () => {
                //now my elements are ready for dom manipulation
                var clickableItem = document.getElementById("clickableItem");
                clickableItem.addEventListener("click", () => {
                  this.AdminLayoutService.sideiconClass("devicelist");
                  this.openInNewTab(
                    this.router,
                    "/device",
                    result.RES_ID,
                    result.iRCNETypeID,
                    result.SYMBOL_NAME3
                  );
                });
              });
              marker.addListener("click", () => {
                infowindow.open({
                  anchor: marker,
                  //map: this.map,
                  shouldFocus: false
                });
              });

              this.overlays.push(marker);
            }
          });
        }
        this.searchvlan = true;
      });
  }

  expand() {
    this.toposervice
      .get_topo_information(this.markerIDSelected)
      .subscribe(markers => {
        if (markers.node.length > 0) {
          this.markerLs = markers.node;
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
          let polygon = this.callulateSquareToGooglePolygon(
            markers.node,
            markers.link
          );
          var markerID = [];

          markers.node.forEach(marker => {
            var list = {
              id: this.markerIDSelected,
              marker: marker
            };
            this.markerL.push(list);
            this.add_marker(marker, "Nview");
            markerID.push(marker.SYMBOL_ID);
          });
          var squareTemp = {
            id: this.markerIDSelected,
            squareObject: polygon,
            contMarker: markerID
          };
          this.square.push(squareTemp);
          this.overlays.push(polygon);
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

    this.toposervice
      .get_topo_information(this.markerIDSelected)
      .subscribe(markers => {
        markers.node.forEach(marker => {
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

  callulateSquareToGooglePolygon(contMarker: any[], links_list: any) {
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

    this.linkExpand = links_list;
    if (this.linkExpand.length > 0) {
      this.linkExpand = [];
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
    } else if (this.linkExpand.length == 0) {
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
