import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { User } from '@app/user';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';

@Injectable()
export class NavigateService {


    constructor(private router: Router) { }

    isNavigate: boolean= false;
    passingData: any;


    navigateToDevice(res_id) {

        this.router.navigate(['/device'], { queryParams: { ID: res_id } });
        //['/device', { id: res_id }]
        // (['/product-list'], { queryParams: { page: pageNum } });
    }


    navigateToTopologyMap(symbol_id,latitude,longitude) {
        this.isNavigate = true;
        this.passingData = {"symbol_id":symbol_id,
                                "center": { lat: latitude, lng: longitude }};
        this.router.navigate(['/topologymap'])
        // (['/product-list'], { queryParams: { page: pageNum } });
    }

    navigateToTelnet(res_id){
        this.isNavigate = true;
        this.passingData = res_id;
        this.router.navigate(['/telnet'])
    }
}