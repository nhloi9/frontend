import {io} from 'socket.io-client';
import {backendHost} from './Constants';

class Socket {
	constructor() {
		this.socket = null;
	}
	connect(token) {
		this.disconnect();
		this.socket = io('ws://' + backendHost, {
			// this.socket = io('ws://' + backendHost, {
			withCredentials: true,
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
