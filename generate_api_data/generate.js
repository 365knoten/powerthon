const faker = require("faker");
const fs = require("fs");
const { resourceLimits } = require("worker_threads");

const TODAY = new Date();
const THIRTYDAYSAGO = new Date();
THIRTYDAYSAGO.setDate(THIRTYDAYSAGO.getDate() - 30);

function RANDOM(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const states = ["Bestellt", "Vorbereitung", "Verpackt", "Versandt"];

function generateHistorie(startdate) {
  const no = RANDOM(1, 3);

  const result = [
    {
      Status: "Bestellt",
      Datum: startdate,
    },
  ];
  if (no==1){
    result.push( {
        Status: "Vorbereitung",
        Datum: TODAY,
      })
  }

  if (no==2){
    result.push( {
        Status: "Vorbereitung",
        Datum: faker.date.between(startdate, TODAY),
      },
      {
        Status: "Verpackt",
        Datum: TODAY,
      })
  }

  if (no==3){
    const D1=faker.date.between(startdate, TODAY)
    const D2=faker.date.between(D1, TODAY)
    result.push( {
        Status: "Vorbereitung",
        Datum: D1,
      },
      {
        Status: "Verpackt",
        Datum: D2,
      },
      {
        Status: "Versandt",
        Datum: TODAY,
      },)
  }



  return result;
}

function generateBauteile() {
  const no = RANDOM(1, 15);


  return Array.from(Array(no).keys()).map((n) => {
    const besch = RANDOM(1, 100);
    return {
      Anzahl: faker.commerce.price(1, 20, 0),
      Name: faker.commerce.productMaterial(),
      Bauteilnummer: faker.finance.bic(),
      Hersteller: faker.company.companyName(),
      Ausfuhrbeschraenkt: besch>98,
      Einzelpreis: faker.commerce.price(100, 200, 0),
    };
  });
}

let data = Array.from(Array(50).keys()).map((item) => {
  const date = faker.date.between(THIRTYDAYSAGO, TODAY);

  return {
    Auftragsnummer: faker.finance.bic(),
    Erfassungsdatum: date,
    Aenderungsdatum: TODAY,
    Historie: generateHistorie(date),
    Bauteile: generateBauteile(date),
  };
});

console.log(data);

fs.writeFile("data.json", JSON.stringify(data), (err) => {
  if (err) {
    console.error(err);
  }
  // file written successfully
});
