
/**
 * UPLOAD PDF
 */
var formFile = document.getElementById("formFile");
function uploadPDF(){
    document.getElementById("show").setAttribute("data", URL.createObjectURL(formFile.files[0]));
}


/**
 * Create meta tag fields
 */
const newMetaTagField = (inputName = '', inputType = 'text', value = '', tbodyId, readOnly = false) => {
    const tbody = document.getElementById(`${tbodyId}`);
    let tr = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    td1.style.padding = '3px 4px';
    td2.style.padding = '3px 0';
    let strong = document.createElement('strong');
    strong.append(inputName);
    td1.append(strong);
    // add td1
    tr.append(td1);
    let input = document.createElement('input');
    input.type = inputType;
    const words = inputName.split(" ");
    inputName = '';
    for (let i = 0; i < words.length; i++) {
        inputName += words[i][0].toUpperCase() + words[i].substring(1);
    }
    input.name = inputName.replace (/ /g,'');
    input.className = 'form-control form-control-sm';
    input.value = value
    input.readOnly = readOnly;
    td2.append(input);
    // add td2
    tr.append(td2);
    // add tr tag into the tbody
    tbody.appendChild(tr);
}


function Upload(e) {
    var target = e.id.includes('fortable1')  ? 'table-tbody' : 'table-tbody2';
    //Reference the FileUpload element.
    var fileUpload = e;
    if (fileUpload.files.length === 1) {
        //Validate whether File is valid Excel file.
        if (typeof (FileReader) !== "undefined") {
            var reader = new FileReader();
            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function (e) {
                    ProcessExcel(e.target.result, target);
                };
                reader.readAsBinaryString(fileUpload.files[0]);
            } else {
                //For IE Browser.
                reader.onload = function (e) {
                    var data = "";
                    var bytes = new Uint8Array(e.target.result);
                    for (var i = 0; i < bytes.byteLength; i++) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    ProcessExcel(data, target);
                };
                reader.readAsArrayBuffer(fileUpload.files[0]);
            }
        } else {
            alert("This browser does not support HTML5.");
        };
    }
};

function ProcessExcel(data, tbodyId) {
    //Read the Excel File data.
    var workbook = XLSX.read(data, {
        type: 'binary'
    });

    //Fetch the name of First Sheet.
    var firstSheet = workbook.SheetNames[0];

    //Read all rows from First Sheet into an JSON array.
    var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
    document.getElementById(`${tbodyId}`).innerHTML = '';
    //Add the data rows from Excel file.
    for (var i = 0; i < excelRows.length; i++) {
        let value = '';
        let readOnly = false;
        if (tbodyId === 'table-tbody2') {
            value = excelRows[i]['Value'] ? excelRows[i]['Value'] : ''
            readOnly = true;
        }
        newMetaTagField(excelRows[i]['Meta data'], 'text', value, tbodyId, readOnly);
    }
    // document.getElementById('download-btn').style.display =  (excelRows.length > 0) ? 'block' : 'none';
};


/**
 * Download xml file
 * @param {*} contentType 
 * @param {*} data 
 * @param {*} filename 
 */
 function downloadData(contentType,data,filename){
    var link=document.createElement("A");
    link.setAttribute("href",encodeURI("data:"+contentType+","+data));
    link.setAttribute("style","display:none");
    link.setAttribute("download",filename);
    document.body.appendChild(link);                                                        //needed for firefox
    link.click();
    setTimeout(function(){
      document.body.removeChild(link);
    },1000);
}

function fromToXml(form){
    var xmldata=['<?xml version="1.0"?>'];
    xmldata.push("<MetaData>");
    var inputs=form.elements;
    for(var i=0;i<inputs.length;i++){
        xmldata.push(`<${inputs[i].name}>${inputs[i].value}</${inputs[i].name}>`)
    }
    xmldata.push("</MetaData>");
    return xmldata.join("\n");
}

// download 
function downloadXML() {
    var form = document.getElementById('metadata-form');
    downloadData('text/xml', fromToXml(form), 'this.xml')
}

