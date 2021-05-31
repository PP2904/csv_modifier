/* Copyright (C) 2021 Peter Pfrommer - All Rights Reserved */



//load file
function loadFile() {

    const uploadForm = document.getElementById("uploadForm");
    const fileUpload = document.getElementById("fileUpload");

    uploadForm.addEventListener("change", console.log("File is loaded"));

    //prevent the browser’s default submit behavior
    //e.preventDefault();

    const elem = fileUpload.files[0];

    //create file reader instance
    const reader = new FileReader();

    // Read file into memory as UTF-8   
    reader.readAsText(elem);
         
    //file successfully read
    reader.onload = loadHandler;

    //file unsuccessfully read
    reader.onerror = errorHandler; 
    

}

//handles successful upload of file
function loadHandler(event){
    var csv = event.target.result;
    //message when upload successful
    document.getElementById("uploadMessage").innerHTML = "Upload was successful!";
    writeToArray(csv);
}




//write content to array to check for bad values 
function writeToArray(csv) {


    //CSV contains 2D matrix of numbers (one matrix only?)
    //where each line holds a single row “2<delim>4<delim>99<delim>\n”


    //delimter is either " " or ","
    var delimiter = document.getElementById('delimInput').value;

    
    //for blank delimiter we need to split csv string at new line (check attached file)
    if(delimiter == ' '){
        var allData = csv.split(/\n/);  
    }
    //for comma delimiter we need to split csv string at carriage return or new line (check attached file)
    if(delimiter == ','){
        var allData = csv.split(/\r\n/)
    }
    var arrFinal = [];
    for (var i=0; i<allData.length; i++) {
        //split at delimiter
        //content := 1 data point 
        var content = allData[i].split(delimiter);
            var arrTemp = [];
                for (var j=0; j<content.length; j++) {
                    //does not want to create another array, therefore solved without filter method
                    //get rid of the NaNs 
                    if(Number.isInteger(parseInt(content[j]))){
                        //convert strings to ints & add to temporary array
                        arrTemp.push(parseInt(content[j]));
                    }
                    else{
                        break;
                    }
                }
        //glue together final (outer) array
        arrFinal.push(arrTemp);

        //TODO: get rid of arrays with length zero
        // for (var j=0; j<arrFinal.length; j++) {
        //     if(arrFinal[j].length == 0){
        //         arrFinal.splice(1,j);
        //     }
        // }        



    }
  
    console.log(allData);
    //console.log(arrTemp);
    //console.log(arrFinal[1]);
    console.log(arrFinal);

    console.log(delimiter);
    console.log(document.getElementById('delimInput').value);


    //write to input box; change DOM 
    //TODO: how to format it with <br> ? 
    document.getElementById("inputFile").innerHTML = arrFinal;
   
    
    // slice, split einsetzen: https://sebhastian.com/javascript-csv-to-array/

    //escape tool: https://www.freeformatter.com/javascript-escape.html#ad-output


    interPolate(arrFinal);

}




function interPolate(arr){

    //var arrNew = [...arr].map(x => x == 0 ? 9999 : x);

    //what interpolation should be used? 

    for (var i=0; i<arr.length; i++) {
        for (var j=0; j<arr[j].length; j++) {
            if(arr[i][j] == 0){
                arr[i][j] = 9999;
            }
            else{
                arr[i][j] = arr[i][j];
            }
        }

    }



    console.log(arr);
    
    //arr.join("<b/>");

    document.getElementById("outputFile").innerHTML = arr;


}



 //handles unsuccessful upload of file 
function errorHandler() {
    document.getElementById("uploadMessage").innerHTML = "Upload failed!";
}