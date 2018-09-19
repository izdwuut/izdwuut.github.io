var funnyBits = location.protocol + "//" + location.host + "/data/funny_bits.json";
$.get(funnyBits, function(data) {
    var item = data[Math.floor(Math.random() * data.length)];
    $('.funny-bits').html(item);
});
