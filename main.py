from flask import Flask, request
import requests

def read_token(file_path):
    with open(file_path, 'r') as f:
        text = f.read()
    return text

def write_token(file_path, text):
    with open(file_path, 'w') as f:
        f.write(text)

app = Flask("__name__")
token = read_token("token.txt")
header = {"X-XAPP-Token": token}

def login():
    data = {'client_id' : '9c0f129dd29c52a277b7', 'client_secret' : '76a1c714fafd2f67112cd0acf1184138'}
    res = requests.post('https://api.artsy.net/api/tokens/xapp_token', json = data)
    if res.status_code == 201:
        token = res.json()['token']
        header = {"X-XAPP-Token": token}
        write_token('token.txt', token)
    else:
        print(res.text)
        
    
@app.route("/")
def hello():
    return app.send_static_file("index.html")

@app.route("/api/search", methods=['GET'])
def search_keyword():
    param = {'q':request.args.get('keyword'), 'size':10, 'type':'artist'}
    response = requests.get('https://api.artsy.net/api/search', headers = header, params= param)       
    if response.status_code == 401:
        login()
        response = requests.get('https://api.artsy.net/api/search', headers = header, params= param)

    if response.status_code == 200:
        data = response.json()
        result = []
        for i in data["_embedded"]["results"]:
            result.append({
                'pic_url': i["_links"]["thumbnail"]["href"],
                'title': i["title"],
                'id': i["_links"]["self"]["href"].split("/")[-1]
            })
        return result
    else:
        print(response.text)
        return "Server Issue"

@app.route("/api/artist", methods = ['GET'])
def artist_info():
    id = request.args.get('id')
    response = requests.get("https://api.artsy.net/api/artists/"+id, headers = header)              
    if response.status_code == 401:
        login()
        response = requests.get("https://api.artsy.net/api/artists/"+id, headers = header) 
        
    if response.status_code == 200:
        data = response.json()
        result={
            'name': data["name"],
            'birthday': data["birthday"],
            'deathday': data["deathday"],
            'nationality': data["nationality"],
            'biography': data["biography"]
        }
        return result
    else:
        print(response.text)
        return "Server Issue"

if __name__ == "__main__": 
    app.run(port = 8080, host = "127.0.0.1")