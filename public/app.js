'use strict';
console.log('working')
$('.formUpdate').hide()
$('.showUpdate').on('click',function(){
    $(this).hide()
    $(this).next().toggle()
})