const $container = $('#pokemon-container');
const $loadingScreen = $('#loading-screen');
const $progressBar = $('#loading-progress');
const $body = $('body');

// the array index is the same as the pokemon id for ease of lookup/reference

let pokemonObjects = [];

const pokeTypeColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    grass: '#7AC74C',
    electric: '#F7D02C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dark: '#705746',
    dragon: '#6F35FC',
    steel: '#B7B7CE',
    fairy: '#D685AD'
};

// shows and hides loading screen animation, and hides pokemon data

function showLoadingScreen() {
    $container.hide();
    $loadingScreen.show();

    $body.height('100vh');

    setTimeout(pokeCall, 2000);
}

function hideLoadingScreen() {
    $loadingScreen.hide();
    $container.show()

    $body.height('unset');
}

function generatePokemonCards() {
    for (let pokemon of pokemonObjects) {
        const $pokeItem = `<div id="${pokemon.id}" class="card ${pokemon.types.primaryType}">
                                <span>#${pokemon.id}</span>
                                <img src="${pokemon.sprite}">
                                <h3>${pokemon.name}</h3>
                            </div>`;
        $container.append($pokeItem);
    }
}

// gets stats infromation and constructs the stats object within the Pokemon object

function createStatsObject(pokemonStats) {
    let statsObject = [];
    for (let pokemonStat of pokemonStats) {
        statsObject.push({
            name: pokemonStat.stat.name,
            base: pokemonStat.base_stat
        });
    }

    return statsObject;
}

// calls list of pokemon data from API

async function pokeCall() {

    // showLoadingScreen();

    const response = await axios.get('https://pokeapi.co/api/v2/pokemon/', { params: { limit: 151 }});
    const pokeList = response.data.results;

    let count = 1;
    for (let pokemon of pokeList) {
        pokemonObjects.push({
            id: count,
            name: pokemon.name
        });

        count++;
    }

    for (let pokemon of pokemonObjects) {
        const specResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`);
        const sprite = specResponse.data.sprites.front_default;
        const primaryType = specResponse.data.types[0].type.name;
        let secondaryType;
        
        if (specResponse.data.types[1]) {
            secondaryType = specResponse.data.types[1].type.name;
        }

        const stats = createStatsObject(specResponse.data.stats);

        pokemon['types'] = { primaryType, secondaryType };
        pokemon['sprite'] = sprite;
        pokemon['stats'] = stats;
    }

    generatePokemonCards();

    hideLoadingScreen();

    console.log(pokemonObjects)
}

showLoadingScreen();

//$('h1').on('click', pokeCall);