"use strict"

import { gsap } from "gsap";

console.log(gsap.version)

function rqr(alc, prix) {
    return (alc / prix) * 10
}

const btBar = document.querySelector(".bouton--bar");
const formulaireBar = document.querySelector(".formulaire-bar");
const rqrMoyen = document.getElementById("rqrmoyen");
console.log(rqrMoyen)

const list = document.querySelector('#results');
const search_field = document.querySelector("#search");

let price_field = document.querySelector("#prix");
const quantity_field = document.querySelector("#quantite");
let degre_field = document.querySelector("#degre");

const btrqr = document.querySelector(".bouton--validation");
const rqrResult = document.querySelector("#rqrresult");

const numberResult = document.querySelector('#resultNumber');
let biereTabl = [];
let barsTabl = [];
let valueBiere = [];
let valueBiereSearch = [];
const colors = ["#F6E48F", "#F0AE32", "#7B2020", "#392B1F"];

fetch('scripts/bars.json')
.then(
    (response) => {
        console.log(response)
            response.json().then((bars) => {
                for (let i = 0; i < bars.length; i++) {
                    for (let y = 0; y < bars[i].bieres.length; y++) {
                        barsTabl.push([`${bars[i].name}`, `${bars[i].bieres[y].id}`, `${bars[i].bieres[y].prix}`]);
                      };
                };

                fetchBiere();

            });
    },
    (response) => {
        console.error("erreur")
    }
)

function fetchBiere() {

    fetch('scripts/biere.json')
    .then(
        (response) => {
            console.log(response);
                response.json().then((binouses) => {
                    var bieres = binouses.biere

                    for (let binouse of bieres) {
                        biereTabl.push([`${binouse.id}`, `${binouse.name}`, `${binouse.type}`, `${binouse.alcool}`]);
                    }

                    for(let j = 0; j < biereTabl.length; j++){
                            let currentId = biereTabl[j][0]
                            let currentName = biereTabl[j][1]
                            let currentType = biereTabl[j][2]
                            let currentAlcool = biereTabl[j][3]

                            for (let g = 0; g < barsTabl.length; g++){
                                if (barsTabl[g][1] == currentId){
                                    let currentBarName = barsTabl[g][0]
                                    let currentPrice = barsTabl[g][2]
                                    let currentRQR = rqr(currentAlcool, currentPrice)

                                    valueBiere.push(
                                        { name: currentName, type: currentType, alcool: currentAlcool, barName: currentBarName, prix: currentPrice, rqr: currentRQR.toFixed(1)}
                                    )

                                }
                            }
                    }

                    list.innerHTML = '';

                    valueBiere.sort(function (a, b){
                        return b.rqr - a.rqr
                    });
                    for (let k = 0; k < valueBiere.length; k++){
                        addResults(valueBiere[k], k);
                    } 

                    numberWrite(valueBiere);


                    search_field.addEventListener('input', (e) => {
                        let search_value = e.currentTarget.value
                        valueBiereSearch = []

                        if(search_value.length > 1){
                            for(let j = 0; j < biereTabl.length; j++){
                                if (biereTabl[j][1].toLowerCase().includes(search_value.toLowerCase())){
                                    let currentId = biereTabl[j][0]
                                    let currentName = biereTabl[j][1]
                                    let currentType = biereTabl[j][2]
                                    let currentAlcool = biereTabl[j][3]

                                    for (let g = 0; g < barsTabl.length; g++){
                                        if (barsTabl[g][1] == currentId){
                                            let currentBarName = barsTabl[g][0]
                                            let currentPrice = barsTabl[g][2]
                                            let currentRQR = rqr(currentAlcool, currentPrice)

                                            valueBiereSearch.push(
                                                { name: currentName, type: currentType, alcool: currentAlcool, barName: currentBarName, prix: currentPrice, rqr: currentRQR.toFixed(1)}
                                            )
                                        }
                                    }
                                }
                            }
                        }

                        if (search_value.length < 1){
                            for(let j = 0; j < biereTabl.length; j++){
                                let currentId = biereTabl[j][0]
                                let currentName = biereTabl[j][1]
                                let currentType = biereTabl[j][2]
                                let currentAlcool = biereTabl[j][3]
    
                                for (let g = 0; g < barsTabl.length; g++){
                                    if (barsTabl[g][1] == currentId){
                                        let currentBarName = barsTabl[g][0]
                                        let currentPrice = barsTabl[g][2]
                                        let currentRQR = rqr(currentAlcool, currentPrice)
                                        valueBiereSearch.push(
                                            { name: currentName, type: currentType, alcool: currentAlcool, barName: currentBarName, prix: currentPrice, rqr: currentRQR.toFixed(1)}
                                        )
                                    }
                                }
                            }
                        }

                        list.innerHTML = '';

                        valueBiereSearch.sort(function (a, b){
                            return b.rqr - a.rqr
                        });
                        for (let k = 0; k < valueBiereSearch.length; k++){
                            addResults(valueBiereSearch[k], k);
                        } 

                        numberWrite(valueBiereSearch);

                    });


                })
        },
        (response) => {
            console.error("erreur");
        }
    )

}

