// randomly generates a number between the range of low and high
function getRandom(low:number = 1, high:number = 10):number {
    let randomNumber:number;
    // calculate random number
    randomNumber = Math.round(Math.random() * (high - low)) + low;
    // returning value
    return randomNumber;
}

function addKey(functionToCall:Function, myKeyCode:string = "Enter"):void {
    // this example exposes issue with scoping and event handlers and how it is solved with arrow function

    // wire up event listener
    document.addEventListener("keydown", (e:KeyboardEvent) => {
        // is the key released the provided key? Check keyCode via Event object
        if (e.code === myKeyCode) {
            // pressing the enter key will force some browsers to refresh
            // this command stops the event from going further
            e.preventDefault();
            // call provided callback to do everything else that needs to be done
            functionToCall();
            // this also helps the event from propagating in some browsers
            return false;
        }
    });
}

function getXMLData(retrieveScript:string, success:Function, failure:Function):void {
    // send out AJAX request
    let xmlhttp:XMLHttpRequest = new XMLHttpRequest();
    xmlhttp.addEventListener("load", (e:Event) => {
        // has the response been received successfully?
        if (xmlhttp.status === 200) {
            // data retrieved - call success method and pass along XML object response
            success(xmlhttp.responseXML);
        } else {
            failure();
        }
    });
    xmlhttp.addEventListener("error", (e:Event) => {
        failure();
    });
    xmlhttp.open("GET", retrieveScript, true);
    xmlhttp.send();
}

function sendJSONData(sendScript:string, httpMethod:string, jsonString:string, success:Function, failure:Function):void {
    // send out AJAX request
    let xmlhttp:XMLHttpRequest = new XMLHttpRequest();
    xmlhttp.addEventListener("load", (e:Event) => {
        // has the response been received successfully?
        if (xmlhttp.status === 200) {
            // data retrieved - call success method and pass along XML object response
            success(xmlhttp.responseText);
        } else if(xmlhttp.status == 409) {
            // Conflict - Record exists already
            failure(xmlhttp.responseText);
        } else {
            failure();
        }
    });
    xmlhttp.addEventListener("error", (e:Event) => {
        failure();
    });
    xmlhttp.open(httpMethod, sendScript, true);
    // setting the content-type of the request so the server knows what format that data is coming as
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(jsonString);
}

function getJSONData(retrieveScript:string, success:Function, failure:Function):void {
    fetch(retrieveScript)
        .then((response:Response) => response.json())
        .then((data:any) => success(data))
        .catch((err:Error) => failure());
}

export {getRandom, addKey, getXMLData, sendJSONData, getJSONData};