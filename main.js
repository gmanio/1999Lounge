/**
 * @description 1999 라운지 모드버스 전용 소켓서버
 * @class
 * @name nts._1999Lounge_
 * @author gman.park
 * @version 0.0.1
 * @since April 09, 2015
 * @copyright Copyright (c) 2015, NHN Technology Services inc.
 */
var nts = nts || {};
/**
 * @description 서버 설정 정보
 */
var conf = require(process.cwd() + '/config/config');
/**
 * @description 노드 모듈
 */
var net = require('net');

/**
 * oServer
 * @private
 */
nts._1999Lounge_ = function () {
	this.Initialize.apply(this, arguments);
};

nts._1999Lounge_.prototype = {
	aSocketPool: [],
	Initialize: function () {
		this.oServer = net.createServer();
		this.oServer.listen(conf["server"].port);
		this.request = new net.Socket();
		this.request.connect(conf["socket"].port, conf["socket"].host, this._modRequestHandler.bind(this));
		this.attachedEvent();
	},
	attachedEvent: function () {
		this.oServer.on('connection', this._onServerConnect.bind(this));
		this.request.on('data', this._modRequestOnData.bind(this));
	},
	_onServerConnect: function(oSocket){
		this.aSocketPool.push(oSocket);
		console.log(this.aSocketPool.length);
		oSocket.on('close', function () {
			var index = this.aSocketPool.indexOf(this);
			if (index > -1) {
				this.aSocketPool.splice(index, 1);
			}
		}.bind(this))
	},
	_modRequestHandler: function () {
		var frontLightBuffer = new Buffer(conf["socket"].sElevatorRequestSignal);
		var backLightBuffer = new Buffer(conf["socket"].sDoorRequestSignal);
		setInterval(function () {
			this.request.write(frontLightBuffer);
			this.request.write(backLightBuffer);
		}.bind(this),1000);
	},
	_modRequestOnData: function (data) {
		if (this.aSocketPool.length >= 2) {
			this._sendSignalToClient();
		}
	},
	_sendSignalToClient: function(){
		for(var index in this.aSocketPool){
			this.aSocketPool[index].write(new Buffer([0]));
		}
	}
}

serverRun = new nts._1999Lounge_();