function numberWrite(width) {
    numberResult.textContent = `${width.length} bières trouvées`
}



function addResults(biere, idNumber) {
    let result_el = document.createElement('li');
    result_el.innerHTML = `<div id="${idNumber}"class="boitevignette">
                                <div class="boitenoms"> 
                                    <p class="nombiere">${biere.name}</p>
                                    <p class="nombar">${biere.barName}</p>
                                </div>
                                <p class="rqr">RQR ${biere.rqr}</p>
                                <img class="emoji" src="assets/images/neutral.svg">
                                <div class="boiteinfos"> 
                                    <p class="nominfos"><span class="medium">type</span><br>${biere.type}</p>
                                    <p class="nominfos"><span class="medium">degré</span><br><span class="percent">${biere.alcool}</span></p>
                                    <p class="nominfos"><span class="medium">prix/l</span><br><span class="euros">${biere.prix}</span></p>
                                </div>
                            </div>`;
    list.append(result_el);
    var elem = document.getElementById(idNumber);
    if (biere.rqr >= 5) elem.style.backgroundColor = colors[1]
    if (biere.rqr >= 7.5) {
        elem.style.backgroundColor = colors[2]
        elem.style.color = "#f4f4f4"
    }
    if (biere.rqr >= 10) {
        elem.style.backgroundColor = colors[3]
        elem.style.color = "#f4f4f4"
    }
}

btrqr.addEventListener("click", (e) =>  {
    console.log(price_field.value);
    console.log(degre_field.value)
    let prixAuLitre = (remplacer_virgule_par_point(price_field.value) / quantity_field.value) * 100
    let rqrcalculed = (remplacer_virgule_par_point(degre_field.value) / prixAuLitre) * 10
    if (isNaN(rqrcalculed) == false) {
        rqrResult.innerHTML = `RQR ${rqrcalculed.toFixed(1)}`
    }
    
})

function remplacer_virgule_par_point(decimal) {
	return parseFloat((decimal+"").replace(",","."));
}

btBar.addEventListener("click", (e) => {
    formulaireBar.classList.toggle("height");
})

formulaireBar.addEventListener("change",(e) => {
    formulaireBar.classList.remove("height");
    var inputBar = document.querySelectorAll('.input-bar');
    let j = 0
    let rqrTotal = 0
    for (let input of inputBar) {
        if ( input.checked === true ) {
            for (let i = 0; i < valueBiere.length; i++) {
                if (input.value == valueBiere[i].barName) {
                    j = j+1;
                    rqrTotal = rqrTotal + Number(valueBiere[i].rqr);
                    rqrMoyen.innerHTML = `RQR ${(rqrTotal / j).toFixed(1)}`
                    btBar.innerHTML = `${input.value}`
                }
            }
        }
    }
    console.log('je ferm')
}, true);
 
