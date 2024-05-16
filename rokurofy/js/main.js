fetch('/rokurofy/songs/songs.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const searchInput = document.getElementById('search-bar');
        const resultsContainer = document.getElementById('results');
        const previousSongs = [];

        function createSongCard(song) {
            const card = document.createElement('div');
            card.classList.add('song-card');

            const song_name = document.createElement('h3');
            song_name.textContent = song.song_name;
            card.appendChild(song_name);

            const artist = document.createElement('p');
            artist.textContent = song.artist;
            card.appendChild(artist);

            // Agregar un evento de clic a la tarjeta
            card.addEventListener('click', () => {
                webplayer(song);
            });

            return card;
        }

        function searchSongs() {
            const searchTerm = normalize(searchInput.value.toLowerCase());
            const filteredSongs = data.filter(song => {
                const song_name = normalize(song.song_name.toLowerCase());
                const artist = normalize(song.artist.toLowerCase());
                return song_name.includes(searchTerm) || artist.includes(searchTerm);
            });

            displayResults(filteredSongs);
        }

        function normalize(str) {
            return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }

        function displayResults(songs) {
            resultsContainer.textContent = '';

            if (songs.length === 0) {
                const noResults = document.createElement('p');
                noResults.id = 'no-results';
                noResults.textContent = 'No se encontraron resultados';
                resultsContainer.appendChild(noResults);
                return;
            }

            songs.forEach(song => {
                const card = createSongCard(song);
                resultsContainer.appendChild(card);
            });
        }

        searchInput.addEventListener('input', searchSongs);
    })
    .catch(error => {
        console.error('Error:', error);
    });

function webplayer(song) {
    // Eliminar el contenedor de reproductor web existente, si existe
    const existingPlayer = document.querySelector('.webplayer-container');
    if (existingPlayer) {
        existingPlayer.remove();
    }

    //Iniciar un reproductor web con la canción seleccionada en la parte de abajo de la web
    const playerContainer = document.createElement('div');
    playerContainer.classList.add('webplayer-container');
    const songName = document.createElement('h1');
    songName.textContent = song.song_name;
    playerContainer.appendChild(songName);
    const artist = document.createElement('p');
    artist.textContent = song.artist;
    playerContainer.appendChild(artist);

    // Crear el indicador de carga
    const loadingIndicator = document.createElement('div');
    loadingIndicator.textContent = 'Cargando...';
    playerContainer.appendChild(loadingIndicator);

    // Crear el elemento de audio
    const audio = new Audio();
    audio.src = song.url;

    // Mostrar el indicador de carga mientras la canción se está cargando
    audio.addEventListener('loadstart', () => {
        loadingIndicator.style.display = 'block';
    });

    // Ocultar el indicador de carga cuando la canción esté lista para reproducirse
    audio.addEventListener('canplaythrough', () => {
        loadingIndicator.style.display = 'none';
    });

    playerContainer.appendChild(audio);

    audio.play();

    // Crear el botón de reproducción/pausa
    const playPauseButton = document.createElement('button');

    // Definir la función de actualización del botón
    function updateButton() {
        if (audio.paused) {
            playPauseButton.innerHTML = '<i class="fa-solid fa-play"></i>';
        } else {
            playPauseButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
        }
    }

    // Agregar el evento de clic al botón
    playPauseButton.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
        updateButton();
    });

    // Actualizar el botón inicialmente
    updateButton();

    playerContainer.prepend(playPauseButton);

    // Append the player container to the bottom of the web page
    document.body.appendChild(playerContainer);

    // Agregar la canción a la lista de canciones reproducidas anteriormente
    previousSongs.push(song);
}