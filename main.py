from flask import Flask, request, jsonify, send_from_directory, redirect
app = Flask(__name__, static_url_path='', static_folder='.')
import logging
import time
import json
import os

root_dir = os.path.dirname(os.path.abspath(__file__))

# Set up the logging
logging.basicConfig(level=logging.INFO)

@app.route('/')
def root():
    return send_from_directory(os.path.join(app.static_folder, 'rokurofy'), 'index.html')

@app.route('/rokurofy/main.py', methods=['GET', 'POST'])
def main():
    #print all the data received from the index.html through the POST request with URI component
    logging.info('Request received')
    logging.info(request)
    logging.info(request.data)
    logging.info(request.args)
    logging.info(request.form)

    #save the data received from the index.html through the POST request with URI component and this structure `playlist=${encodeURIComponent(playlistName)}&playlistImage=${encodeURIComponent(playlistImage)}&playlistDescription=${encodeURIComponent(playlistDescription)}&playlistSongs=${encodeURIComponent(JSON.stringify(playlistSongs))}`, on playlist.json
    playlistName = request.form.get('playlist')
    playlistImage = request.form.get('playlistImage')
    playlistDescription = request.form.get('playlistDescription')

    file_path = 'rokurofy/playlists.json'

    # Intenta leer el archivo existente y cargarlo como una lista
    try:
        with open(file_path, 'r') as file:
            playlists = json.load(file)
    except FileNotFoundError:
        # Si el archivo no existe, inicializa una lista vacía
        playlists = []
        
        
    # Añade el nuevo objeto a la lista y añadele un id unico
    if playlistName != '':
        playlists.append({
            'playlistName': str(playlistName),
            'playlistImage': playlistImage,
            'playlistDescription': str(playlistDescription),
            'playlistSongs': '',
            'playlistId': str(time.time()).replace('.', '')
        })

        # Reescribe el archivo completo con la lista actualizada
        with open(file_path, 'w') as file:
            json.dump(playlists, file, indent=4)  # El argumento indent hace que el JSON sea más legible

        print("Playlist added successfully")
        return jsonify({'success': 'Playlist added successfully'})
    
    else:
        print("Playlist name is empty. Skipping addition")
        return jsonify({'error': 'Playlist name is empty. Skipping addition'})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)