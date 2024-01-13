import {io} from 'socket.io-client';
// const socket = io('http://localhost:3333', {
// 	autoConnect: false,
// });

class Socket {
	constructor() {
		this.socket = null;
	}
	connect(token) {
		this.disconnect();
		this.socket = io('ws://localhost:3333', {
			auth: {
				token,
			},
		});
	}
	disconnect() {
		this.socket?.disconnect();
		this.socket = null;
	}

	on(eventName, callback) {
		if (this.socket) {
			this.socket.on(eventName, callback);
		}
	}
	emit(eventName, ...data) {
		if (this.socket) {
			this.socket.emit(eventName, ...data);
		}
	}
	off(eventName, callbackName) {
		if (this.socket) {
			this.socket.off(eventName, callbackName);
		}
	}
}
export const socket = new Socket();
