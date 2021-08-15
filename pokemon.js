const $container = $('#pokemon-container');
const $loadingScreen = $('#loading-screen');
const $progressBar = $('#loading-progress');
const $header = $('header');
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
    $header.hide();
    $loadingScreen.show();

    $body.height('100vh');

    setTimeout(pokeCall, 1500);
}

function hideLoadingScreen() {
    $loadingScreen.hide();
    $container.show()
    $header.show();

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


// handle click event on card to display more information

function handleCardClick(evt) {
    evt.preventDefault();

    $targetCard = $(evt.currentTarget);
    targetPokemon = $targetCard.attr('id');

    const $modalPane = generateModalHtml(pokemonObjects[targetPokemon - 1]);
    $body.append($modalPane);
}

$container.on('click', '.card', handleCardClick);


// generate modal HTML 

function generateModalHtml(selectPoke) {

    const $modalPane = `
        <div class="card-modal">
            <div id="modal-close"><p>&times;</p></div>
            <div class="selected-card">
            ${generateSelectedCardHtml(selectPoke)}
            </div>
        </div>`;

    return $modalPane;
}


// generate selected card HTML 

function generateSelectedCardHtml(selectPoke) {

    return `<div class="poke-photo-container ${selectPoke.types.primaryType}">
                <span>#${selectPoke.id}</span>
                <img src="${selectPoke.sprite}">
                <h3>${selectPoke.name}</h3>
            </div>
            <div class="type-container">
                <div class="${selectPoke.types.primaryType}">${selectPoke.types.primaryType}</div>
                ${ selectPoke.types.secondaryType ? `<div class="${selectPoke.types.secondaryType}">${selectPoke.types.secondaryType}</div>` : '' }
            </div>
            <div class="stats-container">
                ${ generateStatsHtml(selectPoke) }
            </div>`;
}


// generate the HTML for the stats panel

function generateStatsHtml(selectPoke) {
    
    return `<li>${selectPoke.stats[0].name} : ${selectPoke.stats[0].base}</li>
            <li>${selectPoke.stats[1].name} : ${selectPoke.stats[1].base}</li>
            <li>${selectPoke.stats[2].name} : ${selectPoke.stats[2].base}</li>
            <li>${selectPoke.stats[3].name} : ${selectPoke.stats[3].base}</li>
            <li>${selectPoke.stats[4].name} : ${selectPoke.stats[4].base}</li>
            <li>${selectPoke.stats[5].name} : ${selectPoke.stats[5].base}</li>`;
}


// close modal window

$body.on('click', '#modal-close', () => {
    $('.card-modal').remove();
});


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