/*
 *
 */

class Drag {
	constructor(obj) {
		this.id = obj.id
		this.initparameter(obj)
	}

	initparameter(obj) {
		this.targetObj = document.getElementById(obj.id)
		this.container = obj.container ? document.getElementById(obj.container) : document.body
		this.initPos()
		this.initPannel()
	}

	initPos() {
		this.left = this.targetObj.offsetLeft
		this.top = this.targetObj.offsetTop
		this.width = this.targetObj.offsetWidth
		this.height = this.targetObj.offsetHeight
		this.angle = this.getRotate(this.targetObj)
		//左上角
		this.pointLeftTop = {
			x: this.left,
			y: this.top
		}
		//左中角
		this.pointLeftMiddle = {
			x: this.left,
			y: this.top + this.height / 2
		}
		//左下角
		this.pointLeftBottom = {
			x: this.left,
			y: this.top + this.height
		}
		//中上角
		this.pointCenterTop = {
			x: this.left + this.width / 2,
			y: this.top
		}
		//中心角
		this.pointCenterMiddle = {
			x: this.left + this.width / 2,
			y: this.top + this.height / 2
		}
		//中下角
		this.pointCenterBottom = {
			x: this.left + this.width / 2,
			y: this.top + this.height
		}
		//右上角
		this.pointRightTop = {
			x: this.left + this.width,
			y: this.top
		}
		//右中角
		this.pointRightMiddle = {
			x: this.left + this.width,
			y: this.top + this.height / 2
		}
		//右下角
		this.pointRightBottom = {
			x: this.left + this.width,
			y: this.top + this.height
		}
	}

	initPannel() {
		this.pannelDom = document.querySelector('#pannel')
		if(!this.pannelDom) {
			this.pannelDom = document.createElement('div')
			this.pannelDom.id = 'pannel'
			this.container.appendChild(this.pannelDom)
		}else {
			this.pannelDom.innerHTML = ''
		}
		this.initPannelDom()
	}

	initPannelDom() {
		this.pannelDom.style.left = `${this.left}px`
		this.pannelDom.style.top = `${this.top}px`
		this.pannelDom.style.width = `${this.width}px`
		this.pannelDom.style.height = `${this.height}px`
		this.pannelDom.style.transform = `rotate(${this.angle}deg)`

		let zoomScalePoint = document.createElement('span')
		zoomScalePoint.className = `dragger-operate dragger-zoom-scale ${this.id}-dragger-zoom-scale`
		this.pannelDom.appendChild(zoomScalePoint)
		zoomScalePoint.addEventListener('mousedown', e => {
			e.stopPropagation()
			this.moveInit('zoomScale', e, this.targetObj)
		})

		let deletePoint = document.createElement('span')
		deletePoint.className = `dragger-operate dragger-delete ${this.id}-dragger-delete`
		this.pannelDom.appendChild(deletePoint)
		deletePoint.addEventListener('mousedown', e => {
			e.stopPropagation()
			this.moveInit('delete', e, this.targetObj)
		})

		let addPoint = document.createElement('span')
		addPoint.className = `dragger-operate dragger-add ${this.id}-dragger-add`
		this.pannelDom.appendChild(addPoint)
		addPoint.addEventListener('mousedown', e => {
			e.stopPropagation()
			this.moveInit('add', e, this.targetObj)
		})
	}

	moveInit() {

	}

	getRotate(target) {
		let st = window.getComputedStyle(target, null);
		let tr = st.getPropertyValue("-webkit-transform") ||
	    st.getPropertyValue("-moz-transform") ||
	    st.getPropertyValue("-ms-transform") ||
	    st.getPropertyValue("-o-transform") ||
	    st.getPropertyValue("transform") || "none";

	    let angle = 0
	    if(tr !== 'none') {
	    	let matrixs = tr.split('(')[1].split(')')[0].split(',')
	    	let a = matrixs[0];
	    	let b = matrixs[1];
	    	let c = matrixs[2];
	    	let d = matrixs[3];
	    	angle = Math.round(Math.atan2(b, a) * (180 / Math.PI))
	    	if(angle < 0) {
	    		angle += 360
	    	}
	    }
	    return angle
	}

	getRotatePoint(curPos, centerPos, angle) {
		return {
			x: Math.floor((curPos.x - centerPos.x) * Math.cos(Math.PI / 180 * angle) - (curPos.y - centerPos.y) * Math.sin(Math.PI / 180 * angle) + centerPos.x),
			y: Math.floor((curPos.x - centerPos.x) * Math.sin(Math.PI / 180 * angle) - (curPos.y - centerPos.y) * Math.cos(Math.PI / 180 * angle) + centerPos.y)
		}
	}

	throttle(fn, interval) {
		let canRun = true;
		return function () {
			if(canRun) return;
			canRun = false;
			setTimeout(()=>{
				fn.apply(this, arguments);
				canRun = true;
			}, interval)
		}
	}
}
