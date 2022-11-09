import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'requestator';
  public fileText: string = '';
  public fileType: string = '';
  private reader: FileReader = new FileReader();
  JSON: any;
  jsonParsed: any;
  withCredentials: boolean = false;
  urlBase: string = "";
  output: string = "";
  httpOptions: any = {};


  constructor(
    private http: HttpClient
  ) {
    this.JSON = JSON;

  }

  readFile(input: any) {
    let f = input.target.files[0];
    this.fileType = input.target.parentElement.id;
    this.reader.onloadend = (e) => {
      this.fileText = this.reader.result as string;
      this.jsonParsed = this.JSON.parse(this.fileText);
      this.withCredentials = this.jsonParsed.withcredentials;
      this.urlBase = this.jsonParsed.urlbase;
      if (this.withCredentials) {
        this.httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8'
          }),
          withCredentials: true
        };
      } else {
        this.httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8'
          })
        };
      }
    };
    this.reader.onerror = (e) => {
      console.log(e);
    };
    this.reader.readAsText(f);
  }

  showScript() {
    console.log("Show script");
  }
  /*
  runTests() {
    console.log("Run tests");
    this.output = this.jsonParsed.commands.map(async (c: any) => {
      await new Promise<void>((resolve, reject) => {
        if (c.type.toLowerCase() == "request") {
          if (c.method.toLowerCase() == "get") {
            this.http.get<any>(this.urlBase + c.url, this.httpOptions).subscribe((data: any) => {
              console.log('GET', data);
              resolve();
            });
          } else if (c.method.toLowerCase() == "post") {
            this.http.post<any>(this.urlBase + c.url, c.payload, this.httpOptions).subscribe((data: any) => {
              console.log('POST', data);
              resolve();
            });
          } else if (c.method.toLowerCase() == "put") {
            this.http.put<any>(this.urlBase + c.url, c.payload, this.httpOptions).subscribe((data: any) => {
              console.log('PUT', data);
              resolve();
            });
          } else if (c.method.toLowerCase() == "delete") {
            this.http.delete<any>(this.urlBase + c.url, this.httpOptions).subscribe((data: any) => {
              console.log('DELETE', data);
              resolve();
            });
          }
          return c.description;
        } else {
          return c.echo;
        }
      });
    }).join("<br>");
  }
  */
  buildResponseOK(method: string, c: any) {
    this.output += '<span class="badge bg-success mx-1">OK</span>';
    this.output += '<span class="badge bg-secondary"> ' + method + '</span>';
    this.output += `<span> ${c.id} - ${c.description}</span>`;
    this.output += '<br />';
  }

  buildResponseFAIL(method: string, c: any) {
    this.output += '<span class="badge bg-danger mx-1">FAIL</span>';
    this.output += '<span class="badge bg-secondary"> ' + method + '</span>';
    this.output += `<span> ${c.id} - ${c.description}</span>`;
    this.output += '<br />';
  }


  async runTests2() {
    console.log("Run tests");
    this.output = "<table>";
    for (const c of this.jsonParsed.commands) {
      await new Promise<void>((resolve, reject) => {
        if (c.type.toLowerCase() == "request") {
          if (c.method.toLowerCase() == "get") {
            this.http.get<any>(this.urlBase + c.url, this.httpOptions).subscribe({
              next: (data: any) => {
                console.log('***GET', data);

                if (c.check_status == 200) {
                  this.buildResponseOK("GET", c)                  
                } else {
                  this.buildResponseFAIL("GET", c)
                }

                resolve();
              },
              error: (error: HttpErrorResponse) => {
                console.error('***GET -> ERROR', error);

                if (c.check_status == error.status) {
                  this.buildResponseOK("GET", c)
                } else {
                  this.buildResponseFAIL("GET", c)
                }

                resolve();
              }
            });
          } else if (c.method.toLowerCase() == "post") {
            this.http.post<any>(this.urlBase + c.url, c.payload, this.httpOptions).subscribe({
              next: (data: any) => {
                console.log('***POST', data);


                if (c.check_status == 200) {
                  this.buildResponseOK("POST", c)
                } else {
                  this.buildResponseFAIL("POST", c)
                }

                resolve();
              },
              error: (error: HttpErrorResponse) => {
                console.error('***POST -> ERROR', error);

                if (c.check_status == error.status) {
                  this.buildResponseOK("POST", c)
                } else {
                  this.buildResponseFAIL("POST", c)
                }

                resolve();
              }
            });
          } else if (c.method.toLowerCase() == "put") {
            this.http.put<any>(this.urlBase + c.url, c.payload, this.httpOptions).subscribe({
              next: (data: any) => {
                console.log('***PUT', data);

                if (c.check_status == 200) {
                  this.buildResponseOK("PUT", c)
                } else {
                  this.buildResponseFAIL("PUT", c)
                }

                resolve();
              },
              error: (error: HttpErrorResponse) => {
                console.error('***PUT -> ERROR', error);

                if (c.check_status == error.status) {
                  this.buildResponseOK("PUT", c)
                } else {
                  this.buildResponseFAIL("PUT", c)
                }

                resolve();
              }
            });
          } else if (c.method.toLowerCase() == "delete") {
            this.http.delete<any>(this.urlBase + c.url, this.httpOptions).subscribe({
              next: (data: any) => {
                console.log('***DELETE', data);

                if (c.check_status == 200) {
                  this.buildResponseOK("DELETE", c)
                } else {
                  this.buildResponseFAIL("DELETE", c)
                }

                resolve();
              },
              error: (error: HttpErrorResponse) => {
                console.error('***DELETE -> ERROR', error);

                if (c.check_status == error.status) {
                  this.buildResponseOK("DELETE", c)
                } else {
                  this.buildResponseFAIL("DELETE", c)
                }

                resolve();
              }
            });
          }
          //return c.description;
        } else {
          //return c.echo;
        }
      });
    };
  }

  formatJSON() {
    return JSON.stringify(this.fileText, null, 6).replace(/\n( *)/g, function (match, p1) {
      return '<br>' + '&nbsp;'.repeat(p1.length);
    });
  }

}
