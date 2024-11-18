let allPokemon = [];
let pokemonDetailJSONs = [];
let currentPokemons = [];
let start = 1;
let currentNumberOfPokemon = 21;

async function init() {
    await loadPokemon();
    removeLoader();
    showLoadMoreButton();
}

async function loadPokemon() {
    for (i = start; i < currentNumberOfPokemon; i++) { 
        let url = `https://pokeapi.co/api/v2/pokemon/${i}/`;
        let response = await fetch(url);
        let loadedPokemonAsJSON = await response.json();
        allPokemon.push(loadedPokemonAsJSON);
    }
    collectPokemonDetails();
    renderMorePokemon();
}

function collectPokemonDetails() {
    for (i = start - 1; i < allPokemon.length; i++) { 
        let currentPokemon = allPokemon[i];
        let id = currentPokemon['id'];
        let name = currentPokemon['name'];
        let sprite = currentPokemon['sprites']['other']['dream_world']['front_default'];
        let types = [];
        let stats = [];
        let height = currentPokemon['height'] / 10;
        let weight = currentPokemon['weight'] / 10;
        getPokemonTypes(currentPokemon, types);
        getPokemonStats(currentPokemon, stats);
        createPokemonDetailJSON(id, name, sprite, types, stats, height, weight);
    }
}

function getPokemonTypes(currentPokemon, types) {
    for (j = 0; j < currentPokemon['types'].length; j++) {
        let type = currentPokemon['types'][j]['type']['name'];
        types.push(type);
    }
}

function getPokemonStats(currentPokemon, stats) {
    for (j = 0; j < currentPokemon['stats'].length; j++) {
        let baseStat = currentPokemon['stats'][j]['base_stat'];
        stats.push(baseStat);
    }
}

function createPokemonDetailJSON(id, name, sprite, types, stats, height, weight) {
    let nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);
    let secondType = types[1];
    if (!secondType) {
        secondType = '';
    }
    pokemonDetailJSONs.push({
        'id': id,
        'name': nameCapitalized,
        'sprite': sprite,
        'types': {
            'first-type': types[0],
            'second-type': secondType,
        },
        'stats': {
            'hp': stats[0],
            'attack': stats[1],
            'defense': stats[2],
            'special-attack': stats[3],
            'special-defense': stats[4],
            'speed': stats[5],
        },
        'height': height,
        'weight': weight,
    })
}

async function renderMorePokemon() {
    let contentRef = document.getElementById('pokemonCardContainer');
    currentPokemons = pokemonDetailJSONs;
    for (let i = start - 1; i < currentPokemons.length; i++) {
        let currentPokemon = currentPokemons[i];
        contentRef.innerHTML += pokemonCardTemplate(i, currentPokemon);
        addColorToPreviewCard(i);
    }
}

function showPokemonOverlay(i) {
    document.body.style.overflow = 'hidden';
    let currentPokemon = currentPokemons[i];
    let contentRef = document.getElementById('pokemonDetailContainer');
    contentRef.innerHTML = '';
    contentRef.innerHTML = pokemonOverlayTemplate(i, currentPokemon);

    checkIfSecondTypeExist(i, currentPokemon);
    addColorToDetailCard(i);
    if (i == 0) {
        hidePreviousPokemonButton();
    }
    if (i == currentPokemons.length - 1) {
        hideNextPokemonButton();
    }
}

function closePokemonOverlay(i) {
    document.getElementById('pokemonOverlayContainer' + i).classList.add('d-none');
    document.body.style.overflowY = 'scroll';
}

function stopAutoClose(event) {
    event.stopPropagation();
}

function previousPokemon(i) {
    i--;
    showPokemonOverlay(i);
}

function nextPokemon(i) {
    i++;
    showPokemonOverlay(i);
}

function hidePreviousPokemonButton() {
    document.getElementById("previous__img__button").classList.add("hidden");
}

function hideNextPokemonButton() {
    document.getElementById("next__img__button").classList.add("hidden");
}

function checkIfSecondTypeExist(i, currentPokemon) {
    if (!currentPokemon['types']['second-type']) {
        document.getElementById('pokemonTypeSecond' + i).classList.add('d-none');
    }
}

function addColorToDetailCard(i) {
    let firstTypeColor = currentPokemons[i]['types']['first-type'];
    document.getElementById('pokemonSpriteContainer' + i).classList.add(firstTypeColor); 
}

function addColorToPreviewCard(i) {
    let firstTypeColor = currentPokemons[i]['types']['first-type'];
    document.getElementById('pokemon__container' + i).classList.add(firstTypeColor + `Preview`);
}

function removeLoader() {
    document.getElementById('loaderStart').classList.add('d-none');
}

async function loadMorePokemon() {
    if (allPokemonLoaded()) {
        if (currentNumberOfPokemon == 141 && start == 121) {
            start = 142;
            currentNumberOfPokemon = 152;
            loadPokemon();
            hideLoadMoreButton();
        }
        else {
            showLoadingScreen();
            start += 20;
            currentNumberOfPokemon += 20;
            await loadPokemon();
            removeLoadingScreen();
        }
    }
}

function allPokemonLoaded() {
    return currentNumberOfPokemon <= 152;
}

function showLoadMoreButton() {
    document.getElementById('loadingButton').classList.remove('d-none');
}

function hideLoadMoreButton() {
    document.getElementById('loadingButton').classList.add('d-none');
}

function showLoadingScreen() {
    document.getElementById('loadingScreenContainer').classList.remove('d-none');
}

function removeLoadingScreen() {
    document.getElementById('loadingScreenContainer').classList.add('d-none');
}

function filterPokemon() {
    let term = document.getElementById('searchBar').value;
    if (term.length >= 3) {
        currentPokemons = pokemonDetailJSONs.filter(pokemon => pokemon.name.toLowerCase().includes(term.toLowerCase()));
        hideLoadMoreButton();
        renderFilteredPokemon();
    } else {
        showLoadMoreButton();
        renderAllCurrentPokemon();
    }
}

function renderFilteredPokemon() {
    let contentRef = document.getElementById('pokemonCardContainer');
    contentRef.innerHTML = '';
    for (let i = 0; i < currentPokemons.length; i++) {
        let currentPokemon = currentPokemons[i];
        contentRef.innerHTML += pokemonCardTemplate(i, currentPokemon);
        addColorToPreviewCard(i);
    }
}

function renderAllCurrentPokemon() {
    currentPokemons = pokemonDetailJSONs;
    let contentRef = document.getElementById('pokemonCardContainer');
    contentRef.innerHTML = '';
    for (let i = 0; i < pokemonDetailJSONs.length; i++) {
        let currentPokemon = pokemonDetailJSONs[i];
        contentRef.innerHTML += pokemonCardTemplate(i, currentPokemon);
        addColorToPreviewCard(i);
    }
}




