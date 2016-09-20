module.exports = new function(){
    this.isEmpty = function(str) {
  		return typeof str == 'string' && !str.trim() || typeof str == 'undefined' || str === null || str.length == 0;
	}

    this.getTime = function(){
		var d = new Date();
		return Math.floor(d.getTime()/1000);
	}
}