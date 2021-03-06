var country;
var parameter;
var measureArr = []
var selectionGroup = document.getElementById("selectionGroup");
const inputElement = document.getElementById("inputCountries");
const submitBtn = document.getElementById("submitBtn");
const inputForm = document.getElementById("inputForm");
const localStorageKey = 'inputVal'

function storeInput(){
    if(inputElement.value !== undefined){
        localStorage.setItem(localStorageKey, inputElement.value)
    }
}

// origin = "*" in request,  format = json
function fetchWiki(){
    measureArr.forEach((e, i)=>{
        fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=${e.city}&limit=5&namespace=0&format=json`)
        .then((resp)=>{return resp.json()})
        .then((json)=>{
            document.getElementById('collapseOne'+ i).lastChild.innerHTML = json[2][0]
        })
    })
}

function fetchData(){
    measureArr = [];
    selectCountryCode()
    if(country !== "error" && parameter!== undefined){
        fetch(`https://api.openaq.org/v1/latest?limit=1000&country=${country}&parameter=${parameter}&order_by=measurements[0].value`)
        .then(resp => {return resp.json()})
        .then(function(json) {
            return json.results
          })
          .then((res)=>{
              res.forEach(e => {
                var obj = {}
                obj["city"] = e.city
                obj["parameter"] = e.measurements[0].parameter
                obj["value"] = e.measurements[0].value
                obj["unit"] = e.measurements[0].unit
                measureArr.push(obj)
              });
              measureArr = getUnique(measureArr,'city')
              measureArr.reverse().splice(10,measureArr.length-10)
              createDataAccordion()
              fetchWiki()
          })
    }else{
        alert("Please select pullutant and country")
    }
}


function createDataAccordion(){
    if(typeof inputForm.nextSibling !== undefined){
        document.getElementById("accordionExample").remove()
    }
    var parent = document.createElement('div')
    var content = document.getElementById('content')
    var div1 = document.createElement('div')
    var div2 = document.createElement('div')
    var div3 = document.createElement('div')
    var div4 = document.createElement('div')
    var h2 = document.createElement('h2')
    var btn = document.createElement('button')
    parent.setAttribute("class", "accordion")
    parent.setAttribute("id", "accordionExample")
    content.appendChild(parent)
    for(var i = 0; i<10;i++){
        div1 = document.createElement('div')
        div2 = document.createElement('div')
        div3 = document.createElement('div')
        div4 = document.createElement('div')
        h2 = document.createElement('h2')
        btn = document.createElement('button')
        div1.setAttribute("class", "card")

        div2.setAttribute("class", "card-header")
        div2.setAttribute("id", "headingOne" + i)
        div3.setAttribute("id", "collapseOne" + i)
        div3.setAttribute("class", "collapse")
        div3.setAttribute("aria-labelledby", "headingOne" + i)
        div3.setAttribute("data-parent", "#accordionExample") //parent element ID
        div4.setAttribute("class", "card-body")

        h2.setAttribute("class", "mb-0")
        btn.setAttribute("class", "btn btn-link btnTheme collapsed ")
        btn.setAttribute("type", "button")
        btn.setAttribute("data-toggle", "collapse")
        btn.setAttribute("data-target", "#collapseOne" + i)
        btn.setAttribute("aria-expanded", "false")
        btn.setAttribute("aria-controls", "collapseOne" + i)
        btn.innerHTML = measureArr[i].city.toUpperCase() + " " + parameter.toUpperCase() + ": " + measureArr[i].value + " " + measureArr[i].unit // measureArr[i]
        
        h2.appendChild(btn)
        div2.appendChild(h2)
        div1.appendChild(div2)
        div3.appendChild(div4)
        div1.appendChild(div3)
        parent.append(div1)
    }
    
}

function getUnique(arr, comp) {
    const unique = arr
    .map(e => e[comp])
  
       // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)
  
      // eliminate the dead keys & store unique objects
    .filter(e => arr[e]).map(e => arr[e]);
  
     return unique;
  }

function selectCountryCode(){
    switch (inputElement.value.toLowerCase()){
        case "france":
            country = "FR"
            break;
        case "poland":
            country = "PL"
            break;
        case "germany":
            country = "DE"
            break;
        case "spain":
            country = "ES"
            break;
        default:
            country = "error"
            console.log("something went wrong")
     }
}

function selector(x){
    for(var i=0; i<6; i++){
        document.getElementById("selectionGroup").children[i].style = "#fff";
    }
    return document.getElementById(x).style.color = "rgb(255, 251, 0)";

}

selectionGroup.addEventListener("click",(e)=>{
    e.preventDefault()
    selector(e.target.id)

    switch (e.target.id){
        case "CO-Btn":
            parameter = "co"
            break;
        case "NO2-Btn":
            parameter = "no2"
            break;
        case "SO2-Btn":
            parameter = "so2"
            break;
        case "O3-Btn":
            parameter = "o3"
            break;
        case "PM10-Btn":
            parameter = "pm10"
            break;
        case "PM25-Btn":
            parameter = "pm25"
            break;
        default:
            console.log("something went wrong on parameter")
     }
})

window.onload = () => {
    if(localStorage.getItem(localStorageKey) !== null){
        inputElement.value = localStorage.getItem(localStorageKey)
    }
}

submitBtn.addEventListener("click", (e)=>{
        e.preventDefault()
        storeInput()
        fetchData()
})
