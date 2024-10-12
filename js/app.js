document.cookie = "meuCookie=valor; SameSite=Lax; Secure";

const maxPokemons = 1025;
const maxPerBox = 30;
const maxPerRow = 6;
const boxesContainer = document.getElementById('boxes-container');

async function loadPokeData() {
  const response = await fetch("js/pokemon_complete_data.json");
  return await response.json();
}

loadPokeData().then((json) => {
  for (let k = 0, box = 1; k < maxPokemons; k += 30, box++) {
    const pokeBox = createPokeBox(k)
    pokeBox.id = `${ k + 1 }`;

    const container = document.createElement('div');
    container.classList.add('box-content');
    let checkedCount = 0;
    // Função para criar dinamicamente o conteúdo
    for (let i = k; i < k + maxPerBox; i += maxPerRow) {
      // Cria uma div para representar uma linha
      const row = document.createElement('div');
      row.classList.add('poke-row');
      row.style.display = 'flex'; // Define o estilo flex para que os pokémon fiquem em linha

      for (let j = i; j < i + 6; j++) {
        // Cria um span com a classe poke-container
        const pokeContainer = document.createElement('span');
        pokeContainer.id = `pkm-${ j + 1 }`
        pokeContainer.classList.add('poke-container');

        // Cria a tag <img> com a imagem e dados do Pokémon
        const img = document.createElement('img');
        img.classList.add('pkm-img');
        img.src = json[j].img;
        img.alt = json[j].name;
        img.title = json[j].name;
        img.width = 80;
        img.height = 80;

        if (checkPokeOnStorage(json[j].number)) {
          pokeContainer.classList.add('checked');
          checkedCount++;
        }

        // Adiciona o evento de clique para alternar a classe 'checked'
        img.addEventListener('click', () => {
          const pokeNumber = json[j].number;
          savePokeOnStorage(pokeNumber);
          pokeContainer.classList.toggle('checked');
          if (pokeContainer.classList.contains('checked')) {
            checkedCount++;
          } else {
            checkedCount--;
          }
          updateCheckedCount(box, checkedCount)
        });

        const tooltip = createTooltip(json[j])

        if (j < maxPokemons) {
          pokeContainer.appendChild(img);
          pokeContainer.appendChild(tooltip);
        }
        // Adiciona o pokeContainer à linha
        row.appendChild(pokeContainer);
      }
      // Adiciona a linha ao container principal
      container.appendChild(row);

    }
    const boxFooter = createBoxFooter(box, checkedCount);

    container.appendChild(boxFooter);
    pokeBox.appendChild(container);
    boxesContainer.appendChild(pokeBox);
  }

  checkStats()
})


function createPokeBox(firstPoke) {
  const header = document.createElement('div');
  header.classList.add('box-header');
  const headerTitle = document.createElement('div');
  headerTitle.classList.add('box-title-container');
  headerTitle.textContent = `#${ firstPoke + 1 } - #${ firstPoke + 30 >= maxPokemons ? maxPokemons : firstPoke + 30 }`;
  header.appendChild(headerTitle);
  const pokeBox = document.createElement('div');
  pokeBox.classList.add('poke-box');
  pokeBox.appendChild(header);

  return pokeBox;
}

function createTooltip(poke) {
  const tooltip = document.createElement('span');
  tooltip.classList.add('tooltip');
  tooltip.textContent = `${ poke.name } (#${ poke.number })`;
  const greenLine = document.createElement('span');
  greenLine.classList.add('green-line');
  tooltip.appendChild(greenLine);
  const arrow = document.createElement('span');
  arrow.classList.add('arrow');
  tooltip.appendChild(arrow);
  return tooltip;
}

function createBoxFooter(boxNumber, checkedCount) {
  const boxFooter = document.createElement('div');
  boxFooter.classList.add('box-footer');


  const checkedNumberSpan = document.createElement('span');
  checkedNumberSpan.id = `check-count-${ boxNumber }`;
  checkedNumberSpan.innerText = `${ checkedCount } / ${ maxPerBox }`;

  const fillButtonContainer = createFillButton(boxNumber);
  boxFooter.appendChild(checkedNumberSpan);
  boxFooter.appendChild(fillButtonContainer);

  return boxFooter;
}

