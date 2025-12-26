let currentPageUrl = 'https://rickandmortyapi.com/api/character'
let nextPageUrl = null;
let prevPageUrl = null;


window.onload = async () => {
    try{
        await loadCharacters(currentPageUrl);
    } catch (error){
        console.log(error);
        alert('Erro ao carregar a página');
    }

    const nextButton = document.getElementById('next-button')
    const backButton = document.getElementById('back-button')

    nextButton.addEventListener('click',loadNextPage)
    backButton.addEventListener('click',loadPreviousPage)
};

async function loadCharacters(url = currentPageUrl) {
    if (!url) {
    console.warn('URL inválida para loadCharacters:', url);
    return;
    }

    const mainContent = document.getElementById('main-content')
    mainContent.innerHTML = '';

    
    try{
        
        const response = await fetch(url);
        if(!response.ok) throw new Error (`HTTP error: ${response.status}`);
        const responseJson = await response.json();

        currentPageUrl = url;
        nextPageUrl = responseJson.info.next; 
        prevPageUrl = responseJson.info.prev; 
        
        responseJson.results.forEach((character) => {
            const card = document.createElement("div")
            card.style.backgroundImage = `url(${character.image})`
            card.className = "cards"

            const characterNameBG = document.createElement("div")
            characterNameBG.className = "character-name-bg"

            const characterName = document.createElement("span")
            characterName.className = "character-name"
            characterName.innerText = `${character.name}`

            characterNameBG.appendChild(characterName)
            card.appendChild(characterNameBG)

            card.onclick = () => {
                const modal = document.getElementById('modal')
                modal.style.visibility = "visible"

                const modalContent = document.getElementById('modal-content')
                modalContent.innerHTML = ''

                const characterImage = document.createElement("div")
                characterImage.style.backgroundImage = `url(${character.image})`
                characterImage.className = "modal-image"

                const characterDetails = document.createElement("div")
                
                const name = document.createElement("span")
                name.className = "character-details"
                name.id = "response"
                name.innerText = `Nome: ${character.name}`

                const status = document.createElement("span")
                status.className = "character-details"
                status.id = "response"
                status.innerText = `Status: ${convertStatus(character.status)}`

                const species = document.createElement("span")
                species.className = "character-details"
                species.id = "response"
                species.innerText = `Espécie: ${convertSpecie(character.species)}`

                // const type = document.createElement("span")
                // type.className = "character-details"
                // species.id = "response"
                // type.innerText = `Tipo: ${character.type}`

                const gender = document.createElement("span")
                gender.className = "character-details"
                gender.id = "response"
                gender.innerText = `Gênero: ${convertGender(character.gender)}`


                characterDetails.appendChild(name)
                characterDetails.appendChild(status)
                characterDetails.appendChild(species)
                // characterDetails.appendChild(type)
                characterDetails.appendChild(gender)

                modalContent.appendChild(characterImage)
                modalContent.appendChild(characterDetails)
            }

            mainContent.appendChild(card)
        });
        
        const nextButton = document.getElementById('next-button')
        const backButton = document.getElementById('back-button')

        nextButton.disabled = !nextPageUrl
        backButton.disabled = !prevPageUrl

        backButton.style.visibility = responseJson.info.prev? "visible" : "hidden"

        currentPageUrl = url

    } catch (error) {
        alert('Erro ao carregar os personagens')
        console.log(error)
    }
}

async function loadNextPage() {
    if (!nextPageUrl){
        alert('Não há próxima página!')
        return;
    } 

    await loadCharacters(nextPageUrl);
} 
async function loadPreviousPage() {
    if (!prevPageUrl){
        alert('Não há página anterior!')
        return;
    } 

    await loadCharacters(prevPageUrl);
} 


function hideModal(){
    const modal = document.getElementById("modal")
    modal.style.visibility = "hidden"
}


function convertStatus(status){
    const stats = {
        alive: "Vivo",
        dead: "Morto",
        unknown: "Desconhecido"
    };

    return stats[status.toLowerCase()] || status;
}
function convertSpecie(specie){
    const spc = {
        human: "Humano",
        humanoid: "Humanoide",
        robot: "Robo ",
        alien: "Alienigena",
        disease: "Virus",
        "mythological creature": "Criatura Mitológica",
        cronenberg: "Mutante",
        unknown: "Desconhecido"
    };

    return spc[specie.toLowerCase()] || specie;
}
function convertGender(gender){
    const gnd = {
        female: "Feminino",
        male: "Masculino",
        genderless: "Sem Gênero",
        unknown: "Desconhecido"
    };

    return gnd[gender.toLowerCase()] || gender;
}