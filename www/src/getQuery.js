module.exports = function getQuery (url) {
  var str = url.substring(url.lastIndexOf('?') + 1),
      arr = str.split('&'),
      query = {};
  arr.forEach(function(item){
    var tempArr = item.split('=');
    query[tempArr[0]] = tempArr[1];
  });
  return query;
};