function updateCheckedCount(boxNumber, checkedCount) {
  const checkedNumberSpan = document.getElementById(`check-count-${ boxNumber }`);
  checkedNumberSpan.innerText = `${ checkedCount } / ${ maxPerBox }`;
  updateStats()
}

function createFillButton(boxNumber) {
  const fillButtonContainer = document.createElement('div');
  fillButtonContainer.classList.add('fill-box-container');
  const fillButton = document.createElement('img');
  fillButton.id = `box-${ boxNumber }`
  fillButton.classList.add('fill-box-icon');
  if (isBoxFull(boxNumber)) {
    fillButton.src = "img/non-full-box.png";
    fillButtonContainer.classList.add('checked');
  } else {
    fillButton.src = "img/full-box.png";
  }
  fillButton.addEventListener('click', () => {
    if (fillButtonContainer.classList.contains('checked')) {
      fillButtonContainer.classList.remove('checked');
      fillButtonContainer.children[0].src = "img/full-box.png";
      toggleAllPokeInBox(boxNumber)
      return;
    }
    fillButtonContainer.classList.add('checked');
    toggleAllPokeInBox(boxNumber, false)
    fillButtonContainer.children[0].src = "img/non-full-box.png";
  });

  const buttonText = document.createTextNode("Preencher Box");
  fillButtonContainer.appendChild(fillButton);
  fillButtonContainer.appendChild(buttonText);

  return fillButtonContainer;
}

function toggleAllPokeInBox(boxNumber, check = true) {
  const endPkmNum = (maxPerBox * boxNumber);
  const startPkmNum = endPkmNum - maxPerBox;
  let checkedCount = 0;
  for (let pkmNum = startPkmNum; pkmNum < (endPkmNum > maxPokemons ? maxPokemons : endPkmNum); pkmNum++) {
    const poke = document.getElementById(`pkm-${ pkmNum + 1 }`)
    checkedCount++;
    if (check) {
      poke.classList.add('checked');
      localStorage.setItem((pkmNum + 1).toString().padStart(3, '0'), '0');
      continue;
    }
    poke.classList.remove('checked');
    localStorage.setItem((pkmNum + 1).toString().padStart(3, '0'), '1');
  }
  if (check) {
    updateCheckedCount(boxNumber, checkedCount)
    return;
  }
  updateCheckedCount(boxNumber, 0)
}

function isBoxFull(boxNumber) {
  const endPkmNum = (maxPerBox * boxNumber);
  const startPkmNum = endPkmNum - maxPerBox;
  let isFilled = true;
  for (let pkmNum = startPkmNum; pkmNum < endPkmNum; pkmNum++) {
    if (checkPokeOnStorage((pkmNum + 1).toString().padStart(3, '0'))) {
      isFilled = false;
      break;
    }
  }
  return isFilled
}

function savePokeOnStorage(pokeNumber) {
  if (localStorage.getItem(pokeNumber) != null && localStorage.getItem(pokeNumber) === "0") {
    localStorage.setItem(pokeNumber, '1');
  } else {
    localStorage.setItem(pokeNumber, '0');
  }
}

function updateStats() {
  const checkedNumberSpan = document.getElementById("caught-count");
  const checkedDivsCount = countCheckedDivs()
  localStorage.setItem("caught-count", `${ checkedDivsCount }`);
  checkedNumberSpan.innerText = `${ checkedDivsCount } / ${ maxPokemons }`;
}

function countCheckedDivs() {
  // Seleciona todas as divs com as classes 'poke-container' e 'checked'
  const checkedPokeContainers = document.querySelectorAll('.poke-container.checked');
  return checkedPokeContainers.length;
}

function checkStats() {
  if (localStorage.getItem("caught-count") == null) {
    localStorage.setItem("caught-count", `${ 0 }`);
  }
  updateStats()
}

function checkPokeOnStorage(pokeNumber) {
  return localStorage.getItem(pokeNumber) != null && localStorage.getItem(pokeNumber) === "0";
}
