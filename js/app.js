const maxPokemons = 1025;
const maxPerBox = 30;
const maxPerRow = 6;
const gridContainer = document.getElementById('pokemon-grid');
const boxesContainer = document.getElementById('boxes-container');

async function loadPokeData() {
  const response = await fetch("js/pokemon_complete_data.json");
  return await response.json();
}

loadPokeData().then((json) => {
  for (let k = 0; k < maxPokemons; k += 30) {
    const pokeBox = createPokeBox(k + 1)

    const container = document.createElement('div');
    container.classList.add('box-content');
    // Função para criar dinamicamente o conteúdo
    for (let i = k; i < k + maxPerBox; i += maxPerRow) {
      // Cria uma div para representar uma linha
      const row = document.createElement('div');
      row.classList.add('poke-row');
      row.style.display = 'flex'; // Define o estilo flex para que os pokémon fiquem em linha

      for (let j = i; j < i + 6; j++) {
        // Cria um span com a classe poke-container
        const pokeContainer = document.createElement('span');
        pokeContainer.classList.add('poke-container');

        // Cria a tag <img> com a imagem e dados do Pokémon
        const img = document.createElement('img');
        img.classList.add('pkm-img');
        img.src = json[j].img;
        img.alt = json[j].name;
        img.title = json[j].name;
        img.width = 80;
        img.height = 80;

        // Adiciona o evento de clique para alternar a classe 'checked'
        img.addEventListener('click', () => {
          pokeContainer.classList.toggle('checked');
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
    pokeBox.appendChild(container);
    boxesContainer.appendChild(pokeBox);
  }
})


function createPokeBox(pokeNumber) {
  const header = document.createElement('div');
  header.classList.add('box-header');
  const headerTitle = document.createElement('div');
  headerTitle.classList.add('box-title-container');
  headerTitle.textContent = `#${ pokeNumber } - #${ pokeNumber + 30 >= maxPokemons ? maxPokemons : pokeNumber + 30 }`;
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
