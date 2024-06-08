document.addEventListener("DOMContentLoaded", function (event) {
  invoice = parseInt(document.getElementsByClassName("onload")[0].innerHTML.slice(-4));
  loadpage(0);
});
const baseUrl = "http://localhost:3000/invoice/";
var serviceSize;
var invoice;
var edit=false;

async function getInfo(params,query) {
  //preventDefault();
  const res = await fetch(baseUrl + "file" + params + "?key=" + query, {
    method: "GET",
  });
  if(!res.ok){return false}
  return await res.json();
}
async function postInfo(file,query="") {
  //preventDefault();
  const res = await fetch(baseUrl + "?key=" + query, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(file),
  });
  const data = await res.json();
  console.log(data.status);
}

function setvalue(span, text) {
  while (span.firstChild) {
    span.removeChild(span.firstChild);
  }
  span.appendChild(document.createTextNode(text));
}
function dropdown(e) {
  e.parentNode.parentNode.firstChild.value = e.innerHTML;
}

function calculate() {
  var all = 0;
  div = document.getElementById("service").childNodes;
  for (i = 0; i < div.length; i++) {
    e = div[i].childNodes;
    if(e[0].childElementCount>0){
      num = 
      e[2].firstChild.value.replace("$", "") *
        e[3].firstChild.value.replace("$", "") +
      e[4].firstChild.value.replace("$", "") *
        e[5].firstChild.value.replace("$", "");
    e[6].firstChild.value = "$".concat(num.toFixed(2));
    } else {
      num = 
      e[2].innerHTML.replace("$", "") *
        e[3].innerHTML.replace("$", "") +
      e[4].innerHTML.replace("$", "") *
        e[5].innerHTML.replace("$", "");
    e[6].innerHTML = "$".concat(num.toFixed(2));
    }
    all += num;
  }
  document.getElementById("total").innerHTML = "$".concat(all.toFixed(2));
};
function myFunction() {
  InputToText();
  var element = document.documentElement;
  var opt = {
    margin: 0,
    filename: "JaredStanbrookInvoice" 
    + document.getElementById("invoice-date").innerHTML.slice(8).replaceAll("/", '')
    + "_" 
    + invoice.toString().padStart(4,"0")
    + document.getElementById("client-name").innerHTML.replace(/\s/g, '') + ".pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 3, height: 816, backgroundColor: "#fffdeb" },
    jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
    enableLinks: true,
  };

  // New Promise-based usage:
  html2pdf().set(opt).from(element).save();
}
function auto_height(elem) {
  /* javascript */
  elem.style.height = "1px";
  elem.style.height = `${elem.scrollHeight}px`;
}

function service(x) {
  var container = document.getElementById("service");
  var serviceFill = ["1/1/23","Daily Personal Activities - Standard - Weekday Daytime","0.00","$0.85","0.00","$50"];
  serviceSize += x;
  while(container.childElementCount!=serviceSize) {
    if(serviceSize<container.childElementCount) { container.removeChild(container.lastChild); 
    } else {
      var tr = document.createElement("tr");
      for (z = 0; z < 7; z++) {
        var td = document.createElement("td");
        td.className = "text-center content";
        var text = document.createElement("textarea");
        td.id = container.childElementCount + "service" + z;
        td.addEventListener("input", calculate);
        if(edit) {
          var text = document.createElement("textarea");
          text.value = serviceFill[z];
          text.rows = 1;
          td.appendChild(text);
        } else {
          td.innerHTML = serviceFill[z];
        }
        tr.appendChild(td);
      }
    container.appendChild(tr);
    }
  }
}
function InputToText() {
  var e = document.getElementsByClassName("content");
  for (i = e.length - 1; i >= 0; i--) {
    if(e[i].childElementCount>0){
      var t = e[i].lastChild.value;
      e[i].innerHTML = t;
    }
  }
  edit=false;
}
function TextToInput() {
  var content = document.getElementsByClassName("content");
  var dropdown = {"client-name":["Seth Smith","Chantelle Smith"]};
  for(i=0;i<content.length;i++) {
    if(content[i].childElementCount<1) {
      var text = document.createElement("textarea");
      text.value = content[i].innerHTML;
      text.rows = 1;
      content[i].innerHTML = "";
      if(dropdown[content[i].id]!=undefined) {
        text.className = "dropbtn";
        text.addEventListener("click",function (event) {
          document.getElementById("myDropdown").classList.toggle("show");
        });
        div = document.createElement('div')
        div.id = "myDropdown";
        div.className = "dropdown-content";
        for(x=0;x<dropdown[content[i].id].length;x++) {
          a = document.createElement("a");
          a.innerHTML = dropdown[content[i].id][x];
          div.appendChild(a);
          a.onclick = function(event) {
            event.target.parentNode.parentNode.lastChild.value = event.target.innerHTML;
          }
        }
        content[i].appendChild(div);
      }
      content[i].appendChild(text);
      text.addEventListener("input", auto_height(text));
    }
  }
  edit=true;
}
function loadpage(x) {
  (async () => {
    div = await getInfo('invoice',(invoice+x).toString().padStart(4, '0')); //invoice0001 example
    if(!div){return}
    invoice+=x;
    serviceSize = parseInt(div[div.length-2][0].slice(0,1))+1;
    service(0);
    for (i = 0; i < div.length; i++) {
      var e = document.getElementById(div[i][0])
      if(e!=null) {
        if(e.value==null){e.innerHTML = div[i][1];
        } else {
          e.value = div[i][1];
        }
      }
    }
    calculate();
  })();
}
function filter(e) {
  postInfo([e.value],"print");
}
function save() {
  InputToText();
  var dataFile = [];
  var content = document.getElementsByClassName("content");

  for (x = 0; x < content.length; x++) {
    if (content[x].childElementCount <= 0 || content[x].parentElement.className == "dropdown") { //collect only essential data from page
      dataFile.push([content[x].id, content[x].innerHTML]);
    }
  }
  invoice = parseInt(document.getElementById('invoice-number').innerHTML.slice(-4));
  postInfo(dataFile,"save");
}
function quickUpdate(e) {
  postInfo([e.value],"print");
}
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}