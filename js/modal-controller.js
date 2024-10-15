function savePokemonData(pokemonId, isObtained) {
  localStorage.setItem(pokemonId, isObtained);
}

function loadAllPokemonData() {
  let allData = '';

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    let value = localStorage[key];
    allData += `${ key } = ${ value }\n`;
  }
  return allData.trim(); // Remove o último \n desnecessário
}

function saveAllPokemonData(importedData) {
  localStorage.clear()
  const lines = importedData.trim().split('\n');
  lines.forEach(line => {
    const [ id, status ] = line.split(' = ');
    if (id && status) {
      localStorage.setItem(id, status);
    }
  });
}

function openExportModal() {
  // Preenche o textarea com os dados atuais
  document.getElementById('exportTextarea').value = loadAllPokemonData();
  document.getElementById('exportModal').style.display = 'block';
}

function closeExportModal() {
  document.getElementById('exportModal').style.display = 'none';
}

function openImportModal() {
  document.getElementById('importModal').style.display = 'block';
}

function closeImportModal() {
  document.getElementById('importModal').style.display = 'none';
}

function copyToClipboard() {
  const textarea = document.getElementById('exportTextarea');
  textarea.select();
  document.execCommand('copy');
  alert('Dados copiados para a área de transferência!');
}

function importPokemonData() {
  const importedData = document.getElementById('importTextarea').value;
  if (importedData) {
    saveAllPokemonData(importedData);
    alert('Dados importados com sucesso!');
    closeImportModal();
    window.location.reload();
  } else {
    alert('Por favor, insira os dados.');
  }
}
