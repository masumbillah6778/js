$(document).ready(function () {
    var images = [
        'images/1.jpg',
        'images/2.jpg',
        'images/3.jpg',
        'images/4.jpg',
        'images/5.jpg',
        // Add more image URLs as needed
    ];

    var index = 0;

    function changeBackground() {
        // Change background with zoom-in effect
        $(".background-container").css({
            'background-image': 'url(' + images[index] + ')',
            'transform': 'scale(1.1)' // You can adjust the scale factor
        });

        // Reset the transform property after the animation
        setTimeout(function () {
            $(".background-container").css('transform', 'scale(1)');
        }, 1000);

        // Move to the next image
        index = (index + 1) % images.length;
    }

    // Change background every 5 seconds (adjust as needed)
    setInterval(changeBackground, 5000);
});
