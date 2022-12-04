import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Apartment } from '../models/Apartment';
import { Flat } from '../models/Flat';
import { ActivatedRoute, Router } from '@angular/router';
import { Interest } from '../models/Interest';
import { User } from '../models/User';
import { ApiService } from '../services/api.service';
import { Lease } from '../models/Lease';

@Component({
  selector: 'app-interest',
  templateUrl: './interest.component.html',
  styleUrls: ['./interest.component.scss']
})
export class InterestComponent implements OnInit {

  constructor(private route: ActivatedRoute, public _apiService: ApiService, private _snackBar: MatSnackBar, public router: Router) { }
  flatId: string = '';
  interests: Interest[] = [];
  apartments: Apartment[] = [];
  flats: Flat[] = [];
  users: User[] = [];
  loading: boolean = false;
  flatDetails: Flat = new Flat();
  userDetails: User = new User();

  ngOnInit() {
    this.loading = true;
    this.route.queryParams
      .subscribe(params => {
        this.flatId = params['flatId'];
      }
      );
    if (this.flatId != '') {
      this._apiService.getInterests().subscribe(
        (data) => {
          this.interests = data.filter(flat => flat.flat_id == this.flatId)!
          this._apiService.getApartments().subscribe(
            (data) => {
              this.apartments = data;
              this._apiService.getFlats().subscribe(
                (data) => {
                  this.flats = data;
                  this._apiService.getUsers().subscribe(
                    (data) => {
                      this.users = data;
                      this.loading = false;
                    }
                  );
                }
              );
            }
          );
        },
        (error) => {
          this.loading = false;
          this._snackBar.open("Error fetching interests for this flat", "Close", {
            duration: 2000,
          });
        }
      );
      this.getFlatDetails();
    }
  }

  getApartment(id: string): Apartment {
    return this.apartments.find(apartment => apartment.id == id)!;
  }

  getFlat(id: string): Flat {
    return this.flats.find(flat => flat.id == id)!;
  }

  getUser(id: string): User {
    return this.users.find(user => user.id == id)!;
  }


  updateUserDetails(userId: any) {
    this._apiService.getUsers().subscribe(
      (data) => {
        this.loading = false;
        this.userDetails = data.filter(user => user.id == userId)[0];
        this.userDetails.flat_id = this.flatDetails.id;
        this._apiService.updateUser(this.userDetails);
      });
  }
  getFlatDetails() {
    this._apiService.getFlats().subscribe((data) => {
      this.flatDetails = data.filter(flat => flat.id == this.flatId)[0];
    },
      (error) => {
        this.loading = false;
        this._snackBar.open("Error fetching flat details", "Close", {
          duration: 2000,
        });
      });
  }
  acceptInterestInApartment(interest: Interest) {
    //create a new lease
    let leaseStartDate = new Date();
    let leaseEndDate = new Date(new Date().setFullYear(leaseStartDate.getFullYear() + 1));
    let lease = new Lease({ "lease_start_date": leaseStartDate.toISOString().split('T')[0], "lease_end_date": leaseEndDate.toISOString().split('T')[0] });
    this._apiService.addLease(lease).subscribe(
      (data) => {
        this.updateUserDetails(interest.user_id);
        this.router.navigate(['/owner/apartment']);
      },
      (error) => {
        this.loading = false;
        this._snackBar.open("Error creating a lease", "Close", {
          duration: 2000,
        });
      }

    );
  }
}
