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
function loadHandler(event) {
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



    //TODO: need a case to handle floating point numbers with blanks as delimiter 
    //(both MacOS and DOS csv file types from excel)


    //for blank delimiter we need to split csv string at new line (check png file attached in folder)
    if (delimiter == ' ') {
        var allData = csv.split(/\n/);
    }
    //for comma delimiter we need to split csv string at carriage return or new line (check png file attached in folder)
    if (delimiter == ',') {
        var allData = csv.split(/\r|\n/)
    }

    var arrFinal = [];
    for (var i = 0; i < allData.length; i++) {
        //split at delimiter
        var content = allData[i].split(delimiter);
        //an array element "" could be a consequence
        //therefore check content array for ""
        if (content == "") {
            break;
        }
        var arrTemp = [];
        for (var j = 0; j < content.length; j++) {
            //content := 1 data point 
            //does not want to create another array, therefore solved without filter method
            //get rid of the NaNs 
            if (Number.isInteger(parseInt(content[j]))) {
                //convert strings to ints & add to temporary array
                arrTemp.push(parseInt(content[j]));
            }
            else {
                break;
            }
        }


        //glue together final (outer) array
        arrFinal.push(arrTemp);
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

    //call interpolation function
    interPolate(arrFinal);

}



//interpolation 
function interPolate(arr) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[j].length; j++) {
            if (arr[i][j] == 0) {
                //we are currently at one of the marginal values
                if (j == 0){
                    arr[i][j] = arr[i][j+1] + arr[i][j+2];
                    break;
                }
                //we are currently at one of the marginal values
                if(j == (arr[j].length - 1)){
                    arr[i][j] = arr[i][j-1] + arr[i][j-2];
                    break;
                }

                if( arr[i][j-1] == 0 && arr[i][j+1] == 0){
                    if(arr[i][j-1] == 0){
                        //edge case, therefore lazy approach :) 
                        arr[i][j] = 999;
                    }
                    break;
                }

                //none of the two values is zero or a marginal value (left, right)
                arr[i][j] = arr[i][j-1] + arr[i][j+1];
            }

        }

    }



    console.log(arr);

    //arr.join("<b/>");

    document.getElementById("outputFile").innerHTML = arr;


}





//TODO: write back to csv input type:  0) same data typ = string??? 1) same delimiter 2) same data (= same number of datapoints) 3) no zero values
function writeToCsv() {

}



//handles unsuccessful upload of file 
function errorHandler() {
    document.getElementById("uploadMessage").innerHTML = "Upload failed!";
}