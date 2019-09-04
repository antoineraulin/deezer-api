# api-deezer [![npm version](https://badge.fury.io/js/api-deezer.svg)](https://badge.fury.io/js/api-deezer)
Asynchronous client for Deezer's API for node.js. Requires user authentication, this package is intended to manage a user's account, modify his playlists, etc. It still allows access to the public part of the api deezer.

- [requirements](#requirements)
- [setup](#setup)
- [basic example](#example)
- [documentation](https://github.com/antoineraulin/deezer-api/wiki/)

### requirements
- node.js
- npm
- deezer api IDs (app id, secret key) [(how to)]()

### setup

#### <ins>Install with npm</ins> :
```bash
npm install api-deezer --save
```
#### <ins>Install manually</ins> :
```bash
# in your project folder
cd node_modules
git clone https://github.com/antoineraulin/deezer-api.git api-deezer
```
#### <ins>generate deezer api IDs</ins> :
- visit https://developers.deezer.com/myapps
- click on the "Create a new Application" button
- give a name to your app
- #### **If you run your program on a head-less device**:
    - the domain and the redirect URL after authentication must be accessible from a web browser (from your computer for example), it is recommended to put the local ip of your device if you are on the same network or its external ip or a domain name pointing to the device. So, for the redirect URL after authentication put `http://*.*.*.*:8765/auth` (don't forget to replace `*.*.*.*` with the local ip, external ip or domain name).
- #### **Otherwise**:
    - for the domain put `127.0.0.1` and for the redirect URL after authentication `http://127.0.0.1:8765/auth`

- For Link to your Terms of Use, a correct url will do the trick
- put a short description (10 characters min)

#### <ins>create the config file</ins> :
- create a `config.json` file in the project folder
- fill it as follows :
```json
{
    "app_id": "your app id",
    "secret_key": "the secret key",
    "url": "http://*.*.*.*:8765/auth" # replace *.*.*.* with what you need, see the section on creating deezer IDs
}
```

### example

```javascript
const deezer = require("api-deezer");

async function start(){
    await deezer.login().catch((e)=>console.error(e));
    /*
    login process:
    deezer.login() will ask you to visit a url from a browser so that you can connect to deezer with your customer IDs
    */
    console.log(await deezer.get("user"))  //returns user information
}
start();
```

For documentation click [here](https://github.com/antoineraulin/deezer-api/wiki/)