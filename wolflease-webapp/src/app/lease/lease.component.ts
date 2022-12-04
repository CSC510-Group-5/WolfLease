import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Lease } from '../models/Lease';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-lease',
  templateUrl: './lease.component.html',
  styleUrls: ['./lease.component.scss']
})
export class LeaseComponent implements OnInit{

  constructor(private route : ActivatedRoute, public _apiService:ApiService,private _snackBar: MatSnackBar) { 
  }
  leaseId : string = '';
  leaseDetails : Lease = new Lease();
  loading :boolean = false;
  ngOnInit(){
    this.loading = true;
    this.route.queryParams
      .subscribe(params => {
        this.leaseId = params['leaseId'];
      }
    );
    if(this.leaseId != '')
    {
      this._apiService.getLeases().subscribe(
        (data) => {
          data.filter(lease => lease.id == this.leaseId)!
          this.leaseDetails = data[0];
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this._snackBar.open("Error fetching lease details", "Close", {
            duration: 2000,
          });
        }
      );
    }
  }
}