module.exports = function getQuery (url) {
  var end;
  if(url.indexOf('#') != -1) {
  	end = url.indexOf('#');
  }else {
  	end = url.length;
  } //without hash
  var str = url.substring(url.lastIndexOf('?') + 1, end),
      arr = str.split('&'),
      query = {};
  arr.forEach(function(item){
    var tempArr = item.split('=');
    query[tempArr[0]] = tempArr[1];
  });
  return query;
};