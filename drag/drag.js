/*
 *
 */

class Drag {
	constructor(obj) {
		this.id = obj.id
		this.initParameter(obj)
	}

	initParameter(obj) {
		this.targetObj = document.getElementById(obj.id)
		this.container = obj.container ? document.getElementById(obj.container) : document.body
		this.isRatio = obj.isRatio === undefined ? true : obj.isRatio
		this.initPos()
		this.initPannel()
		this.initEvent()
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

		let pointZoomScale = document.createElement('span')
		pointZoomScale.className = `dragger-operate dragger-zoom-scale ${this.id}-dragger-zoom-scale`
		this.pannelDom.appendChild(pointZoomScale)
		pointZoomScale.addEventListener('mousedown', e => {
			e.stopPropagation()
			this.moveInit('zoomScale', e, this.targetObj)
		})

		let pointDelete = document.createElement('span')
		pointDelete.className = `dragger-operate dragger-delete ${this.id}-dragger-delete`
		this.pannelDom.appendChild(pointDelete)
		pointDelete.addEventListener('mousedown', e => {
			e.stopPropagation()
			this.moveInit('delete', e, this.targetObj)
		})

		let pointAdd = document.createElement('span')
		pointAdd.className = `dragger-operate dragger-add ${this.id}-dragger-add`
		this.pannelDom.appendChild(pointAdd)
		pointAdd.addEventListener('mousedown', e => {
			e.stopPropagation()
			this.moveInit('add', e, this.targetObj)
		})

		let lineHeight = this.width > this.height ? this.width + 40 : this.height + 40
		this.levelLine = document.createElement('div')
		this.levelLine.className = `dragger-line dragger-line-level ${this.id}-dragger-line-level`
		this.levelLine.style.height = `${lineHeight}px`
		this.pannelDom.appendChild(this.levelLine)
		this.verticalLine = document.createElement('div')
		this.verticalLine.className = `dragger-line dragger-line-vertical ${this.id}-dragger-line-vertical`
		this.verticalLine.style.height = `${lineHeight}px`
		this.pannelDom.appendChild(this.verticalLine)
	}

	initEvent() {
		this.pannelDom.onmousedown = e => {
			e.stopPropagation()
			this.moveInit('move', e, this.targetObj)
		}
		this.targetObj.onmousedown = e => {
			e.stopPropagation()
			this.moveInit('move', e, this.targetObj)
			this.initPannel()
			this.pannelDom.onmousedown = e => {
				this.moveInit('move', e, this.targetObj)
			}
		}

		document.addEventListener('mousemove', this.throttle(e => {
			e.preventDefault && e.preventDefault()
			this.moveChange(e, this.targetObj)
		}, 10))
		document.addEventListener('mouseup', e => {
			this.moveLeave(this.targetObj)
		})
	}

	moveInit(type, e, target) {
		this.type = type
		this.initMouse = {
			x: Math.floor(e.clientX),
			y: Math.floor(e.clientY)
		}
		this.scale = target.offsetWidth / target.offsetHeight
		this.initAngle = this.angle
		this.initPointLeftTop = this.pointLeftTop
		this.initPointLeftMiddle = this.pointLeftMiddle
		this.initPointLeftBottom = this.pointLeftBottom
		this.initPointCenterTop = this.pointCenterTop
		this.initPointCenterMiddle = this.pointCenterMiddle
		this.initPointCenterBottom = this.pointCenterBottom
		this.initPointRightTop = this.pointRightTop
		this.initPointRightMiddle = this.pointRightMiddle
		this.initPointRightBottom = this.pointRightBottom
		this.initPosition = {
			x: this.left,
			y: this.top
		}
		this.preRadian = Math.atan2(this.initMouse.y - this.pointCenterMiddle.y, this.initMouse.x - this.pointCenterMiddle.x)
		this.canChange = true
	}

	moveChange(e, target) {
		console.log(this.type)
		if(this.canChange) {
			switch(this.type) {
				case 'move': 
					this.handleMove(e, target);
					break;
				case 'zoomScale': 
					this.handleScale(e, target);
					this.handleZoom(e, target);
					// 
					break;
				default:;
			}
		}
		
	}

