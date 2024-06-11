from flask import Flask, request, jsonify, send_from_directory
app = Flask(__name__, static_url_path='', static_folder='.')
import logging
import time
import json
import os
import csv

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

    #save the data received from the index.html through the POST request with URI component on playlist.json
    playlistName = request.args.get('playlistName')
    playlistImage = request.args.get('playlistImage')
    playlistDescription = request.args.get('playlistDescription')
    playlistSongs = request.args.get('playlistSongs')

    with open('playlist.json', 'w') as f:
        #append the data to the file
        f.write(json.dumps({'playlistName': playlistName, 'playlistImage': playlistImage, 'playlistDescription': playlistDescription, 'playlistSongs': playlistSongs}))

        return jsonify({'response': 'Playlist created successfully!'})



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)