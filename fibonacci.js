const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

const iterations = document.getElementById('iterations');
const sequency = document.getElementById('sequency');
const labelFibonacci = document.getElementById('label-fibonacci');

const amplify = Math.max((parseInt(params.zoom) || 1), 1);

const offsetTop = 50;

const doFibonacci = () => {
  let numInterations = parseInt(iterations.value) || 3;

  numInterations = Math.min(numInterations, 83);
  numInterations = Math.max(numInterations, 3);
  iterations.value = numInterations;


  let fibonacci = [1, 1];

  for (let index = 2; index < numInterations; index++) {
    fibonacci[index] =  fibonacci[index-2] + fibonacci[index-1];
  }

  sequency.innerHTML = "";

  const invertFibonacci = [];
  fibonacci.forEach(number => {
    invertFibonacci.unshift(number);
  });

  let fibonacciPos = {};

  fibonacciPos[`0-${invertFibonacci[0]}`] = {x:0, y:0, transform: "0px ,0px"};

  for (let index = 1; index < invertFibonacci.length; index++) {
    
    const ant = invertFibonacci[index-1];
    const pa = fibonacciPos[`${index-1}-${ant}`];
    const element = invertFibonacci[index];

    fibonacciPos[`${index}-${element}`] = getXandY(pa.x, pa.y, ant, element, index % 4 );
    
  }

  for (let index = 0; index < invertFibonacci.length; index++) {
    const number = invertFibonacci[index];
    sequency.appendChild(buildSequenciLi(number, fibonacciPos[`${index}-${number}`], index/invertFibonacci.length));
  };

  labelFibonacci.textContent = fibonacci.map(element=>maskNumber(element)).join(", ");
}

const buildSequenciLi = (element, fibonacciPos, hue) => {
  const elmHtml = document.createElement("div");
  const span = document.createElement("span");
  span.className="number";
  span.appendChild(document.createTextNode(maskNumber(element)));

  elmHtml.appendChild(span);
  elmHtml.title = element;
  elmHtml;
  elmHtml.style.setProperty("--t",  `${element*amplify}px`);
  elmHtml.style.setProperty("--hue",  parseInt(hue*255.0));
  elmHtml.style.setProperty("--transform",  fibonacciPos.transform);
  elmHtml.style.setProperty("position",  `absolute`);
  elmHtml.style.setProperty("left",  `${fibonacciPos.x*amplify}px`);
  elmHtml.style.setProperty("top",  `${(fibonacciPos.y*amplify)+offsetTop}px`);
  elmHtml.addEventListener("click", ()=>{
    sequency.classList.toggle("show");
  });
  return elmHtml;
} 

const maskNumber = (number)=>{
  let strNumber = number.toString();
  let maskedNumber = "";

  for (let index = strNumber.length-1; index >= 0; index--) {
    maskedNumber = strNumber[index] + maskedNumber;
    if((strNumber.length - index) % 3 === 0 && index>0){
      maskedNumber = "."+ maskedNumber;
    }

  }

  return maskedNumber;

}

const getXandY = (xa, ya, ta, t, index) => {
  let x, y = 0;
  let transform = "0px ,0px";
  switch(index){
    case 0:
      x = xa;
      y = ya - t;
      break;
    case 1:
      x = xa + ta;
      y = ya;
      transform = "-50%,0";
      break;
    case 2: 
      x = xa + (ta -t);
      y = ya + ta;
      transform = "-50%, -50%";
      break;
    case 3:
      x = xa - t;
      y = ya + (ta - t);
      transform = "0px, -50%";
     break;
  }

  return {x, y, transform};
}

doFibonacci();