	handleMove(e, target) {
		let diffX = Math.floor(e.clientX - this.initMouse.x)
		let diffY = Math.floor(e.clientY - this.initMouse.y)
		this.left = this.initPosition.x + diffX
		this.top = this.initPosition.y + diffY

		target.style.left = `${this.left}px`
		target.style.top = `${this.top}px`
		this.pannelDom.style.left = `${this.left}px`
		this.pannelDom.style.top = `${this.top}px`
		this.centerPos = {
            x: this.initPointCenterMiddle.x + diffX,
            y: this.initPointCenterMiddle.y + diffY
        }
	}

	handleZoom(e, target) {
		console.log(this.angle)
		this.pointCenterMiddle = {
			x: Math.floor((e.clientX + this.pointLeftTop.x) / 2),
			y: Math.floor((e.clientY + this.pointLeftTop.y) /2)
		}
		let newPointRightBottom = this.getRotatePoint({
			x: e.clientX,
			y: e.clientY
		}, this.pointCenterMiddle, -this.angle)
		console.log(this.pointLeftTop)
		let newPointLeftTop = this.getRotatePoint(this.pointLeftTop, this.pointCenterMiddle, -this.angle)
		console.log(newPointLeftTop)
		let newWidth = newPointRightBottom.x - newPointLeftTop.x
		let newHeight = newPointRightBottom.y - newPointLeftTop.y

		if(newWidth / newHeight > this.scale) {
			newPointRightBottom.x = newPointRightBottom.x - Math.abs(newWidth - newHeight * this.scale)
			newWidth = newHeight * this.scale
		}else {
			newPointRightBottom.y = newPointRightBottom.y - Math.abs(newHeight - newWidth / this.scale)
			newHeight = newWidth / this.scale
		}
		let rotatePointRightBottom = this.getRotatePoint(newPointRightBottom, this.pointCenterMiddle, this.angle)
		this.pointCenterMiddle = {
			x: Math.floor((rotatePointRightBottom.x + this.pointLeftTop.x) / 2),
			y: Math.floor((rotatePointRightBottom.y + this.pointLeftTop.y) / 2)
		}
		newPointLeftTop = this.getRotatePoint(this.pointLeftTop, this.pointCenterMiddle, -this.angle)
		newPointRightBottom = this.getRotatePoint(rotatePointRightBottom, this.pointCenterMiddle, -this.angle)
		console.log(newPointLeftTop)
		// console.log(newPointRightBottom)
		newWidth = newPointRightBottom.x - newPointLeftTop.x
		newHeight = newPointRightBottom.y - newPointLeftTop.y
		console.log(newWidth)
		console.log(newHeight)
		if(newWidth <= 12) {
			newWidth = 12
			newHeight = Math.floor(newWidth / this.scale)
			newPointRightBottom.x = newPointLeftTop.x + newWidth
			newPointRightBottom.y = newPointLeftTop.y + newHeight
		}
		if(newHeight <= 12) {
			newHeight = 12
			newWidth = Math.floor(newHeight * this.scale)
			newPointRightBottom.x = newPointLeftTop.x + newWidth
			newPointRightBottom.y = newPointLeftTop.y + newHeight
		}
		if(newWidth > 12 && newHeight > 12) {
			this.left = newPointLeftTop.x
			this.top = newPointLeftTop.y
			this.width = newWidth
			this.height = newHeight
			target.style.left = `${this.left}px`
			target.style.top = `${this.top}px`
			target.style.width = `${this.width}px`
			target.style.height = `${this.height}px`
			this.pannelDom.style.left = `${this.left}px`
			this.pannelDom.style.top = `${this.top}px`
			this.pannelDom.style.width = `${this.width}px`
			this.pannelDom.style.height = `${this.height}px`

			let lineHeight = this.width > this.height ? this.width + 40 : this.height + 40
			this.levelLine.style.height = `${lineHeight}px`
			this.verticalLine.style.height = `${lineHeight}px`
		}
	}

