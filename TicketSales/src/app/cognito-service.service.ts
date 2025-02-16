import { Injectable } from '@angular/core';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute
} from "amazon-cognito-identity-js";
import { Router } from "@angular/router";
import { environment } from './../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CognitoServiceService {
  userPool: CognitoUserPool;
  cognitoUser: CognitoUser | null = null;
  username = "";
  userRole: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor(private router: Router, private http: HttpClient) { 
    const poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId,
    };
    this.userPool = new CognitoUserPool(poolData);
  }

  login(emailaddress: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: emailaddress,
        Password: password,
      });

      this.username = emailaddress;
      const userData = { Username: emailaddress, Pool: this.userPool };
      this.cognitoUser = new CognitoUser(userData);

      this.cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result: any) => {
          this.getUserRole(emailaddress).then(role => {
            this.userRole.next(role);

            localStorage.setItem('cognitoUser', JSON.stringify(result));
            localStorage.setItem('userRole', role);
            localStorage.setItem('userEmail', emailaddress)

            this.router.navigate(["/home"]);
            console.log("Success Results: ", result);
            resolve();
          }).catch(error => {
            console.error("Error fetching user role", error);
            reject(error);
          });
        },
        newPasswordRequired: (userAttributes: any) => {
          resolve();
        },
        onFailure: (error: any) => {
          console.log("error", error);
          reject(error);
        },
      });
    });
  }









  getCurrentUser(): any {
    const user = localStorage.getItem('cognitoUser');
    return user ? JSON.parse(user) : null;
  }

  getCurrentUserRole(): string {
    return localStorage.getItem('userRole') || '';
  }









  async getUserRole(email: string): Promise<string> {
    const apiEndpoint = `${environment.apiGatewayEndpointRoleGetter}/items/${email}`;
    try {
      const response = await fetch(apiEndpoint, {
        method: 'GET'
      });
      const result = await response.json();
      if (response.ok) {
        console.log(result.role);
        return result.role;
      } else {
        console.error('Error fetching user role:', result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      throw error;
    }
  }

  signUp(email: string, password: string, name: string, familyName: string, birthdate: string, role: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const attributeList = [];
      attributeList.push(new CognitoUserAttribute({ Name: "email", Value: email }));
      attributeList.push(new CognitoUserAttribute({ Name: "name", Value: name }));
      attributeList.push(new CognitoUserAttribute({ Name: "family_name", Value: familyName }));
      attributeList.push(new CognitoUserAttribute({ Name: "birthdate", Value: birthdate }));

      this.userPool.signUp(email, password, attributeList, [], (err, result) => {
        if (err) {
          console.error("Sign up error", err);
          reject(err);
        } else if (result) {
          this.cognitoUser = result.user;
          console.log("User name is " + result.user.getUsername());
          this.saveUserRole(email, role)
            .then(() => resolve())
            .catch((saveError) => reject(saveError));
        } else {
          reject(new Error("Sign up result is undefined"));
        }
      });
    });
  }

  async saveUserRole(email: string, role: string): Promise<void> {
    const apiEndpoint = environment.apiGatewayEndpoint; // Ensure this is defined in environment.ts
    try {
      await this.http.post(apiEndpoint, { email, role }).toPromise();
      console.log("User role saved successfully.");
    } catch (error) {
      console.error("Error saving user role", error);
      throw error;
    }
  }

  confirmUser(email: string, confirmationCode: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const userData = { Username: email, Pool: this.userPool };
      const cognitoUser = new CognitoUser(userData);

      cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
        if (err) {
          console.error("Confirmation error", err);
          reject(err);
        } else {
          console.log("Confirmation result: ", result);
          resolve();
        }
      });
    });
  }

  logOut() {
    if (this.cognitoUser) {
      this.cognitoUser.signOut();
      this.router.navigate(["/login"]);
    } else {
      console.error("Cognito user is not initialized.");
    }
  }
}
