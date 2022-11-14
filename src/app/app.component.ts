import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Script } from './interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  @ViewChild('formFile') myInputVariable: ElementRef;
  title = 'requestator';
  //
  JSON: any;
  //
  oResponses: any = {};
  //
  public fileText: string = '';
  public fileType: string = '';
  private oFileReader: FileReader = new FileReader();
  jsonParsed: Script | undefined;
  //options
  withCredentials: boolean = false;
  urlBase: string = "";
  //
  httpOptions: any = {};
  //
  output: string = "";
  //
  nCounter: number = 0;

  constructor(
    private http: HttpClient
  ) {
    this.JSON = JSON;
  }

  reset() {
    this.fileText = '';
    this.fileType = '';
    this.output = "";
    this.nCounter = 0;
    this.myInputVariable.nativeElement.value = '';
  }

  readFile(input: any) {
    let f = input.target.files[0];
    this.fileType = input.target.parentElement.id;
    this.oFileReader.onloadend = (e) => {
      this.fileText = this.oFileReader.result as string;
      this.jsonParsed = this.JSON.parse(this.fileText);
      if (this.jsonParsed) {
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
      }
    };
    this.oFileReader.onerror = (e) => {
      console.log(e);
    };
    this.oFileReader.readAsText(f);
  }

  showScript() {
    console.log("Show script");
  }

  buildResponseOK(method: string, c: any) {
    this.output += this.nCounter + ".- ";
    this.output += '<span class="badge bg-success mx-1">OK</span>';
    this.output += '<span class="badge bg-secondary"> ' + method + '</span>';
    this.output += `<span> ${c.id} - ${c.description}</span>`;
    this.output += '<br />';
  }

  buildResponseFAIL(method: string, c: any) {
    this.output += this.nCounter + ".- ";
    this.output += '<span class="badge bg-danger mx-1">FAIL</span>';
    this.output += '<span class="badge bg-secondary"> ' + method + '</span>';
    this.output += `<span> ${c.id} - ${c.description}</span>`;
    this.output += '<br />';
  }

  async runTests2() {
    this.nCounter = 0;
    if (this.jsonParsed) {
      console.log("Run tests");
      this.output = "<table>";
      for (const c of this.jsonParsed.commands) {
        await new Promise<void>((resolve, reject) => {
          if (c.type.toLowerCase() == "check_one_source") {
            this.nCounter++;
            if (c.property) {
              if (this.oResponses[c.source][c.property] == c.value) {
                this.buildResponseOK("CHECK_ONE_SOURCE", c);
              } else {
                this.buildResponseFAIL("CHECK_ONE_SOURCE", c);
              }
            } else {
              if (this.oResponses[c.source] == c.value) {
                this.buildResponseOK("CHECK_ONE_SOURCE", c);
              } else {
                this.buildResponseFAIL("CHECK_ONE_SOURCE", c);
              }
            }
            resolve();
          }
          if (c.type.toLowerCase() == "check_two_sources") {
            this.nCounter++;
            if (c.property1 && c.property2) {
              if (this.oResponses[c.source1][c.property1] == this.oResponses[c.source2][c.property2]) {
                this.buildResponseOK("CHECK_TWO_SOURCES", c);
              } else {
                this.buildResponseFAIL("CHECK_TWO_SOURCES", c);
              }
            } else if (c.property1) {
              if (this.oResponses[c.source1][c.property1] == this.oResponses[c.source2]) {
                this.buildResponseOK("CHECK_TWO_SOURCES", c);
              } else {
                this.buildResponseFAIL("CHECK_TWO_SOURCES", c);
              }
            } else if (c.property2) {
              if (this.oResponses[c.source1] == this.oResponses[c.source2][c.property2]) {
                this.buildResponseOK("CHECK_TWO_SOURCES", c);
              } else {
                this.buildResponseFAIL("CHECK_TWO_SOURCES", c);
              }
            } else {
              if (this.oResponses[c.source1] == this.oResponses[c.source2]) {
                this.buildResponseOK("CHECK_TWO_SOURCES", c);
              } else {
                this.buildResponseFAIL("CHECK_TWO_SOURCES", c);
              }
            }
            resolve();
          }
          if (c.type.toLowerCase() == "request") {
            if (c.method.toLowerCase() == "get") {
              this.http.get<any>(this.urlBase + c.url, this.httpOptions).subscribe({
                next: (data: any) => {
                  console.log('***GET', data);
                  this.nCounter++;
                  this.oResponses[c.id] = data;
                  if (c.check_status == 200) {
                    this.buildResponseOK("GET", c)
                  } else {
                    this.buildResponseFAIL("GET", c)
                  }

                  resolve();
                },
                error: (error: HttpErrorResponse) => {
                  console.error('***GET -> ERROR', error);
                  this.nCounter++;
                  this.oResponses[c.id] = error;
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
                  this.nCounter++;
                  this.oResponses[c.id] = data;
                  if (c.check_status == 200) {
                    this.buildResponseOK("POST", c)
                  } else {
                    this.buildResponseFAIL("POST", c)
                  }

                  resolve();
                },
                error: (error: HttpErrorResponse) => {
                  console.error('***POST -> ERROR', error);
                  this.nCounter++;
                  this.oResponses[c.id] = error;
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
                  this.nCounter++;
                  this.oResponses[c.id] = data;
                  if (c.check_status == 200) {
                    this.buildResponseOK("PUT", c)
                  } else {
                    this.buildResponseFAIL("PUT", c)
                  }

                  resolve();
                },
                error: (error: HttpErrorResponse) => {
                  console.error('***PUT -> ERROR', error);
                  this.nCounter++;
                  this.oResponses[c.id] = error;
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
                  this.nCounter++;
                  this.oResponses[c.id] = data;
                  if (c.check_status == 200) {
                    this.buildResponseOK("DELETE", c)
                  } else {
                    this.buildResponseFAIL("DELETE", c)
                  }

                  resolve();
                },
                error: (error: HttpErrorResponse) => {
                  console.error('***DELETE -> ERROR', error);
                  this.nCounter++;
                  this.oResponses[c.id] = error;
                  if (c.check_status == error.status) {
                    this.buildResponseOK("DELETE", c)
                  } else {
                    this.buildResponseFAIL("DELETE", c)
                  }

                  resolve();
                }
              });
            }
          }
        });
      };
    }
  }

  formatJSON() {
    return JSON.stringify(this.fileText, null, 6).replace(/\n( *)/g, function (match, p1) {
      return '<br>' + '&nbsp;'.repeat(p1.length);
    });
  }

}
