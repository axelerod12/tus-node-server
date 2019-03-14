const tus = require('tus-node-server');
const fs = require('fs');
const server = new tus.Server();
server.datastore = new tus.FileStore({
    path: '/files'
});

const host = '127.0.0.1';
const port = 1080;

const metadataStringToObject = (metadata_string) => {
    const kv_pair_list = metadata_string.split(',');
    return kv_pair_list.reduce((metadata, kv_pair) => {
		const [key, base64_value] = kv_pair.split(' ');
		metadata[key] = {
			encoded: base64_value,
			decoded: Buffer.from(base64_value, 'base64').toString('ascii'),
		};
		return metadata;
    }, {});
}

server.on(tus.EVENTS.EVENT_UPLOAD_COMPLETE, (event) => {
	const metadata = metadataStringToObject(event.file.upload_metadata).name.decoded.split('.');
	fs.rename('files/' + event.file.id, 'files/' + metadata[0] + '.' + metadata[1], function(err) {
		if ( err ) console.log('ERROR: ' + err);
	});
})


server.listen({ host, port }, () => {
    console.log(`[${new Date().toLocaleTimeString()}] tus server listening at http://${host}:${port}`);
});
