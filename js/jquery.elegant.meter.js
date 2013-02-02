/*
 * elegantMeter jQuery plugin
 * version 1.0
 *
 * Copyright (c) 2013 Umair Shahid (https://github.com/umair0538, umair0538@gmail.com)
 *
 * Licensed under the MIT (MIT-LICENSE.txt)
 *
 * https://github.com/umair0538/elegant-meters
 *
 */
 
jQuery.fn.elegantMeter = function(options){
    return this.each(function(){
        var o = $.extend({
			minAngle: -40,
			maxAngle: 220,
			startAngle: -40,
			meterCenterX: 142,
			meterCenterY: 145,
			needleSpeed: 1,
			needleCenterX: 107,
			needleCenterY: 11,
			backgroundImage: "images/meter3_3.png",
			needleImage: "images/needle3_3.png"
		},options);
		
		var meter = new MeterClass();
		meter.canvas = this;
		meter.needle_paddingX = o.meterCenterX;
		meter.needle_paddingY = o.meterCenterY;
		meter.background = o.backgroundImage;
		meter.needle = o.needleImage;
		meter.needle_speed = o.needleSpeed;
		meter.needle_centerX = o.needleCenterX;
		meter.needle_centerY = o.needleCenterY;
		meter.current_angle = o.startAngle;
		meter.needle_angle = o.startAngle;
		meter.min_angle = o.minAngle;
		meter.max_angle = o.maxAngle;
		$(meter.canvas).data("angle", o.startAngle);
		meter.init();
    });
};

function MeterClass(){
	this.canvas = 0;
	this.ctx = 0;
	this.content_loaded = 0;
	this.total_assets = 2;
	this.needle_paddingX = 0;
	this.needle_paddingY = 0;
	this.needleX = 0;
	this.needleY = 0;
	this.background = 0;
	this.needle = 0;
	this.meter_img = new Image();
	this.needle_img = new Image();
	this.needle_speed = 0;
	this.needle_centerX = 0;
	this.needle_centerY = 0;
	this.current_angle = 0;
	this.needle_angle = 0;
	this.min_angle = 0;
	this.max_angle = 0;
	var self = this;
	
	this.init = function(){
		this.ctx = this.canvas.getContext("2d");
		this.load_assets();
	}
	
	this.load_assets = function(){
		this.meter_img.onload = function() {
			self.signal();
		};
		this.meter_img.src = this.background;

		this.needle_img.onload = function() {
			self.signal();
		};
		this.needle_img.src = this.needle;
	}

	this.signal = function(){
		this.content_loaded++;
		
		if(this.content_loaded == this.total_assets) this.launch_meter();
	}

	this.launch_meter = function(){
		this.draw();
		this.update();
	}
	
	this.update = function(){
		window.setTimeout(function() {
			self.update();
		}, 17);
		
		this.needle_angle = $(this.canvas).data("angle");
		
		if(this.needle_angle < this.min_angle || this.needle_angle > this.max_angle)
			return 0;
		
		if(this.current_angle < this.needle_angle)
			if(this.current_angle + this.needle_speed > this.needle_angle)
				this.current_angle = this.needle_angle;
			else
				this.current_angle += this.needle_speed;
		else if(this.current_angle > this.needle_angle)
			if(this.current_angle - this.needle_speed < this.needle_angle)
				this.current_angle = this.needle_angle;
			else
				this.current_angle -= this.needle_speed;
		else
			return;
		
		this.draw();
	}
	
	this.draw = function(){
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.needleX = this.needle_paddingX - this.needle_centerX;
		this.needleY = this.needle_paddingY - this.needle_centerY;
		this.ctx.drawImage(this.meter_img, 0, 0);
		
		var x = this.needleX + this.needle_centerX 
				- (-this.needle_centerY * Math.sin(deg_to_rad(this.current_angle)) 
				+ this.needle_centerX * Math.cos(deg_to_rad(this.current_angle)));
				
		var y = this.needleY + this.needle_centerY 
				- (this.needle_centerX * Math.sin(deg_to_rad(this.current_angle)) 
				+ this.needle_centerY * Math.cos(deg_to_rad(this.current_angle)));
		
		var iangle = Math.atan(y / x);
		var h = Math.sqrt((x * x) + (y * y));
		deltaX = h * Math.cos(iangle - deg_to_rad(this.current_angle));
		deltaY = h * Math.sin(iangle - deg_to_rad(this.current_angle));
		
		if(iangle < 0){
			deltaX = -deltaX;
			deltaY = -deltaY;
		}
		
		this.ctx.rotate(deg_to_rad(this.current_angle));
		this.ctx.drawImage(this.needle_img, deltaX, deltaY);
		this.ctx.rotate(-deg_to_rad(this.current_angle));
	}
}

function deg_to_rad(degree){
	var pi = Math.PI;
	return (degree * (pi/180));
}