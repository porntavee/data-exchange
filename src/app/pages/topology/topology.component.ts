import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { NavigateService } from "@app/navigateservice";
import { TopoService } from "@app/topology-service";
import { ThroughputService } from "@app/throughput.service";
import { environment } from "environments/environment";
import { TreeNode, MenuItem, MessageService } from "primeng/api";
import { ActivatedRoute, Router } from "@angular/router";
export interface locationInfo {
  symbol_id: string;
  latitude: number;
  longitude: number;
  icon: number;
  topo_icon: string;
}
export interface Device {
  IRCNETypeID?: string;
  symbol_id?: number;
  symbol_name1?: string;
  symbol_name3?: string;
  res_id?: string;
}
@Component({
  selector: "app-topology",
  templateUrl: "topology.component.html",
  styleUrls: ["topology.component.css"]
})
export class TopologyComponent implements OnInit {
  topology: TreeNode[];
  topologys: TreeNode = {};
  loading: boolean;
  selectedNode: TreeNode;
  contextItems: MenuItem[];
  color0: boolean;
  color1: boolean;
  load_data: boolean;
  baseURL = environment.baseUrl;
  device_resid: string;
  deviceL: Device = {};
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toposervice: TopoService,
    private titleService: Title,
    private navigator: NavigateService,
    private messageService: MessageService,
    private throughputService: ThroughputService
  ) {
    this.titleService.setTitle("SED-Topology");
  }

  ngOnInit(): void {
    this.topology = [];
    this.loading = true;
    this.contextItems = [];
    this.load_data = true;
    setTimeout(() => {
      this.toposervice.get_topo_information(0).subscribe({
        next: marker => {
          this.initTopology(marker);
          this.load_data = false;
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
      this.loading = false;
    }, 1000);

    //this.initTopology(this.toposervice.dummy);
  }

  nodeExpand(event) {
    //console.log(event)
    this.load_data = true;
    if (event.node) {
      //in a real application, make a call to a remote url to load children of the current node and add the new nodes as children
      this.toposervice.get_topo_information(event.node.key).subscribe(nodes => {
        event.node.children = [];
        nodes.forEach(node => {
          this.add_subtopo(event.node, node);
          this.load_data = false;
        });
        //this.messageService.add({ severity: 'info', summary: 'Children Loaded', detail: event.node.label });
      });
    }
  }

  remote(event) {
    this.device_resid = event.node.data.res_id;
    this.deviceL.IRCNETypeID = event.node.data.ircType;
    // console.log(event.node.data.ircType);
    if (event.node.data.type == "NE") {
      this.router.navigate(["/device"], {
        queryParams: {
          ID: this.device_resid,
          IRCNETypeID: this.deviceL.IRCNETypeID
        }
      });
      // window.open(`${environment.rountURL}#/device?ID=${event.node.data.res_id}`)
    }
    // //console.log(event);
    // //console.log(event.node.children.push({
    //   "key": "999",
    //   "label": "DATACOM",
    //   "data": "MINBURI Folder",
    //   "expandedIcon": "pi pi-folder-open",
    //   "collapsedIcon": "pi pi-folder",
    //   "children": [{
    //     "label": "Minburi 10.150.5.83",
    //     "data": "Pacino Movies",
    //     "children": [
    //       { "label": "Minburi 10.150.5.83", "icon": "pi pi-folder", "data": "Scarface Movie" },
    //       { "label": "Taveeboon", "icon": "pi pi-folder", "data": "Serpico Movie" }]
    //   }]
    // }));
    // ////console.log(this.searchTree(this.topology, "1"));
    // for (var i = 0; i < this.topology.length; i++) {
    //   let tree_result = this.searchTree(this.topology[i], "1");
    //   if (tree_result != null) {
    //     break;
    //   }
    // }
  }

  expandAll() {
    this.topology.forEach(node => {
      this.expandRecursive(node, true);
    });
  }

  collapseAll() {
    this.topology.forEach(node => {
      this.expandRecursive(node, false);
    });
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
    // topo_data.forEach(row => {
    //   let
    // });
  }

  searchTree(element, matchingTitle) {
    //console.log(element)
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
    // Topo_datas.forEach(data => {
    //   if (data.TREE_PARENT_ID == 0) {
    //     this.add_topo(data);
    //   }
    //   else {
    //     var element_result;
    //     for (var i = 0; i < this.topology.length; i++) {
    //       element_result = this.searchTree(this.topology[i], data.TREE_PARENT_ID);
    //       if (element_result != null) {
    //         break;
    //       }
    //     }
    //     if(element_result){
    //       this.add_subtopo(element_result,data);
    //     }
    //   }
    // });

    Topo_datas.forEach(data => {
      this.add_topo(data);
    });
    //console.log(this.topology);
  }

  add_topo(topo) {
    let icon = "";
    if (topo.topo_icon) {
      icon = `nt-${topo.topo_icon}`;
      icon = topo.STATUS_IS_PING_OK ? icon : `${icon} nt-alarm`;
    } else {
      icon = "nt-alert nt-alarm";
    }
    let haschildren = topo.haschildren == "TRUE" ? true : false;
    //console.log(topo)
    if (topo.IS_VISIBLE) {
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
          ircType: topo.IRCNETypeID
        },
        type: topo.RES_TYPE_NAME,
        expandedIcon: icon,
        collapsedIcon: icon,
        leaf: !haschildren,
        children: []
      });
    }
  }

  add_subtopo(element, topo) {
    let icon = "";
    if (topo.topo_icon) {
      icon = `nt-${topo.topo_icon}`;
      icon = topo.STATUS_IS_PING_OK ? icon : `${icon} nt-alarm`;
    } else {
      icon = "nt-alert nt-alarm";
    }
    let haschildren = topo.haschildren == "TRUE" ? true : false;
    if (topo.IS_VISIBLE) {
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
          ircType: topo.IRCNETypeID,
          ISPINGOK: topo.ISPINGOK
        },
        type: topo.RES_TYPE_NAME,
        expandedIcon: icon,
        collapsedIcon: icon,
        leaf: !haschildren,
        children: []
      });
    }
  }

  //----------------dailog-----------------------

  iconSettingDialog: boolean = false;
  submitted: boolean = false;
  selectedMapIcon: any;
  selectedtopoIcon: string;
  icondata = { latitude: null, longitude: null };

  mapIcon = [
    { id: 1, icon_name: "sever", icon_path: "/symbol/server.gif" },
    { id: 2, icon_name: "city", icon_path: "/symbol/city.gif" },
    { id: 3, icon_name: "switch", icon_path: "/device/iscomrax.gif" }
  ];

  topoIcon = ["server", "switch", "city"];

  openSettingDialog() {
    this.iconSettingDialog = true;
  }

  onContextMenu(event, selectedNode) {
    let device_throughput = ["ISCOM-RAX711", "ISCOM-RAX711B", "RAX711-C"];

    this.contextItems = [];

    this.contextItems.push({
      label: "Coordinates setting",
      icon: "pi pi-map-marker",
      command: event => {
        //console.log(event);
        //console.log(this.selectedNode)
        this.selectedMapIcon = this.selectedNode.data.icon_id;
        this.selectedtopoIcon = this.selectedNode.data.topo_icon;
        this.icondata.latitude = this.selectedNode.data.latitude;
        this.icondata.longitude = this.selectedNode.data.longitude;
        this.openSettingDialog();
      }
    });

    if (this.selectedNode.data.longitude || this.selectedNode.data.latitude) {
      this.contextItems.push({
        label: "View on map",
        icon: "pi pi-map",
        command: event => {
          this.navigator.navigateToTopologyMap(
            this.selectedNode.data.tree_parent_id,
            this.selectedNode.data.latitude,
            this.selectedNode.data.longitude
          );
        }
      });
    }

    // if (selectedNode.data.type == "NE") {
    //   // this.contextItems.push(
    //   //   {
    //   //       label: 'Telnet',
    //   //       icon: 'pi pi-desktop',
    //   //       command: (event) => {
    //   //         this.navigator.navigateToDevice(119);
    //   //       }
    //   //     }
    //   // );

    //   if(device_throughput.includes(selectedNode.data.ircType)){
    //     this.contextItems.push(
    //       {
    //         label: 'Set throughput (local)',
    //         icon: 'pi pi-link',
    //         command: (event) => {
    //           this.throughputService.setLocalDevice(this.selectedNode.data);
    //         }
    //       },
    //       {
    //         label: 'Set throughput (remote)',
    //         icon: 'pi pi-link',
    //         command: (event) => {
    //           this.throughputService.setRemoteDevice(this.selectedNode.data);
    //         }
    //       }
    //     );
    //   }
    // }
  }

  seveSetting() {
    this.submitted = true;
    //console.log(this.selectedMapIcon)
    //console.log(this.selectedtopoIcon)
    this.toposervice
      .setTopoInformation(
        this.selectedNode.key,
        this.icondata.latitude,
        this.icondata.longitude,
        this.selectedMapIcon.id,
        this.selectedtopoIcon
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
          //console.log(error)
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
  }
}
