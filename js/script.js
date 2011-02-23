/* Author: Josh McArthur

*/

$(document).ready(function() 
{
    $('.shuffle').click(function()
    {
        $('section#keypoints article').each(function() {
            if($(this).hasClass('front'))
            {
                $(this).removeClass('front').addClass('back');
            }
            else if($(this).hasClass('middle')) 
            {
                $(this).removeClass('middle').addClass('front');
            }
            else if($(this).hasClass('back'))
            {
                $(this).removeClass('back').addClass('middle');
            }
        }); 
    });
});























