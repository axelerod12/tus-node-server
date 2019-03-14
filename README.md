# tus-node-server

tus is a HTTP based protocol for resumable file uploads. Resumable means you can carry on where you left off without re-uploading whole data again in case of any interruptions. An interruption may happen willingly if the user wants to pause, or by accident in case of a network issue or server outage.

By default tus automatically encodes the filename before adding it to the request and this demo passes the original name together with the extension of the uploaded file and renames it when the upload has completed.

### Uppy
Uppy is a sleek, modular JavaScript file uploader that integrates seamlessly with any application. It’s fast, easy to use and lets you worry about more important problems than building a file uploader.
Check out more details in [uppy docs](https://uppy.io/docs/tus/).
```js
uppy.use(Tus, {
  endpoint: 'https://master.tus.io/files/', // use your tus endpoint here
  resume: true,
  autoRetry: true,
  retryDelays: [0, 1000, 3000, 5000]
})
```

## Installation

```bash
$ npm install tus-node-server
```

#### This is how a simple server looks like.
```js
const tus = require('tus-node-server');

const server = new tus.Server();
server.datastore = new tus.FileStore({
    path: '/files'
});

const host = '127.0.0.1';
const port = 1080;
server.listen({ host, port }, () => {
    console.log(`[${new Date().toLocaleTimeString()}] tus server listening at http://${host}:${port}`);
});
```

#### Events:

Execute code when lifecycle events happen by adding event handlers to your server.

```js
server.on(tus.EVENTS.EVENT_UPLOAD_COMPLETE, (event) => {
	const metadata = metadataStringToObject(event.file.upload_metadata).name.decoded.split('.');
	fs.rename('files/' + event.file.id, 'files/' + metadata[0] + '.' + metadata[1], function(err) {
		if ( err ) console.log('ERROR: ' + err);
	});
})

```

### Questions about this project?
Please feel free to report any bug found. Pull requests, issues, and project recommendations are more than welcome!

