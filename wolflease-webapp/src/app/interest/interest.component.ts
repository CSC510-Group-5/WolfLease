import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Apartment } from '../models/Apartment';
import { Flat } from '../models/Flat';
import { ActivatedRoute, Router } from '@angular/router';
import { Interest } from '../models/Interest';
import { User } from '../models/User';
import { ApiService } from '../services/api.service';

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
  users: User[] = [];
  loading: boolean = false;
  userDetails: User = new User();

  ngOnInit() {
    this.loading = true;
    this.route.queryParams
      .subscribe(params => {
        this.flatId = params['flatId'];
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


  getUser(id: string): User {
    return this.users.find(user => user.id == id)!;
  }


  updateUserDetails(userId: any) {
    this._apiService.getUsers().subscribe(
      (data) => {
        this.loading = false;
        this.userDetails = data.filter(user => user.id == userId)[0];
        this._apiService.updateUser(this.userDetails);
      });
  }

}