	handleScale(e, target) {
		this.currRadian = Math.atan2(Math.floor(e.clientY) - this.pointCenterMiddle.y, Math.floor(e.clientX) - this.pointCenterMiddle.x)
		this.transformRadian = this.currRadian - this.preRadian
		this.angle = this.getRotate(target) + Math.round(this.transformRadian / Math.PI * 180)
		if(Math.abs(this.angle)<2) {
			this.angle = 0
			this.levelLine.style.display = 'block'
			this.verticalLine.style.display = 'block'
		}else {
			this.levelLine.style.display = 'none'
			this.verticalLine.style.display = 'none'
		}
		target.style.transform = `rotate(${this.angle}deg)`
		this.pannelDom.style.transform = `rotate(${this.angle}deg)`
		this.preRadian = this.currRadian
        let diffAngle = this.angle - this.initAngle
		this.pointLeftTop = this.getRotatePoint(this.initPointLeftTop, this.pointCenterMiddle, diffAngle) 
		this.pointLeftMiddle = this.getRotatePoint(this.initPointLeftMiddle, this.pointCenterMiddle, diffAngle) 
		this.pointLeftBottom = this.getRotatePoint(this.initPointLeftBottom, this.pointCenterMiddle, diffAngle) 
		this.pointCenterTop = this.getRotatePoint(this.initPointCenterTop, this.pointCenterMiddle, diffAngle) 
		this.pointCenterBottom = this.getRotatePoint(this.initPointCenterBottom, this.pointCenterMiddle, diffAngle) 
		this.pointRightTop = this.getRotatePoint(this.initPointRightTop, this.pointCenterMiddle, diffAngle) 
		this.pointRightMiddle = this.getRotatePoint(this.initPointRightMiddle, this.pointCenterMiddle, diffAngle) 
		this.pointRightBottom = this.getRotatePoint(this.initPointRightBottom, this.pointCenterMiddle, diffAngle) 
	}

	moveLeave() {
		console.log('leave')
		this.levelLine.style.display = 'none'
		this.verticalLine.style.display = 'none'
		this.canChange = false
		this.getTransferPosition(this.left, this.top, this.width, this.height, this.angle, this.pointCenterMiddle)
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
			y: Math.floor((curPos.x - centerPos.x) * Math.sin(Math.PI / 180 * angle) + (curPos.y - centerPos.y) * Math.cos(Math.PI / 180 * angle) + centerPos.y)
		}
	}

	getTransferPosition (left, top, width, height, angle, center) {
		//左上角
		let pointLeftTop = {
			x: left,
			y: top
		}
		//左中角
		let pointLeftMiddle = {
			x: left,
			y: top + height / 2
		}
		//左下角
		let pointLeftBottom = {
			x: left,
			y: top + height
		}
		//中上角
		let pointCenterTop = {
			x: left + width / 2,
			y: top
		}
		//中下角
		let pointCenterBottom = {
			x: left + width / 2,
			y: top + height
		}
		//右上角
		let pointRightTop = {
			x: left + width,
			y: top
		}
		//右中角
		let pointRightMiddle = {
			x: left + width,
			y: top + height / 2
		}
		//右下角
		let pointRightBottom = {
			x: left + width,
			y: top + height
		}
		this.pointLeftTop = this.getRotatePoint(pointLeftTop, center, angle)
		this.pointLeftMiddle = this.getRotatePoint(pointLeftMiddle, center, angle)
		this.pointLeftBottom = this.getRotatePoint(pointLeftBottom, center, angle)
		this.pointCenterTop = this.getRotatePoint(pointCenterTop, center, angle)
		this.pointCenterBottom = this.getRotatePoint(pointCenterBottom, center, angle)
		this.pointRightTop = this.getRotatePoint(pointRightTop, center, angle)
		this.pointRightMiddle = this.getRotatePoint(pointRightMiddle, center, angle)
		this.pointRightBottom = this.getRotatePoint(pointRightBottom, center, angle)
	}

	throttle(fn, interval) {
		let canRun = true;
		return function () {
			if(!canRun) return;
			canRun = false;
			setTimeout(()=>{
				fn.apply(this, arguments);
				canRun = true;
			}, interval)
		}
	}
}
